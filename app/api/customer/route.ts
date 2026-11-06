import { NextResponse } from "next/server";
import { apiErrorResponse, ApiError, badRequest, readJsonObject } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = getSession(request);
    if (session?.role !== "Admin" && session?.role !== "Owner") {
      return NextResponse.json({ error: "Akses khusus Admin atau Owner." }, { status: 403 });
    }
    const customers = await prisma.customer.findMany({
      include: {
        pengguna: { select: { username: true } },
        _count: { select: { pesanan: true } },
      },
      orderBy: { nama_customer: "asc" },
    });
    return NextResponse.json({ customers });
  } catch (error) {
    return apiErrorResponse(error, "List customers");
  }
}

async function updateCustomer(request: Request) {
  const session = getSession(request);
  if (!session || !["Customer", "Admin"].includes(session.role)) {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  }
  const body = await readJsonObject(request);
  if (!body) return badRequest("Isi permintaan tidak valid.");
  const id = typeof body.id_customer === "string" ? body.id_customer.trim() : "";
  if (!id) return badRequest("ID customer wajib diisi.");
  if (session.role === "Customer" && session.profileId !== id) {
    return NextResponse.json({ error: "Tidak dapat mengubah profil customer lain." }, { status: 403 });
  }

  if ("poin" in body) {
    if (session.role !== "Admin") {
      return NextResponse.json({ error: "Hanya Admin yang dapat mengubah poin." }, { status: 403 });
    }
    const points = Number(body.poin);
    if (!Number.isSafeInteger(points) || points < 0) {
      return badRequest("Poin harus berupa bilangan bulat nol atau lebih.");
    }
    const customer = await prisma.customer.update({
      where: { id_customer: id },
      data: { poin: points },
    });
    return NextResponse.json({ customer });
  }

  const customerFields: {
    nama_customer?: string;
    no_handphone?: string;
    email_customer?: string;
    jalan?: string | null;
    no_jalan?: string | null;
    kelurahan?: string | null;
    kecamatan?: string | null;
    kota?: string | null;
    kode_pos?: string | null;
  } = {};
  const limits: Record<string, number> = {
    nama_customer: 100,
    no_handphone: 15,
    email_customer: 100,
    jalan: 100,
    no_jalan: 10,
    kelurahan: 50,
    kecamatan: 50,
    kota: 50,
    kode_pos: 10,
  };
  for (const [field, limit] of Object.entries(limits)) {
    if (!(field in body)) continue;
    const value = body[field];
    if (value !== null && typeof value !== "string") {
      return badRequest(`Nilai ${field} tidak valid.`);
    }
    const normalized = typeof value === "string" ? value.trim() : null;
    if (normalized && normalized.length > limit) {
      return badRequest(`Nilai ${field} terlalu panjang.`);
    }
    if (field === "nama_customer" && !normalized) {
      return badRequest("Nama customer wajib diisi.");
    }
    if (field === "no_handphone" && !normalized) {
      return badRequest("Nomor HP wajib diisi.");
    }
    if (field === "email_customer" && (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))) {
      return badRequest("Email tidak valid.");
    }
    switch (field) {
      case "nama_customer":
        if (normalized) customerFields.nama_customer = normalized;
        break;
      case "no_handphone":
        if (normalized) customerFields.no_handphone = normalized;
        break;
      case "email_customer":
        if (normalized) customerFields.email_customer = normalized;
        break;
      case "jalan":
        customerFields.jalan = normalized;
        break;
      case "no_jalan":
        customerFields.no_jalan = normalized;
        break;
      case "kelurahan":
        customerFields.kelurahan = normalized;
        break;
      case "kecamatan":
        customerFields.kecamatan = normalized;
        break;
      case "kota":
        customerFields.kota = normalized;
        break;
      case "kode_pos":
        customerFields.kode_pos = normalized;
        break;
    }
  }
  if (Object.keys(customerFields).length === 0) {
    return badRequest("Tidak ada data profil yang diubah.");
  }

  const customer = await prisma.customer.update({
    where: { id_customer: id },
    data: customerFields,
  });
  return NextResponse.json({ customer });
}

export async function PUT(request: Request) {
  try {
    return await updateCustomer(request);
  } catch (error) {
    return apiErrorResponse(error, "Update customer");
  }
}

export async function PATCH(request: Request) {
  try {
    return await updateCustomer(request);
  } catch (error) {
    return apiErrorResponse(error, "Update customer");
  }
}

export async function DELETE(request: Request) {
  try {
    const session = getSession(request);
    if (session?.role !== "Admin") {
      return NextResponse.json({ error: "Akses khusus Admin." }, { status: 403 });
    }
    const body = await readJsonObject(request);
    const id = body && typeof body.id_customer === "string" ? body.id_customer.trim() : "";
    if (!id) return badRequest("ID customer wajib diisi.");
    await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id_customer: id },
        select: { id_pengguna: true },
      });
      if (!customer) {
        throw new ApiError("Customer tidak ditemukan.", 404);
      }
      await tx.customer.delete({ where: { id_customer: id } });
      await tx.pengguna.delete({ where: { id_pengguna: customer.id_pengguna } });
    });
    return NextResponse.json({ message: "Customer berhasil dihapus." });
  } catch (error) {
    return apiErrorResponse(error, "Delete customer");
  }
}
