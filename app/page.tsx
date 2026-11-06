import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center bg-[#ffd233] px-5 pb-[max(3rem,14vh)] pt-[max(3rem,13vh)] text-[#5c2c16]">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-48 items-center justify-center rounded-full bg-white p-2 shadow-sm sm:size-[204px]">
          <Image
            src="/images/amalakufood-logo.jpeg"
            alt="Logo Amalakufood"
            width={512}
            height={512}
            priority
            className="size-full rounded-full object-contain"
          />
        </div>
        <h1 className="mt-4 font-sans text-4xl font-black tracking-[-0.055em] text-[#702b1e] sm:text-[3.4rem]">
          Amalakufood
        </h1>
        <p className="mt-1 text-xl sm:text-[1.65rem]">
          Fresh From Our Oven
        </p>
      </div>

      <Link
        href="/pilih-peran"
        className="mt-auto flex min-h-[4.5rem] w-full max-w-[41rem] items-center justify-center rounded-[1.15rem] border-2 border-[#5c2c16] bg-white px-6 text-xl font-bold shadow-sm transition hover:bg-[#fff8e8] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#5c2c16] sm:text-2xl"
      >
        Mulai
      </Link>
    </main>
  );
}
