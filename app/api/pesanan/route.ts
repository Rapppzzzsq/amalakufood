import { NextResponse } from "next/server";
import { apiErrorResponse, ApiError, badRequest, isText, readJsonObject } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { createId } from "@/lib/ids";
import { prisma } from "@/lib/prisma";

const orderInclude = {
  detail_pesanan: {
    include: { produk: true },
  },
  customer: {
    select: {
      id_customer: true,
      nama_customer: true,
      no_handphone: true,
      email_customer: true,
      jalan: true,
      no_jalan: true,
      kelurahan: true,
      kecamatan: true,
      kota: true,
      kode_pos: true,
    },
  },
  pembayaran: {
    include: { nota: true },
  },
  kasir: { select: { id_kasir: true, nama_kasir: true } },
} as const;

export async function GET(request: Request) {
  try {
    const session = getSession(request);
    if (!session || !["Customer", "Kasir", "Owner"].includes(session.role)) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const where =
      session.role === "Customer" ? { id_customer: session.profileId } : {};
    const [orders, orderCount, sales, products, customerCount] = await Promise.all([
      prisma.pesanan.findMany({
        where,
        include: orderInclude,
        orderBy: { tanggal_pesanan: "desc" },
      }),
      prisma.pesanan.count(),
      prisma.pesanan.aggregate({ _sum: { total_tagihan: true } }),
      session.role === "Owner" ? prisma.produk.findMany({ select: { stok: true } }) : Promise.resolve([]),
      session.role === "Owner" ? prisma.customer.count() : Promise.resolve(0),
    ]);

    return NextResponse.json({
      orders,
      summary: {
        jumlah_transaksi: orderCount,
        total_penjualan: Number(sales._sum.total_tagihan ?? 0),
        stok_menipis: products.filter((product) => product.stok <= 5).length,
        jumlah_customer: customerCount,
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "List orders");
  }
}

export async function POST(request: Request) {
  try {
    const session = getSession(request);
    if (session?.role !== "Customer") {
      return NextResponse.json({ error: "Checkout hanya dapat dilakukan Customer." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    if (!body || !Array.isArray(body.items)) {
      return badRequest("Item keranjang wajib diisi.");
    }
    if (!["QRIS", "Transfer Bank", "Bayar di Toko"].includes(String(body.metode_pembayaran))) {
      return badRequest("Metode pembayaran tidak valid.");
    }

    const quantities = new Map<string, number>();
    for (const item of body.items) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return badRequest("Format item keranjang tidak valid.");
      }
      const value = item as Record<string, unknown>;
      if (!isText(value.id_produk)) return badRequest("ID produk tidak valid.");
      const quantity = Number(value.jumlah);
      if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 99) {
        return badRequest("Jumlah item harus berupa bilangan bulat antara 1 dan 99.");
      }
      quantities.set(
        value.id_produk,
        (quantities.get(value.id_produk) ?? 0) + quantity,
      );
    }
    if (quantities.size === 0 || quantities.size > 50) {
      return badRequest("Keranjang harus berisi 1 sampai 50 produk.");
    }
    for (const quantity of quantities.values()) {
      if (quantity > 99) return badRequest("Jumlah item melebihi batas.");
    }

    const address =
      typeof body.alamat === "string" ? body.alamat.trim() : "";
    if (!address || address.length > 100) {
      return badRequest("Alamat pengiriman wajib diisi (maksimal 100 karakter).");
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = [...quantities.keys()];
      const products = await tx.produk.findMany({
        where: { id_produk: { in: productIds } },
      });
      if (products.length !== productIds.length) {
        throw new ApiError("Satu atau beberapa produk tidak ditemukan.", 404);
      }

      const lineItems = products.map((product) => {
        const quantity = quantities.get(product.id_produk)!;
        const priceCents = Math.round(Number(product.harga) * 100);
        return {
          product,
          quantity,
          priceCents,
          subtotalCents: priceCents * quantity,
        };
      });
      const totalCents = lineItems.reduce((sum, item) => sum + item.subtotalCents, 0);
      if (!Number.isSafeInteger(totalCents) || totalCents <= 0 || totalCents > 999_999_999_999) {
        throw new ApiError("Total pesanan tidak valid.", 400);
      }

      for (const item of lineItems) {
        const changed = await tx.produk.updateMany({
          where: {
            id_produk: item.product.id_produk,
            stok: { gte: item.quantity },
          },
          data: { stok: { decrement: item.quantity } },
        });
        if (changed.count !== 1) {
          throw new ApiError(`Stok ${item.product.nama_produk} tidak mencukupi.`, 409);
        }
      }

      await tx.customer.update({
        where: { id_customer: session.profileId },
        data: { jalan: address },
      });

      const orderId = createId("PS");
      const paymentId = createId("BY");
      const noteId = createId("NT");
      return tx.pesanan.create({
        data: {
          id_pesanan: orderId,
          id_customer: session.profileId,
          status_pesanan: "Menunggu",
          total_tagihan: totalCents / 100,
          detail_pesanan: {
            create: lineItems.map((item) => ({
              id_detail_pesanan: createId("DP"),
              id_produk: item.product.id_produk,
              jumlah: item.quantity,
              harga_satuan: item.priceCents / 100,
              subtotal: item.subtotalCents / 100,
            })),
          },
          pembayaran: {
            create: {
              id_pembayaran: paymentId,
              metode_pembayaran: String(body.metode_pembayaran),
              nominal_pembayaran: totalCents / 100,
              status_pembayaran: "Menunggu",
              nota: {
                create: {
                  id_nota: noteId,
                  no_nota: `NOTA-${noteId.slice(2)}`,
                },
              },
            },
          },
        },
        include: orderInclude,
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Create order");
  }
}

async function updateOrder(request: Request) {
  const session = getSession(request);
  if (session?.role !== "Kasir") {
    return NextResponse.json({ error: "Akses khusus Kasir." }, { status: 403 });
  }
  const body = await readJsonObject(request);
  if (!body) return badRequest("Isi permintaan tidak valid.");
  const id = typeof body.id_pesanan === "string" ? body.id_pesanan.trim() : "";
  if (!id) return badRequest("ID pesanan wajib diisi.");
  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: id },
    include: { pembayaran: true },
  });
  if (!order) throw new ApiError("Pesanan tidak ditemukan.", 404);

  const requestedPaymentStatus = body.status_pembayaran;
  const requestedOrderStatus = body.status_pesanan;
  if (
    requestedPaymentStatus !== undefined &&
    !["Berhasil", "Ditolak"].includes(String(requestedPaymentStatus))
  ) {
    return badRequest("Status pembayaran tidak valid.");
  }
  if (
    requestedOrderStatus !== undefined &&
    !["Diproses", "Divalidasi", "Selesai"].includes(String(requestedOrderStatus))
  ) {
    return badRequest("Status pesanan tidak valid.");
  }
  if (requestedPaymentStatus !== undefined && !order.pembayaran) {
    throw new ApiError("Pesanan tidak memiliki data pembayaran.", 409);
  }
  if (
    requestedOrderStatus === "Divalidasi" &&
    order.pembayaran?.status_pembayaran !== "Berhasil" &&
    requestedPaymentStatus !== "Berhasil"
  ) {
    throw new ApiError("Pembayaran harus berhasil sebelum pesanan divalidasi.", 409);
  }
  if (
    requestedOrderStatus === "Selesai" &&
    order.pembayaran?.status_pembayaran !== "Berhasil" &&
    requestedPaymentStatus !== "Berhasil"
  ) {
    throw new ApiError("Pembayaran harus berhasil sebelum pesanan diselesaikan.", 409);
  }

  const paymentStatus =
    requestedPaymentStatus === "Berhasil" || requestedPaymentStatus === "Ditolak"
      ? requestedPaymentStatus
      : undefined;
  const orderStatus =
    paymentStatus === "Berhasil"
      ? "Divalidasi"
      : paymentStatus === "Ditolak"
        ? "Dibatalkan"
        : typeof requestedOrderStatus === "string"
          ? requestedOrderStatus
          : undefined;

  const updated = await prisma.$transaction(async (tx) => {
    if (paymentStatus && order.pembayaran) {
      await tx.pembayaran.update({
        where: { id_pembayaran: order.pembayaran.id_pembayaran },
        data: { status_pembayaran: paymentStatus },
      });
    }
    await tx.pesanan.update({
      where: { id_pesanan: id },
      data: {
        ...(orderStatus ? { status_pesanan: orderStatus } : {}),
        ...(paymentStatus || requestedOrderStatus === "Divalidasi"
          ? { id_kasir: session.profileId }
          : {}),
      },
    });
    return tx.pesanan.findUniqueOrThrow({
      where: { id_pesanan: id },
      include: orderInclude,
    });
  });
  return NextResponse.json({ order: updated });
}

export async function PUT(request: Request) {
  try {
    return await updateOrder(request);
  } catch (error) {
    return apiErrorResponse(error, "Update order");
  }
}

export async function PATCH(request: Request) {
  try {
    return await updateOrder(request);
  } catch (error) {
    return apiErrorResponse(error, "Update order");
  }
}

export async function DELETE(request: Request) {
  try {
    const session = getSession(request);
    if (!session || !["Customer", "Kasir"].includes(session.role)) {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    const id = body && typeof body.id_pesanan === "string" ? body.id_pesanan.trim() : "";
    if (!id) return badRequest("ID pesanan wajib diisi.");

    await prisma.$transaction(async (tx) => {
      const order = await tx.pesanan.findUnique({
        where: { id_pesanan: id },
        include: { detail_pesanan: true, pembayaran: true },
      });
      if (!order) throw new ApiError("Pesanan tidak ditemukan.", 404);
      if (
        session.role === "Customer" &&
        (order.id_customer !== session.profileId ||
          order.pembayaran?.status_pembayaran === "Berhasil" ||
          order.status_pesanan === "Selesai")
      ) {
        throw new ApiError("Pesanan ini tidak dapat dibatalkan oleh Customer.", 403);
      }
      for (const item of order.detail_pesanan) {
        await tx.produk.update({
          where: { id_produk: item.id_produk },
          data: { stok: { increment: item.jumlah } },
        });
      }
      await tx.pesanan.delete({ where: { id_pesanan: id } });
    });
    return NextResponse.json({ message: "Pesanan berhasil dihapus." });
  } catch (error) {
    return apiErrorResponse(error, "Delete order");
  }
}
