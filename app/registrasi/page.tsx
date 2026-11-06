"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type ApiResponse = {
  error?: unknown;
};

function isApiResponse(value: unknown): value is ApiResponse {
  return typeof value === "object" && value !== null;
}

export default function RegistrasiPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          nama_customer: formData.get("nama_customer"),
          alamat: formData.get("alamat"),
          username: formData.get("username"),
          email_customer: formData.get("email_customer"),
          no_handphone: formData.get("no_handphone"),
          password: formData.get("password"),
        }),
      });
      if (response.status === 404) {
        const username = String(formData.get("username") ?? "");
        const user = {
          role: "Customer",
          username,
          profile: {
            id_customer: `C${String(Date.now()).slice(-6)}`,
            nama_customer: String(formData.get("nama_customer") ?? ""),
            email_customer: String(formData.get("email_customer") ?? ""),
            no_handphone: String(formData.get("no_handphone") ?? ""),
            jalan: String(formData.get("alamat") ?? ""),
            poin: 0,
          },
        };
        localStorage.setItem("amalakufood-demo-profile", JSON.stringify(user));
        localStorage.setItem("amalakufood-demo-mode", "true");
        router.push("/login?role=Customer&registered=1");
        return;
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error(
          response.ok
            ? "Respons registrasi tidak valid."
            : "Layanan autentikasi belum tersedia.",
        );
      }
      const result: unknown = await response.json();

      if (!response.ok) {
        const message =
          isApiResponse(result) && typeof result.error === "string"
            ? result.error
            : "Registrasi gagal. Silakan periksa kembali data Anda.";
        throw new Error(message);
      }

      router.push("/login?role=Customer&registered=1");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Registrasi gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-[#fff8e8] px-5 pb-4 text-[#4a2b1e] sm:px-8">
      <header className="flex items-center gap-4 pt-6 sm:pt-8">
        <Link
          href="/login?role=Customer"
          aria-label="Kembali ke halaman login"
          className="flex size-12 items-center justify-center rounded-full border border-[#e9dcc0] bg-white transition hover:bg-[#fffdf7] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#f5c518] sm:size-16"
        >
          <Image src="/images/arrow-left.svg" alt="" width={32} height={32} />
        </Link>
        <h1 className="text-xl font-semibold sm:text-2xl">Daftar Akun</h1>
      </header>

      <form
        onSubmit={submit}
        className="mt-8 flex flex-1 flex-col sm:mt-12"
      >
        <div className="mx-auto grid w-full max-w-[83rem] grid-cols-1 gap-x-[clamp(2rem,14vw,12.7rem)] gap-y-5 sm:grid-cols-2 sm:gap-y-4">
          <label className="grid gap-2 text-sm font-medium sm:text-base">
            Nama Lengkap
            <input
              name="nama_customer"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Masukkan nama lengkap"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium sm:text-base sm:col-start-2 sm:row-start-1">
            Alamat Lengkap
            <input
              name="alamat"
              type="text"
              required
              maxLength={255}
              autoComplete="street-address"
              placeholder="Masukkan alamat lengkap"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            No. Handphone
            <input
              name="no_handphone"
              type="tel"
              required
              minLength={8}
              maxLength={15}
              autoComplete="tel"
              placeholder="Masukkan no. handphone"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium sm:col-start-2 sm:row-start-2">
            Username
            <input
              name="username"
              type="text"
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
              placeholder="Masukkan username"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              name="email_customer"
              type="email"
              required
              maxLength={100}
              autoComplete="email"
              placeholder="Masukkan email"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium sm:col-start-2 sm:row-start-3">
            <span>
              Password{" "}
              <span className="font-normal text-[#8c7468]">
                (minimal 8 karakter)
              </span>
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="Masukkan password"
              className="min-h-16 w-full rounded-xl border-2 border-[#e9dcc0] bg-white px-4 text-base font-normal outline-none placeholder:text-[#8c7468] focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/30 sm:text-lg"
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-auto mt-6 w-full max-w-2xl rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-8 sm:mt-auto sm:pt-8">
          <button
            type="submit"
            disabled={busy}
            className="mx-auto min-h-[4.25rem] w-full max-w-[36.25rem] rounded-2xl bg-[#ffd233] px-5 text-lg font-bold transition hover:bg-[#f5c518] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#5c2c16] disabled:cursor-wait disabled:opacity-60 sm:mb-4 sm:min-h-[5.75rem] sm:text-xl"
          >
            {busy ? "Memproses..." : "Daftar"}
          </button>
        </div>
      </form>

      <p className="mt-5 text-center font-sans text-lg font-black tracking-[-0.04em] text-[#702b1e]">
        Amalakufood
      </p>
    </main>
  );
}
