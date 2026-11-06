import { Suspense } from "react";
<<<<<<< HEAD
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
=======
import LoginForm from "./login-form";

const roles = ["Customer", "Kasir", "Admin", "Owner"] as const;
type Role = (typeof roles)[number];

async function LoginPageContent({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = roles.includes(role as Role) ? (role as Role) : "Customer";
  return <LoginForm initialRole={initialRole} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-[#fdf6e2] text-[#5c2c16]">Memuat halaman masuk...</main>}>
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}
<<<<<<< HEAD

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
=======
>>>>>>> 3ce4b50aed49796525d704714b26962f4a473fd6
