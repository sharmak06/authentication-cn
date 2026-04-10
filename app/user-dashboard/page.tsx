import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { UserDashboard } from "@/components/dashboard/user-dashboard";

export default async function UserDashboardPage() {
  const profile = await requireAuth();

  if (profile.role === "admin") {
    redirect("/admin");
  }

  return <UserDashboard profile={profile} />;
}
