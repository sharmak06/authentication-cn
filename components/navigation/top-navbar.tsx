import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import type { Profile } from "@/types/database";

type TopNavbarProps = {
  profile: Profile | null;
};

export function TopNavbar({ profile }: TopNavbarProps) {
  const dashboardHref = profile?.role === "admin" ? "/admin" : "/user-dashboard";
  const dashboardLabel = profile?.role === "admin" ? "Admin Dashboard" : "Dashboard";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-2 md:px-6">
      <nav className="mx-auto grid h-14 w-full max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-slate-200 bg-white/80 px-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-wide text-slate-900">
            AuthSystem Pro
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-700/95 transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/#features" className="text-sm font-medium text-slate-700/95 transition hover:text-slate-900">
            Features
          </Link>
          {profile ? (
            <Link href={dashboardHref} className="text-sm font-medium text-slate-700/95 transition hover:text-slate-900">
              {dashboardLabel}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          {!profile ? (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2d2d2d_0%,#111111_100%)] px-4 text-sm font-medium text-white shadow-[inset_-4px_-6px_20px_0px_rgba(201,201,201,0.08),inset_4px_4px_8px_0px_rgba(29,29,29,0.24)] transition hover:brightness-110"
              >
                Signup
              </Link>
            </>
          ) : (
            <LogoutButton className="h-9 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50" />
          )}
        </div>
      </nav>
    </header>
  );
}
