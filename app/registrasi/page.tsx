"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

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
          username: formData.get("username"),
          email_customer: formData.get("email_customer"),
          no_handphone: formData.get("no_handphone"),
          password: formData.get("password"),
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Registrasi gagal.";
        throw new Error(message);
      }
      router.push("/customer");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Registrasi gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#fdf6e2] p-5 text-[#5c2c16]">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-xl sm:p-10">
        <Link href="/" className="block text-center text-5xl">🍰</Link>
        <h1 className="mt-4 text-center text-3xl font-black">Daftar Customer</h1>
        <p className="mt-2 text-center text-[#725944]">Bergabung bersama Amalakufood</p>
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">Nama Lengkap<input name="nama_customer" required maxLength={100} className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Username<input name="username" required minLength={3} maxLength={50} autoComplete="username" className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Email<input name="email_customer" type="email" required maxLength={100} className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">No. HP<input name="no_handphone" required minLength={8} maxLength={15} className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Password<input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="rounded-xl bg-[#f5c518] px-4 py-3 font-extrabold hover:bg-[#ffd233] disabled:opacity-50">{busy ? "Memproses..." : "Daftar"}</button>
        </form>
        <p className="mt-5 text-center text-sm">Sudah punya akun? <Link href="/login?role=Customer" className="font-bold underline">Masuk</Link></p>
      </section>
    </main>
  );
}
