import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/app-shell";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="premium-grid min-h-screen bg-[#020611] text-white">
      <header className="border-b border-white/[.055] bg-[#020611]/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-6">
          <Logo />
          <Link href="/" className="secondary-btn !min-h-9 !px-4 text-xs">
            Back to CreatorOS
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="kicker">{eyebrow}</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-[#78859c]">Last updated: {updated}</p>

        <article className="mt-10 space-y-8 text-sm leading-7 text-[#a7b2c7]">
          {children}
        </article>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/[.055] pt-6 text-xs">
          <Link href="/privacy" className="text-violet-300 hover:text-violet-200">Privacy Policy</Link>
          <Link href="/data-deletion" className="text-violet-300 hover:text-violet-200">Data Deletion</Link>
          <Link href="/terms" className="text-violet-300 hover:text-violet-200">Terms of Service</Link>
          <a href="mailto:creators.help.ai@gmail.com" className="text-violet-300 hover:text-violet-200">
            creators.help.ai@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-[-.025em] text-white">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
