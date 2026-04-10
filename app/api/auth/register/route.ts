import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const registerRequestSchema = z.object({
  fullName: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const values = registerRequestSchema.parse(body);
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email: values.email,
      password: values.password,
      email_confirm: true,
      user_metadata: {
        full_name: values.fullName,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        full_name: values.fullName,
        email: values.email,
        role: "user",
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid registration data." }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to create account.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}