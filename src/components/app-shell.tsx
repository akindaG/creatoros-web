"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  ["/dashboard", "Dashboard", "◫"],
  ["/content-studio", "Content Studio", "◇"],
  ["/ai-assistant", "AI Assistant", "✦"],
  ["/calendar", "Calendar", "▦"],
  ["/analytics", "Analytics", "⌁"],
  ["/growth-insights", "Growth Insights", "↗"],
  ["/social-accounts", "Social Accounts", "◎"],
  ["/settings", "Settings", "⚙"],
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-violet-300/20 bg-[#0b1023] shadow-[0_0_25px_rgba(124,58,237,.18)]">
        <div className="absolute inset-1 rounded-lg bg-[conic-gradient(from_210deg,#4edea3,#7c3aed,#d2bbff,#4edea3)] opacity-80 blur-[5px]" />
        <div className="relative grid h-7 w-7 place-items-center rounded-lg bg-[#050816] text-sm font-black text-violet-100">C</div>
      </div>
      {!compact && <div><div className="text-[15px] font-bold tracking-[-.03em] text-white">CreatorOS <span className="text-violet-300">AI</span></div><div className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#68758f]">Growth Intelligence</div></div>}
    </Link>
  );
}

export default function AppShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  function logout(){ localStorage.removeItem("creatoros_token"); router.push("/login"); }
  return (
    <div className="min-h-screen premium-grid pb-20 lg:pb-0">
      <aside className="desktop-sidebar fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[.055] bg-[#030816]/90 backdrop-blur-2xl">
        <div className="px-6 py-6"><Logo /></div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-4">
          {nav.map(([href,label,icon]) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition ${active ? "border border-violet-300/15 bg-gradient-to-r from-violet-500/18 to-violet-400/[.035] text-violet-100 shadow-[inset_3px_0_0_#a855f7]" : "text-[#7f8ba3] hover:bg-white/[.03] hover:text-[#d8e0f2]"}`}><span className={`grid h-5 w-5 place-items-center text-sm ${active ? "text-violet-300" : "text-[#63708a]"}`}>{icon}</span>{label}</Link>
          })}
        </nav>
        <div className="border-t border-white/[.055] p-4">
          <div className="rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] to-emerald-400/[.025] p-4"><div className="kicker">MVP Workspace</div><div className="mt-2 text-xs leading-5 text-[#8794ad]">Everything needed for your final CreatorOS demo in one place.</div></div>
          <div className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2"><div className="grid h-9 w-9 place-items-center rounded-full border border-violet-300/20 bg-violet-500/10 text-xs font-bold text-violet-100">CR</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">Creator Account</div><div className="text-[10px] text-[#6f7a91]">Demo workspace</div></div><button onClick={logout} className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[#7f8ba3] transition hover:bg-white/[.04] hover:text-rose-200">Log out</button></div>
        </div>
      </aside>
      <main className="app-main min-h-screen transition-[margin] duration-200 lg:ml-60">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/[.055] bg-[#050a18]/72 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><div className="lg:hidden"><Logo compact /></div><div className="min-w-0"><h2 className="truncate text-base font-semibold tracking-[-.025em] text-[#e9eeff]">{title}</h2>{subtitle && <p className="mt-0.5 hidden truncate text-[11px] text-[#77839a] sm:block">{subtitle}</p>}</div></div>
          <div className="flex items-center gap-2">{actions}<button className="secondary-btn !h-9 !min-h-9 !w-9 !p-0" aria-label="Notifications">◌</button><Link href="/settings" className="secondary-btn !h-9 !min-h-9 !w-9 !rounded-full !p-0">CR</Link></div>
        </header>
        <div className="mx-auto w-full max-w-[1180px] p-4 sm:p-6">{children}</div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/[.08] bg-[#050a18]/92 p-2 shadow-[0_20px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl lg:hidden">
        {nav.slice(0,5).map(([href,label,icon]) => { const active=pathname===href; return <Link key={href} href={href} aria-label={label} className={`grid min-h-12 min-w-12 place-items-center rounded-xl text-base ${active?"bg-violet-500/15 text-violet-200":"text-[#67748d]"}`}><span>{icon}</span></Link>; })}
      </nav>
    </div>
  );
}
