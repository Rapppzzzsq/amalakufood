"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { AppRole } from "@/lib/roles";

type LoginClientProps = {
  role: AppRole;
  registered: boolean;
};

type ApiResponse = Record<string, unknown>;

function isRecord(value: unknown): value is ApiResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values: unknown[]): string | undefined {
  return values.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

export default function LoginClient({ role, registered }: LoginClientProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          role,
          username,
          password: formData.get("password"),
        }),
      });
      if (response.status === 404) {
        localStorage.setItem("amalakufood-demo-role", role);
        localStorage.setItem("amalakufood-demo-mode", "true");
        const demoIds: Record<AppRole, string> = {
          Customer: "C001",
          Admin: "ADM001",
          Kasir: "KSR001",
          Owner: "OWN001",
        };
        const demoNames: Record<AppRole, string> = {
          Customer: "Nurul Janatul Taqwa",
          Admin: "Admin Amala",
          Kasir: "Kasir Amala",
          Owner: "Owner Amala",
        };
        const registeredCustomer = localStorage.getItem("amalakufood-demo-profile");
        const customerProfile = registeredCustomer
          ? (JSON.parse(registeredCustomer) as {
              profile?: { id_customer?: string; nama_customer?: string };
            }).profile
          : undefined;
        localStorage.setItem(
          "amalakufood-session",
          JSON.stringify({
            role,
            username,
            id: role === "Customer" ? customerProfile?.id_customer ?? demoIds[role] : demoIds[role],
            displayName: role === "Customer" ? customerProfile?.nama_customer ?? demoNames[role] : demoNames[role],
            demo: true,
          }),
        );
        router.push(`/${role.toLowerCase()}`);
        return;
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error(
          response.ok
            ? "Respons autentikasi tidak valid."
            : "Layanan autentikasi belum tersedia.",
        );
      }
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Username atau password tidak sesuai.";
        throw new Error(message);
      }

      const user =
        isRecord(result) && isRecord(result.user) ? result.user : result;
      const id = isRecord(user)
        ? firstString(
            user.id_pengguna,
            user.id_customer,
            user.id_admin,
            user.id_kasir,
            user.id_owner,
          )
        : undefined;
      const displayName = isRecord(user)
        ? firstString(
            user.nama_customer,
            user.nama_admin,
            user.nama_kasir,
            user.nama_owner,
            user.nama,
          )
        : undefined;

      localStorage.setItem(
        "amalakufood-session",
        JSON.stringify({
          role,
          username,
          ...(id ? { id } : {}),
          ...(displayName ? { displayName } : {}),
          demo: false,
        }),
      );
      router.push(`/${role.toLowerCase()}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Login gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center bg-[#fff8e8] px-5 pb-12 pt-12 text-[#4a2b1e]">
      <Link
        href="/pilih-peran"
        aria-label="Kembali memilih peran"
        className="absolute left-5 top-6 flex size-14 items-center justify-center rounded-full border border-[#e9dcc0] bg-white transition hover:bg-[#fffdf7] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#f5c518] sm:left-[5%] sm:top-12 sm:size-16"
      >
        <Image src="/images/arrow-left.svg" alt="" width={32} height={32} />
      </Link>

      <header className="flex flex-col items-center text-center">
        <p className="text-lg sm:text-2xl">Hai! Selamat Datang!</p>
        <h1 className="mt-1 font-sans text-4xl font-black tracking-[-0.055em] text-[#702b1e] sm:text-[3.4rem]">
          Amalakufood
        </h1>
        <div className="mt-5 flex size-28 items-center justify-center rounded-full bg-white p-1.5 sm:mt-7 sm:size-28">
          <Image
            src="/images/amalakufood-logo.jpeg"
            alt="Logo Amalakufood"
            width={512}
            height={512}
            priority
            className="size-full rounded-full object-contain"
          />
        </div>
      </header>

      <form
        onSubmit={submit}
        className="mt-7 flex w-full max-w-[29.5rem] flex-1 flex-col sm:mt-3"
      >
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm font-medium sm:text-base">
            Username
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Masukkan username"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal text-[#4a2b1e] outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium sm:text-base">
            Password
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Masukkan password"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal text-[#4a2b1e] outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setNotice("Silakan hubungi Admin untuk bantuan reset password.")
            }
            className="text-sm text-[#8c7468] underline-offset-4 hover:underline sm:text-base"
          >
            Lupa Password?
          </button>
        </div>

        {registered && (
          <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">
            Akun berhasil didaftarkan. Silakan masuk.
          </p>
        )}
        {notice && (
          <p role="status" className="mt-3 text-sm text-[#725944]">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-auto min-h-[4.1rem] w-full rounded-2xl bg-[#ffd233] px-5 text-lg font-bold text-[#4a2b1e] transition hover:bg-[#f5c518] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#5c2c16] disabled:cursor-wait disabled:opacity-60 sm:mb-5 sm:min-h-[4.5rem] sm:text-xl"
        >
          {busy
            ? "Memproses..."
            : role === "Customer"
              ? "Masuk"
              : `Masuk sebagai ${role}`}
        </button>

        {role === "Customer" && (
          <p className="mt-4 text-center text-sm text-[#8c7468] sm:text-base">
            Belum punya akun?{" "}
            <Link
              href="/registrasi"
              className="font-semibold text-[#702b1e] hover:underline"
            >
              Daftar
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
