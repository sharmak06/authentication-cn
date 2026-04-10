import { requireAdmin } from "@/lib/auth";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function AdminPage() {
  const profile = await requireAdmin();
  return <AdminDashboard profile={profile} />;
}
