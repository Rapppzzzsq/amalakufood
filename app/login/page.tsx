import { Suspense } from "react";
import LoginClient from "./login-client";
import { isAppRole } from "@/lib/roles";

type LoginPageProps = {
  searchParams: Promise<{
    role?: string | string[];
    registered?: string | string[];
  }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-svh place-items-center bg-[#fff8e8] text-[#4a2b1e]">
          Memuat halaman masuk...
        </main>
      }
    >
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const requestedRole = Array.isArray(params.role) ? params.role[0] : params.role;
  const registered = Array.isArray(params.registered)
    ? params.registered[0]
    : params.registered;

  return (
    <LoginClient
      role={requestedRole && isAppRole(requestedRole) ? requestedRole : "Customer"}
      registered={registered === "1"}
    />
  );
}
