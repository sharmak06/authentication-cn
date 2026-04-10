import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { user, supabase, response } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith("/dashboard") ||
    path.startsWith("/user-dashboard") ||
    path.startsWith("/admin");

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && profile.role !== "admin") {
      return NextResponse.redirect(new URL("/user-dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/user-dashboard/:path*", "/admin/:path*"],
};
