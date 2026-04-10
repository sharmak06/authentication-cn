import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type RouteParams = {
  params: {
    id: string;
  };
};

async function ensureAdmin() {
  const supabase = createClient();
  const adminClient = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401 as const, message: "Unauthorized", userId: null };
  }

  const { data: self, error: selfError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (selfError) {
    return { ok: false, status: 500 as const, message: selfError.message, userId: user.id };
  }

  const selfRole = (self as { role?: "user" | "admin" } | null)?.role;

  if (selfRole !== "admin") {
    return { ok: false, status: 403 as const, message: "Forbidden", userId: user.id };
  }

  return { ok: true, status: 200 as const, message: "OK", userId: user.id };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await ensureAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = (await request.json()) as { role?: "user" | "admin" };

  if (!body.role || !["user", "admin"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { data: targetUser, error: targetUserError } = await adminClient.auth.admin.getUserById(params.id);

  if (targetUserError) {
    return NextResponse.json({ error: targetUserError.message }, { status: 500 });
  }

  if (!targetUser.user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const targetProfile = targetUser.user.user_metadata ?? {};
  const fullName =
    typeof targetProfile.full_name === "string" && targetProfile.full_name.trim().length > 0
      ? targetProfile.full_name
      : null;

  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert(
      {
        id: params.id,
        full_name: fullName,
        email: targetUser.user.email ?? "",
        role: body.role,
      },
      { onConflict: "id" },
    );

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(params.id, {
    user_metadata: {
      ...targetProfile,
      role: body.role,
      full_name: fullName ?? undefined,
    },
  });

  if (authUpdateError) {
    return NextResponse.json({ error: authUpdateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await ensureAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (auth.userId === params.id) {
    return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(params.id);

  if (authDeleteError) {
    return NextResponse.json({ error: authDeleteError.message }, { status: 500 });
  }

  const { error: profileDeleteError } = await adminClient
    .from("profiles")
    .delete()
    .eq("id", params.id);

  if (profileDeleteError) {
    return NextResponse.json({ error: profileDeleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
