import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentProfile } from "@/lib/auth";

export default async function LoginPage() {
  const profile = await getCurrentProfile();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  if (profile) {
    redirect("/user-dashboard");
  }

  return (
    <main className="relative min-h-screen bg-[#ececf2] px-4 pb-14 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <section className="order-2 px-2 lg:order-1 lg:px-0">
          <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Welcome Back
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950 md:text-5xl">
            Sign in to
            <br />
            continue
          </h1>

          <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-slate-600 md:text-xl">
            Access your secure workspace and manage users, roles, and authentication flow with confidence.
          </p>

          <div className="mt-10">
            <p className="text-4xl font-bold tracking-[-0.03em] text-slate-950 md:text-5xl">2 mins</p>
            <p className="mt-2 text-lg text-slate-500 md:text-xl">Fast secure login</p>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <LoginForm />
          <p className="mt-5 text-center text-sm text-slate-600">
            Back to{" "}
            <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
              home
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
