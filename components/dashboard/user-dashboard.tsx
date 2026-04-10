"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoutButton } from "@/components/auth/logout-button";

type UserDashboardProps = {
  profile: Profile;
};

export function UserDashboard({ profile }: UserDashboardProps) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function saveProfile() {
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null })
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
      setIsSaving(false);
      return;
    }

    toast.success("Profile updated");
    setIsSaving(false);
  }

  return (
    <main className="relative min-h-screen bg-[#ececf2] px-4 pb-12 pt-24 text-slate-900 md:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[1200px] space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-white/45 bg-white/60 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-600">AuthSystem Pro</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">User Dashboard</h1>
            <p className="mt-2 text-slate-700">Welcome, {profile.full_name ?? "User"}</p>
            <p className="text-sm text-slate-600">{profile.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={profile.role === "admin" ? "admin" : "secondary"}>{profile.role}</Badge>
            {profile.role === "admin" ? (
              <Link href="/admin">
                <Button>Go to Admin Panel</Button>
              </Link>
            ) : null}
            <LogoutButton className="border-slate-300 bg-white/60 text-slate-800 hover:bg-white" />
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Account Type</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950 capitalize">{profile.role}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Profile Created</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{new Date(profile.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Profile ID</p>
              <p className="mt-1 truncate font-mono text-xs text-slate-700">{profile.id}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
              <ShieldCheck className="h-5 w-5 text-indigo-600" /> Protected Zone
            </CardTitle>
            <CardDescription className="text-slate-600">
              This content is available only for authenticated users via Supabase SSR session checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/75 p-4">
              <p className="text-sm text-slate-500">Access Level</p>
              <p className="mt-1 text-sm font-medium text-slate-900">Authenticated User</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/75 p-4">
              <p className="text-sm text-slate-500">Session</p>
              <p className="mt-1 text-sm font-medium text-slate-900">Active and verified</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">User Data</CardTitle>
            <CardDescription className="text-slate-600">Update and save your profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dashboard-email" className="text-slate-700">Email</Label>
              <Input
                id="dashboard-email"
                value={profile.email}
                disabled
                className="cursor-not-allowed border-slate-300 bg-white/80 text-slate-700 opacity-90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboard-full-name" className="text-slate-700">Full Name</Label>
              <Input
                id="dashboard-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 focus-visible:ring-slate-900"
              />
            </div>

            <Button
              onClick={saveProfile}
              disabled={isSaving}
              className="h-11 rounded-full bg-[linear-gradient(180deg,#2d2d2d_0%,#111111_100%)] text-white shadow-[inset_-4px_-6px_20px_0px_rgba(201,201,201,0.08),inset_4px_4px_8px_0px_rgba(29,29,29,0.24)] hover:brightness-110"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
