import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/current-admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getCurrentAdmin();
  // Défense en profondeur (le middleware protège déjà en amont).
  if (!admin) redirect("/admin/login");

  return <AdminShell admin={{ name: admin.name, email: admin.email }}>{children}</AdminShell>;
}
