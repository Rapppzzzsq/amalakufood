import Image from "next/image";
import Link from "next/link";
import { APP_ROLES } from "@/lib/roles";

export default function PilihPeranPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#fff8e8] px-5 py-12 text-[#4a2b1e]">
      <section className="flex w-full max-w-[44rem] flex-col items-center text-center">
        <p className="text-xl sm:text-[1.65rem]">Hai! Selamat Datang!</p>
        <h1 className="mt-1 font-sans text-4xl font-black tracking-[-0.055em] text-[#702b1e] sm:text-[3.4rem]">
          Amalakufood
        </h1>
        <div className="mt-6 flex size-28 items-center justify-center rounded-full bg-white p-1.5 sm:mt-7 sm:size-28">
          <Image
            src="/images/amalakufood-logo.jpeg"
            alt="Logo Amalakufood"
            width={512}
            height={512}
            priority
            className="size-full rounded-full object-contain"
          />
        </div>
        <p className="mt-6 rounded-[1.2rem] bg-[#ffd233] px-8 py-4 text-lg font-bold sm:mt-7 sm:px-10 sm:py-4 sm:text-xl">
          Masuk sebagai
        </p>
        <nav
          aria-label="Pilih peran"
          className="mt-10 grid w-full grid-cols-1 gap-x-5 gap-y-5 sm:mt-12 sm:grid-cols-2 sm:gap-y-12"
        >
          {APP_ROLES.map((role) => (
            <Link
              key={role}
              href={`/login?role=${encodeURIComponent(role)}`}
              className="flex min-h-[4.75rem] items-center justify-center rounded-2xl border-2 border-[#92796d] bg-white px-5 text-xl font-extrabold transition hover:border-[#5c2c16] hover:bg-[#fffdf7] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f5c518] sm:min-h-[5.25rem] sm:text-2xl"
            >
              {role}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
