"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Inter, Instrument_Serif } from "next/font/google";
import { Circle, Shield, Sparkles, Star } from "lucide-react";

const geist = Inter({ subsets: ["latin"], weight: ["500"] });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["italic"] });

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Home() {
  return (
    <main className="relative -mt-20 min-h-screen overflow-hidden bg-white text-slate-900">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover [transform:scaleY(-1)] absolute inset-0 z-0">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 min-h-screen"
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 pb-16 pt-[170px] md:px-10 md:pt-[210px]">
          <motion.p
            variants={item}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-600"
          >
            <Sparkles className="h-3.5 w-3.5 text-slate-800" />
            Enterprise-grade authentication
          </motion.p>

          <motion.h1
            variants={item}
            className={`${geist.className} max-w-[1100px] text-[52px] font-medium leading-[0.94] tracking-[-0.04em] text-slate-900 md:text-[80px]`}
          >
            AuthSystem{" "}
            <span className={`${instrumentSerif.className} text-[72px] italic tracking-[-0.02em] md:text-[100px]`}>
              Pro
            </span>
          </motion.h1>

          <motion.p variants={item} className={`${geist.className} max-w-[554px] text-[18px] text-[#373a46]/80`}>
            Secure sign-up, login, session persistence, role management, and modern admin tooling built on Next.js 14 and Supabase.
          </motion.p>

          <motion.div variants={item} className="flex w-full max-w-[760px] flex-col gap-5">
            <div className="flex w-full flex-col items-center gap-2 rounded-[40px] border border-black/10 bg-[#fcfcfc] p-2 shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)] md:flex-row">
              <input
                type="email"
                placeholder="Enter your work email"
                className={`${geist.className} h-12 w-full rounded-[32px] bg-transparent px-5 text-[16px] text-slate-900 placeholder:text-slate-500 focus:outline-none`}
              />

              <div className="flex w-full gap-2 md:w-auto">
                <Link href="/register" className="w-full md:w-auto">
                  <button
                    className="h-12 w-full whitespace-nowrap rounded-[30px] bg-[linear-gradient(180deg,#2f2f2f_0%,#131313_100%)] px-6 text-sm font-semibold text-white shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] transition hover:brightness-110 md:w-auto"
                  >
                    Create Free Account
                  </button>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-[30px] border border-slate-300 px-5 text-sm font-medium text-slate-800 transition hover:bg-slate-100 md:w-auto"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">1,020+ Reviews</span>
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Circle className="ml-1 h-3.5 w-3.5 text-slate-400" />
                <Shield className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </motion.div>

          <motion.div id="features" variants={item} className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <p className="font-medium text-slate-900">Security</p>
              <p className="mt-1">SSR sessions + RLS-backed role policies</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <p className="font-medium text-slate-900">Access Control</p>
              <p className="mt-1">Dedicated user dashboard and admin control panel</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
