import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const profile = await requireAuth();

  if (profile.role === "admin") {
    redirect("/admin");
  }

  redirect("/user-dashboard");
}
