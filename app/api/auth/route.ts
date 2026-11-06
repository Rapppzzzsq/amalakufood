import { NextResponse } from "next/server";
import { apiErrorResponse, badRequest, isText, readJsonObject } from "@/lib/api";
import {
  createSession,
  assertSessionConfig,
  getSession,
  hashPassword,
  roles,
  sessionCookie,
  clearedSessionCookie,
  verifyPassword,
  type UserRole,
} from "@/lib/auth";
import { createId } from "@/lib/ids";
import { prisma } from "@/lib/prisma";

const userInclude = {
  admin: true,
  customer: true,
  kasir: true,
  owner: true,
} as const;

function publicUser(user: {
  id_pengguna: string;
  username: string;
  role: string;
  admin: { id_admin: string; nama_admin: string; no_handphone: string; email_admin: string } | null;
  customer: { id_customer: string; nama_customer: string; no_handphone: string; email_customer: string; poin: number; jalan: string | null; no_jalan: string | null; kelurahan: string | null; kecamatan: string | null; kota: string | null; kode_pos: string | null } | null;
  kasir: { id_kasir: string; nama_kasir: string; no_handphone: string; email_kasir: string } | null;
  owner: { id_owner: string; nama_owner: string; no_handphone: string; email_owner: string } | null;
}) {
  switch (user.role) {
    case "Admin":
      return user.admin
        ? { ...user.admin }
        : null;
    case "Customer":
      return user.customer
        ? { ...user.customer }
        : null;
    case "Kasir":
      return user.kasir
        ? { ...user.kasir }
        : null;
    case "Owner":
      return user.owner
        ? { ...user.owner }
        : null;
    default:
      return null;
  }
}

function sessionDetails(user: Parameters<typeof publicUser>[0]) {
  const profile = publicUser(user);
  if (!profile || !roles.includes(user.role as UserRole)) return null;

  const role = user.role as UserRole;
  const profileId =
    role === "Admin"
      ? user.admin?.id_admin
      : role === "Customer"
        ? user.customer?.id_customer
        : role === "Kasir"
          ? user.kasir?.id_kasir
          : user.owner?.id_owner;
  const name =
    role === "Admin"
      ? user.admin?.nama_admin
      : role === "Customer"
        ? user.customer?.nama_customer
        : role === "Kasir"
          ? user.kasir?.nama_kasir
          : user.owner?.nama_owner;

  return profileId && name
    ? {
        session: createSession({
          userId: user.id_pengguna,
          profileId,
          username: user.username,
          role,
          name,
        }),
        user: { id_pengguna: user.id_pengguna, username: user.username, role, profile },
      }
    : null;
}

export async function GET(request: Request) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }

    const user = await prisma.pengguna.findUnique({
      where: { id_pengguna: session.userId },
      include: userInclude,
    });
    const details = user ? sessionDetails(user) : null;
    if (!details) {
      return NextResponse.json(
        { error: "Sesi tidak valid." },
        { status: 401, headers: { "Set-Cookie": clearedSessionCookie() } },
      );
    }

    return NextResponse.json({ user: details.user });
  } catch (error) {
    return apiErrorResponse(error, "Read current user");
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);
    if (!body) return badRequest("Isi permintaan tidak valid.");

    if (body.action === "register") {
      const username = typeof body.username === "string" ? body.username.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      const name =
        typeof body.nama_customer === "string" ? body.nama_customer.trim() : "";
      const phone =
        typeof body.no_handphone === "string" ? body.no_handphone.trim() : "";
      const email =
        typeof body.email_customer === "string"
          ? body.email_customer.trim().toLowerCase()
          : "";

      if (
        username.length < 3 ||
        username.length > 50 ||
        password.length < 8 ||
        password.length > 72 ||
        name.length < 2 ||
        name.length > 100 ||
        phone.length < 8 ||
        phone.length > 15 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 100
      ) {
        return badRequest("Periksa kembali nama, username, password, nomor HP, dan email.");
      }
      assertSessionConfig();

      const user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.pengguna.create({
          data: {
            id_pengguna: createId("PG"),
            username,
            password: await hashPassword(password),
            role: "Customer",
          },
        });
        const customer = await tx.customer.create({
          data: {
            id_customer: createId("C"),
            id_pengguna: createdUser.id_pengguna,
            nama_customer: name,
            no_handphone: phone,
            email_customer: email,
            jalan: isText(body.jalan) ? body.jalan.trim() : null,
            no_jalan: isText(body.no_jalan) ? body.no_jalan.trim() : null,
            kelurahan: isText(body.kelurahan) ? body.kelurahan.trim() : null,
            kecamatan: isText(body.kecamatan) ? body.kecamatan.trim() : null,
            kota: isText(body.kota) ? body.kota.trim() : "Padang",
            registrasi: {
              create: { id_registrasi: createId("REG", 7) },
            },
          },
        });
        return { ...createdUser, customer };
      });

      const details = sessionDetails({
        ...user,
        admin: null,
        kasir: null,
        owner: null,
      });
      if (!details) throw new Error("New customer profile could not be loaded.");
      return NextResponse.json(
        { user: details.user },
        { status: 201, headers: { "Set-Cookie": sessionCookie(details.session) } },
      );
    }

    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const requestedRole = body.role;
    if (
      !username ||
      !password ||
      typeof requestedRole !== "string" ||
      !roles.includes(requestedRole as UserRole)
    ) {
      return badRequest("Username, password, dan role wajib diisi.");
    }
    assertSessionConfig();

    const user = await prisma.pengguna.findUnique({
      where: { username },
      include: userInclude,
    });
    if (
      !user ||
      user.role !== requestedRole ||
      !(await verifyPassword(password, user.password))
    ) {
      return NextResponse.json(
        { error: "Username, password, atau peran tidak sesuai." },
        { status: 401 },
      );
    }

    if (!user.password.startsWith("scrypt$")) {
      await prisma.pengguna.update({
        where: { id_pengguna: user.id_pengguna },
        data: { password: await hashPassword(password) },
      });
    }

    const details = sessionDetails(user);
    if (!details) {
      return NextResponse.json(
        { error: "Profil pengguna tidak ditemukan." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { user: details.user },
      { headers: { "Set-Cookie": sessionCookie(details.session) } },
    );
  } catch (error) {
    return apiErrorResponse(error, "Authenticate user");
  }
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Sesi berhasil diakhiri." },
    { headers: { "Set-Cookie": clearedSessionCookie() } },
  );
}
