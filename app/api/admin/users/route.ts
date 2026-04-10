import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    const { data: self, error: selfError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (selfError) {
      return NextResponse.json({ error: selfError.message }, { status: 500 });
    }

    const selfRole = (self as { role?: "user" | "admin" } | null)?.role;

    if (selfRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    return NextResponse.json({ users: profiles ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
