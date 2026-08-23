"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch, clearSession, getToken } from "@/lib/api";

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

type UserProfile = { name: string; email: string; role?: string };

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="CreatorOS AI home" className="group flex items-center gap-3">
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const controller = new AbortController();
    apiFetch<UserProfile>("/api/v1/users/me", { signal: controller.signal })
      .then(setProfile)
      .catch(() => {})
      .finally(() => setSessionReady(true));
    return () => controller.abort();
  }, [pathname, router]);

  const initials = useMemo(() => {
    if (!profile?.name) return "CR";
    return profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CR";
  }, [profile]);

  async function logout() {
    try { await apiFetch("/api/v1/auth/logout", { method: "POST" }); } catch {}
    clearSession();
    router.replace("/login");
    router.refresh();
  }

  if (!sessionReady && !profile) {
    return (
      <div className="premium-grid grid min-h-screen place-items-center px-6">
        <div className="glass neon-border rounded-2xl px-7 py-6 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-200">✦</div>
          <div className="mt-4 text-sm font-semibold text-white">Opening CreatorOS workspace</div>
          <div className="muted mt-1 text-xs">Verifying your secure session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen premium-grid pb-20 lg:pb-0">
      <aside className="desktop-sidebar fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[.055] bg-[#030816]/90 backdrop-blur-2xl">
        <div className="px-6 py-6"><Logo /></div>
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-4">
          {nav.map(([href,label,icon]) => {
            const active = pathname === href;
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition ${active ? "border border-violet-300/15 bg-gradient-to-r from-violet-500/18 to-violet-400/[.035] text-violet-100 shadow-[inset_3px_0_0_#a855f7]" : "text-[#7f8ba3] hover:bg-white/[.03] hover:text-[#d8e0f2]"}`}><span className={`grid h-5 w-5 place-items-center text-sm ${active ? "text-violet-300" : "text-[#63708a]"}`}>{icon}</span>{label}</Link>
          })}
        </nav>
        <div className="border-t border-white/[.055] p-4">
          <div className="rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] to-emerald-400/[.025] p-4"><div className="kicker">Live Workspace</div><div className="mt-2 text-xs leading-5 text-[#8794ad]">Facebook, Instagram, AI, scheduling and analytics are connected through the CreatorOS API.</div></div>
          <div className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2"><div className="grid h-9 w-9 place-items-center rounded-full border border-violet-300/20 bg-violet-500/10 text-xs font-bold text-violet-100">{initials}</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{profile?.name ?? "Creator Account"}</div><div className="truncate text-[10px] text-[#6f7a91]">{profile?.email ?? "Authenticated"}</div></div><button onClick={logout} className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[#7f8ba3] transition hover:bg-white/[.04] hover:text-rose-200">Log out</button></div>
        </div>
      </aside>
      <main className="app-main min-h-screen transition-[margin] duration-200 lg:ml-60">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/[.055] bg-[#050a18]/72 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3"><div className="lg:hidden"><Logo compact /></div><div className="min-w-0"><h2 className="truncate text-base font-semibold tracking-[-.025em] text-[#e9eeff]">{title}</h2>{subtitle && <p className="mt-0.5 hidden truncate text-[11px] text-[#77839a] sm:block">{subtitle}</p>}</div></div>
          <div className="relative flex items-center gap-2">{actions}<button onClick={()=>setNotificationsOpen(open=>!open)} className="secondary-btn !h-9 !min-h-9 !w-9 !p-0" aria-label="Notifications" aria-expanded={notificationsOpen}>◌</button><Link href="/settings" aria-label="Open account settings" className="secondary-btn !h-9 !min-h-9 !w-9 !rounded-full !p-0">{initials}</Link>{notificationsOpen&&<div className="glass absolute right-11 top-12 z-50 w-72 rounded-xl p-4 shadow-2xl"><div className="text-sm font-semibold text-white">No unread system alerts</div><p className="muted mt-1 text-xs leading-5">Publishing failures are surfaced directly in the relevant CreatorOS workflow.</p><button onClick={()=>setNotificationsOpen(false)} className="mt-3 text-xs font-semibold text-violet-300">Dismiss</button></div>}</div>
        </header>
        <div className="mx-auto w-full max-w-[1180px] p-4 sm:p-6">{children}</div>
      </main>
      <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/[.08] bg-[#050a18]/92 p-2 shadow-[0_20px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl lg:hidden">
        {nav.slice(0,4).map(([href,label,icon]) => { const active=pathname===href; return <Link key={href} href={href} aria-label={label} aria-current={active?"page":undefined} className={`grid min-h-12 min-w-12 place-items-center rounded-xl text-base ${active?"bg-violet-500/15 text-violet-200":"text-[#67748d]"}`}><span>{icon}</span></Link>; })}
        <button onClick={()=>setMoreOpen(open=>!open)} aria-label="More navigation" aria-expanded={moreOpen} className={`grid min-h-12 min-w-12 place-items-center rounded-xl text-base ${moreOpen||nav.slice(4).some(([href])=>href===pathname)?"bg-violet-500/15 text-violet-200":"text-[#67748d]"}`}>•••</button>
        {moreOpen&&<div className="glass absolute inset-x-0 bottom-[4.5rem] grid grid-cols-2 gap-2 rounded-2xl p-3 shadow-2xl">{nav.slice(4).map(([href,label,icon])=>{const active=pathname===href;return <Link key={href} href={href} onClick={()=>setMoreOpen(false)} aria-current={active?"page":undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-semibold ${active?"bg-violet-500/15 text-violet-100":"text-[#9aa6bd] hover:bg-white/[.03]"}`}><span className="grid w-5 place-items-center text-sm">{icon}</span>{label}</Link>})}</div>}
      </nav>
    </div>
  );
}
