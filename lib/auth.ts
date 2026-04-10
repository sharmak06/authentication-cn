import { redirect } from "next/navigation";
import type { Profile } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  try {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return profile as Profile;
    }

    const { data: createdProfile } = await adminClient
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
        email: user.email ?? "",
        role: "user",
      })
      .select("id, full_name, email, role, created_at")
      .single();

    if (createdProfile) {
      return createdProfile as Profile;
    }
  } catch {
    // Fallback to user-scoped client if service role client is unavailable.
  }

  const { data: fetchedProfile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchedProfile) {
    return fetchedProfile as Profile;
  }

  return {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
    email: user.email ?? "",
    role: "user",
    created_at: new Date().toISOString(),
  } as Profile;
}

export async function requireAuth() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();

  if (profile.role !== "admin") {
    redirect("/user-dashboard");
  }

  return profile;
}
