import Link from "next/link";

type VerifyEmailPageProps = {
  searchParams?: {
    email?: string;
  };
};

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const email = searchParams?.email;

  return (
    <main className="min-h-screen bg-[#ececf2] px-4 pb-14 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto w-full max-w-[760px] rounded-2xl border border-white/45 bg-white/70 p-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10">
        <p className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          Verify Email
        </p>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-4xl">
          Check your inbox
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          We sent a confirmation link{email ? ` to ${email}` : ""}. Open the email and click the link to activate your account.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
          If you do not see the email, check spam or wait a few minutes before trying again.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Go to Login
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          >
            Back to Register
          </Link>
        </div>
      </div>
    </main>
  );
}
