import { NextResponse } from "next/server";
import { apiErrorResponse, badRequest, isText, readJsonObject } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { createId } from "@/lib/ids";
import { prisma } from "@/lib/prisma";

function productFields(body: Record<string, unknown>, partial = false) {
  const data: {
    nama_produk?: string;
    kategori?: string;
    harga?: number;
    stok?: number;
    deskripsi?: string | null;
  } = {};

  if (!partial || "nama_produk" in body) {
    if (!isText(body.nama_produk) || body.nama_produk.trim().length > 100) {
      return null;
    }
    data.nama_produk = body.nama_produk.trim();
  }
  if (!partial || "kategori" in body) {
    if (!isText(body.kategori) || body.kategori.trim().length > 50) return null;
    data.kategori = body.kategori.trim();
  }
  if (!partial || "harga" in body) {
    const price = Number(body.harga);
    if (!Number.isFinite(price) || price <= 0 || price > 9_999_999_999.99) {
      return null;
    }
    data.harga = price;
  }
  if (!partial || "stok" in body) {
    const stock = Number(body.stok);
    if (!Number.isSafeInteger(stock) || stock < 0) return null;
    data.stok = stock;
  }
  if ("deskripsi" in body) {
    if (body.deskripsi !== null && typeof body.deskripsi !== "string") return null;
    data.deskripsi =
      typeof body.deskripsi === "string" ? body.deskripsi.trim() || null : null;
  }
  return data;
}

function isAdmin(request: Request) {
  const session = getSession(request);
  return session?.role === "Admin" ? session : null;
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const category = params.get("kategori")?.trim();
    const search = params.get("search")?.trim();
    const products = await prisma.produk.findMany({
      where: {
        ...(category && category !== "Semua" ? { kategori: category } : {}),
        ...(search
          ? { nama_produk: { contains: search, mode: "insensitive" } }
          : {}),
      },
      orderBy: { nama_produk: "asc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    return apiErrorResponse(error, "List products");
  }
}

export async function POST(request: Request) {
  try {
    const session = isAdmin(request);
    if (!session) {
      return NextResponse.json({ error: "Akses khusus Admin." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    if (!body) return badRequest("Isi permintaan tidak valid.");
    const data = productFields(body);
    if (!data) return badRequest("Nama, kategori, harga, stok, atau deskripsi tidak valid.");

    const product = await prisma.produk.create({
      data: {
        id_produk: createId("P"),
        id_admin: session.profileId,
        nama_produk: data.nama_produk!,
        kategori: data.kategori!,
        harga: data.harga!,
        stok: data.stok!,
        deskripsi: data.deskripsi ?? null,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, "Create product");
  }
}

async function updateProduct(request: Request) {
  const session = isAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Akses khusus Admin." }, { status: 403 });
  }
  const body = await readJsonObject(request);
  if (!body) return badRequest("Isi permintaan tidak valid.");
  const id = typeof body.id_produk === "string" ? body.id_produk.trim() : "";
  if (!id) return badRequest("ID produk wajib diisi.");
  const data = productFields(body, true);
  if (!data || Object.keys(data).length === 0) {
    return badRequest("Data produk tidak valid atau tidak ada yang diubah.");
  }

  const product = await prisma.produk.update({
    where: { id_produk: id },
    data,
  });
  return NextResponse.json({ product });
}

export async function PUT(request: Request) {
  try {
    return await updateProduct(request);
  } catch (error) {
    return apiErrorResponse(error, "Update product");
  }
}

export async function PATCH(request: Request) {
  try {
    return await updateProduct(request);
  } catch (error) {
    return apiErrorResponse(error, "Update product");
  }
}

export async function DELETE(request: Request) {
  try {
    const session = isAdmin(request);
    if (!session) {
      return NextResponse.json({ error: "Akses khusus Admin." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    const id = body && typeof body.id_produk === "string" ? body.id_produk.trim() : "";
    if (!id) return badRequest("ID produk wajib diisi.");
    await prisma.produk.delete({ where: { id_produk: id } });
    return NextResponse.json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    return apiErrorResponse(error, "Delete product");
  }
}
