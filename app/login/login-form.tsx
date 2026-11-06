"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const roles = ["Customer", "Kasir", "Admin", "Owner"] as const;
type Role = (typeof roles)[number];

export default function LoginForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
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
          action: "login",
          role,
          username: formData.get("username"),
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
            : "Login gagal.";
        throw new Error(message);
      }
      router.push(`/${role.toLowerCase()}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Login gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#fdf6e2] p-5 text-[#5c2c16]">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl sm:p-10">
        <Link href="/" className="block text-center text-5xl">🍰</Link>
        <h1 className="mt-4 text-center text-3xl font-black">Masuk Amalakufood</h1>
        <p className="mt-2 text-center text-[#725944]">Fresh From Our Oven</p>
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">
            Masuk sebagai
            <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="rounded-xl border border-[#d8c49b] bg-white px-3 py-3">
              {roles.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Username
            <input name="username" required autoComplete="username" className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Password
            <input name="password" type="password" required autoComplete="current-password" className="rounded-xl border border-[#d8c49b] px-3 py-3 font-normal" />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="rounded-xl bg-[#f5c518] px-4 py-3 font-extrabold hover:bg-[#ffd233] disabled:opacity-50">
            {busy ? "Memproses..." : `Masuk sebagai ${role}`}
          </button>
        </form>
        <p className="mt-4 text-right text-sm"><a href="#" onClick={(event) => { event.preventDefault(); setError("Silakan hubungi Admin untuk bantuan reset password."); }} className="font-semibold underline">Lupa Password?</a></p>
        {role === "Customer" && <p className="mt-5 text-center text-sm">Belum punya akun? <Link href="/registrasi" className="font-bold underline">Daftar</Link></p>}
        <Link href="/pilih-peran" className="mt-5 block text-center text-sm font-semibold text-[#725944]">Kembali memilih peran</Link>
      </section>
    </main>
  );
}
