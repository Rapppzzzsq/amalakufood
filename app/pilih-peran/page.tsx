import Link from "next/link";

const roles = ["Customer", "Kasir", "Admin", "Owner"] as const;

export default function PilihPeranPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fdf6e2] p-5 text-[#5c2c16]">
      <section className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-xl sm:p-12">
        <p className="text-6xl">🍰</p>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#997136]">Hai! Selamat Datang!</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Amalakufood</h1>
        <p className="mt-6 inline-flex rounded-full bg-[#f5c518] px-5 py-2 font-bold">Masuk sebagai</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {roles.map((role) => (
            <Link key={role} href={`/login?role=${role}`} className="rounded-2xl border-2 border-[#f5c518] px-5 py-4 font-extrabold transition hover:bg-[#fff0ba]">
              {role}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
