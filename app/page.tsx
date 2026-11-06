import Link from "next/link";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5c518] p-6 text-center text-[#5c2c16]">
      <section className="max-w-2xl">
        <div aria-hidden="true" className="text-8xl drop-shadow-sm">🍰</div>
        <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl">Amalakufood</h1>
        <p className="mt-4 text-lg font-semibold tracking-wide sm:text-2xl">Fresh From Our Oven</p>
        <Link href="/pilih-peran" className="mt-10 inline-flex min-w-48 justify-center rounded-full bg-white px-10 py-4 text-lg font-extrabold shadow-lg transition hover:-translate-y-0.5 hover:bg-[#fff8e4]">Mulai</Link>
      </section>
    </main>
  );
}
