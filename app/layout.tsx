import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { getCurrentProfile } from "@/lib/auth";
import { TopNavbar } from "@/components/navigation/top-navbar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuthSystem Pro",
  description: "Full-stack authentication platform built with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ececf2] text-slate-900">
        <TopNavbar profile={profile} />
        <div className="pt-20">{children}</div>
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  );
}
