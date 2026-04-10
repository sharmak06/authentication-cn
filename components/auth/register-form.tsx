"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create account.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        throw signInError;
      }

      toast.success("Registration successful.");
      router.push("/user-dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      toast.error(message);
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-[420px] rounded-[24px] border border-white/45 bg-white/55 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Create account</CardTitle>
        <CardDescription className="text-sm text-slate-600">Register in seconds and secure your access</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700">Full name</Label>
            <Input
              id="fullName"
              placeholder="Alex Parker"
              className="border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-900"
              {...form.register("fullName")}
            />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
            ) : null}
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-700">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-900"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
            ) : null}
          </div>
          <Button
            className="h-11 w-full rounded-full bg-[linear-gradient(180deg,#2d2d2d_0%,#111111_100%)] text-white shadow-[inset_-4px_-6px_20px_0px_rgba(201,201,201,0.08),inset_4px_4px_8px_0px_rgba(29,29,29,0.24)] hover:brightness-110"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
