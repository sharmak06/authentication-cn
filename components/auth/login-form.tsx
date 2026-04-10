"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const setProfile = useAuthStore((state) => state.setProfile);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword(values);

    if (error || !data.user) {
      toast.error(error?.message ?? "Login failed");
      setIsLoading(false);
      return;
    }

    const { data: fetchedProfile } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("id", data.user.id)
      .maybeSingle();

    let profile = fetchedProfile;

    if (!profile) {
      const fallbackProfile = {
        id: data.user.id,
        full_name: (data.user.user_metadata?.full_name as string | undefined) ?? null,
        email: data.user.email ?? values.email,
      };

      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert(fallbackProfile)
        .select("id, full_name, email, role, created_at")
        .single();

      profile = createdProfile ?? null;
    }

    setProfile(profile ?? null);
    toast.success("Welcome back");
    const destination = profile?.role === "admin" ? "/admin" : "/user-dashboard";
    window.location.assign(destination);
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-[420px] rounded-[24px] border border-white/45 bg-white/55 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Sign in</CardTitle>
        <CardDescription className="text-sm text-slate-600">Access your AuthSystem Pro account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-900"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-900"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
            ) : null}
          </div>
          <Button
            className="h-11 w-full rounded-full bg-[linear-gradient(180deg,#2d2d2d_0%,#111111_100%)] text-white shadow-[inset_-4px_-6px_20px_0px_rgba(201,201,201,0.08),inset_4px_4px_8px_0px_rgba(29,29,29,0.24)] hover:brightness-110"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-slate-900 hover:text-slate-700">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
