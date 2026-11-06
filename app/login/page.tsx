import { Suspense } from "react";
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
      <LoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}
