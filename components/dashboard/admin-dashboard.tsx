"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";

type AdminDashboardProps = {
  profile: Profile;
};

type AdminUser = {
  id: string;
  full_name: string | null;
  email: string;
  role: "user" | "admin";
  created_at: string;
};

export function AdminDashboard({ profile }: AdminDashboardProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const response = await axios.get<{ users: AdminUser[] }>("/api/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? "Failed to fetch users"
        : "Failed to fetch users";
      toast.error(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function promoteToAdmin(userId: string) {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: "admin" });
      toast.success("User promoted to admin");
      fetchUsers();
    } catch (error) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? "Failed to promote user"
        : "Failed to promote user";
      toast.error(message);
    }
  }

  async function removeUser(userId: string) {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("User removed");
      fetchUsers();
    } catch (error) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? "Failed to remove user"
        : "Failed to remove user";
      toast.error(message);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#ececf2] px-4 pb-12 pt-24 text-slate-900 md:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[1200px] space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-white/45 bg-white/60 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-600">AuthSystem Pro</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">Signed in as {profile.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="admin">admin</Badge>
            <LogoutButton className="border-slate-300 bg-white/60 text-slate-800 hover:bg-white" />
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Admins</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {users.filter((item) => item.role === "admin").length}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Standard Users</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {users.filter((item) => item.role === "user").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border border-white/45 bg-white/60 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-950">Registered Users</CardTitle>
            <CardDescription className="text-slate-600">Promote users to admin or remove access from your system.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-600">Loading users...</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/70">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="border-b border-slate-200 bg-white/70 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                      <th className="px-4 py-3 text-left font-medium">Created</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-slate-900">{user.full_name ?? "Unknown"}</td>
                        <td className="px-4 py-3 text-slate-700">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === "admin" ? "admin" : "secondary"}>{user.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {user.role === "user" ? (
                              <Button size="sm" onClick={() => promoteToAdmin(user.id)}>
                                Promote
                              </Button>
                            ) : null}
                            {user.id !== profile.id ? (
                              <Button size="sm" variant="destructive" onClick={() => removeUser(user.id)}>
                                Remove
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
