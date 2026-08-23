"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch, clearSession, getToken, SESSION_EXPIRED_EVENT } from "@/lib/api";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  description: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "◫", description: "Overview and growth signals" },
      { href: "/content-studio", label: "Content Studio", icon: "◇", description: "Media, drafts and publishing prep" },
      { href: "/ai-assistant", label: "AI Assistant", icon: "✦", description: "Captions, hashtags and analysis" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/calendar", label: "Calendar", icon: "▦", description: "Schedule and publishing queue" },
      { href: "/analytics", label: "Analytics", icon: "⌁", description: "Performance and reach trends" },
      { href: "/growth-insights", label: "Growth Insights", icon: "↗", description: "Best times and recommendations" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/social-accounts", label: "Social Accounts", icon: "◎", description: "Facebook and Instagram connections" },
      { href: "/settings", label: "Settings", icon: "⚙", description: "Profile and workspace preferences" },
    ],
  },
];

const nav: NavItem[] = navGroups.flatMap((group) => group.items);

type UserProfile = { name: string; email: string; role?: string };

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="CreatorOS AI home" className="group flex min-w-0 items-center gap-2.5">
      <div className="relative flex h-10 w-12 shrink-0 items-center justify-center sm:h-11 sm:w-14">
        <div className="absolute h-9 w-9 rounded-full bg-violet-500/15 blur-xl transition duration-300 group-hover:bg-violet-400/30" />
        <Image
          src="/creatoros-mark.svg"
          alt=""
          width={56}
          height={46}
          priority
          className="relative h-10 w-12 object-contain drop-shadow-[0_0_14px_rgba(37,99,255,.24)] transition duration-300 group-hover:scale-[1.04] sm:h-11 sm:w-14"
        />
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="whitespace-nowrap text-[17px] font-semibold tracking-[-.045em] text-white">
            CreatorOS <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">AI</span>
          </div>
          <div className="mt-0.5 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[.28em] text-[#71809b]">
            Growth Intelligence
          </div>
        </div>
      )}
    </Link>
  );
}

export default function AppShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    const controller = new AbortController();
    const handleExpiredSession = () => router.replace("/login?expired=1");
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);

    apiFetch<UserProfile>("/api/v1/users/me", { signal: controller.signal })
      .then(setProfile)
      .catch(() => {})
      .finally(() => setSessionReady(true));

    return () => {
      controller.abort();
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);
    };
  }, [pathname, router]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!commandOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [commandOpen]);

  const initials = useMemo(() => {
    if (!profile?.name) return "CR";
    return profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CR";
  }, [profile]);

  const currentItem = useMemo(() => nav.find((item) => item.href === pathname), [pathname]);
  const commandResults = useMemo(() => {
    const query = commandQuery.trim().toLowerCase();
    if (!query) return nav;
    return nav.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query));
  }, [commandQuery]);

  function closeCommand() {
    setCommandOpen(false);
    setCommandQuery("");
  }

  async function logout() {
    try { await apiFetch("/api/v1/auth/logout", { method: "POST" }); } catch {}
    clearSession();
    router.replace("/login");
    router.refresh();
  }

  if (!sessionReady && !profile) {
    return (
      <div className="premium-grid relative grid min-h-[100dvh] place-items-center overflow-hidden px-5 py-8 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[90px]" />
        <div className="glass neon-border relative w-full max-w-sm rounded-[24px] px-6 py-7 text-center shadow-[0_35px_100px_rgba(0,0,0,.45)] sm:px-8">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-violet-200 shadow-[0_0_30px_rgba(124,58,237,.14)]">✦</div>
          <div className="mt-4 text-sm font-semibold text-white">Opening CreatorOS workspace</div>
          <div className="muted mt-1 text-xs">Verifying your secure session...</div>
          <div className="mx-auto mt-5 h-1 w-36 overflow-hidden rounded-full bg-white/[.05]"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-grid min-h-[100dvh] overflow-x-clip pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0">
      <aside className="desktop-sidebar fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-white/[.055] bg-[#030816]/92 shadow-[24px_0_80px_rgba(0,0,0,.12)] backdrop-blur-2xl">
        <div className="border-b border-white/[.045] px-5 py-5"><Logo /></div>

        <div className="px-4 pt-4">
          <button onClick={() => setCommandOpen(true)} className="group flex w-full items-center gap-3 rounded-xl border border-white/[.06] bg-white/[.018] px-3 py-2.5 text-left transition hover:border-violet-300/15 hover:bg-violet-500/[.045]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/[.08] text-xs text-violet-200">⌕</span>
            <span className="min-w-0 flex-1 text-[11px] font-semibold text-[#8c99b0] group-hover:text-[#cbd5e8]">Quick switcher</span>
            <span className="kbd">⌘K</span>
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 pb-5 pt-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[.17em] text-[#4f5c73]">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-all duration-200 ${active ? "border border-violet-300/15 bg-gradient-to-r from-violet-500/15 via-violet-500/[.07] to-transparent text-violet-50 shadow-[0_10px_30px_rgba(76,29,149,.08)]" : "border border-transparent text-[#76839a] hover:border-white/[.045] hover:bg-white/[.025] hover:text-[#d4dcef]"}`}
                    >
                      {active && <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-violet-300 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,.45)]" />}
                      <span className={`grid h-8 w-8 place-items-center rounded-lg text-sm transition ${active ? "bg-violet-500/12 text-violet-200" : "bg-white/[.018] text-[#59667e] group-hover:text-[#9aa7bf]"}`}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[.055] p-4">
          <div className="relative overflow-hidden rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025] to-emerald-400/[.025] p-4">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative flex items-center justify-between"><div className="kicker">Live Workspace</div><span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#4edea3]"><span className="status-dot" /> Online</span></div>
            <div className="relative mt-2 text-[11px] leading-5 text-[#7d8aa2]">Facebook, Instagram, AI, scheduling and analytics connected through the CreatorOS API.</div>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-white/[.04] hover:bg-white/[.018]">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-violet-300/20 bg-gradient-to-br from-violet-500/14 to-blue-500/[.06] text-xs font-bold text-violet-100">{initials}</div>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{profile?.name ?? "Creator Account"}</div><div className="truncate text-[10px] text-[#66738a]">{profile?.email ?? "Authenticated"}</div></div>
            <button onClick={logout} className="rounded-lg px-2 py-1 text-[10px] font-semibold text-[#6f7c93] transition hover:bg-rose-400/[.06] hover:text-rose-200">Log out</button>
          </div>
        </div>
      </aside>

      <main className="app-main min-h-[100dvh] min-w-0 transition-[margin] duration-200 lg:ml-[264px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-white/[.055] bg-[#050a18]/86 px-3 shadow-[0_10px_40px_rgba(0,0,0,.08)] backdrop-blur-2xl sm:gap-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="shrink-0 lg:hidden"><Logo compact /></div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2"><h2 className="truncate text-[13px] font-semibold tracking-[-.025em] text-[#eef2ff] sm:text-[15px]">{title}</h2>{currentItem && <span className="hidden rounded-full border border-white/[.05] bg-white/[.018] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[.12em] text-[#66738a] xl:inline">V1 workspace</span>}</div>
              {subtitle && <p className="mt-0.5 hidden truncate text-[10px] text-[#69758d] sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="app-header-actions relative flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
            <button onClick={() => setCommandOpen(true)} className="secondary-btn hidden !min-h-9 !gap-2 !px-3 text-[11px] md:inline-flex"><span className="text-[#65728a]">⌕</span><span className="hidden xl:inline">Jump to</span><span className="kbd">⌘K</span></button>
            <div className="app-header-page-action flex min-w-0 items-center">{actions}</div>
            <button onClick={() => setNotificationsOpen((open) => !open)} className="secondary-btn !h-9 !min-h-9 !w-9 shrink-0 !p-0" aria-label="Notifications" aria-expanded={notificationsOpen}>◌</button>
            <Link href="/settings" aria-label="Open account settings" className="secondary-btn !h-9 !min-h-9 !w-9 shrink-0 !rounded-full !border-violet-300/10 !bg-violet-500/[.07] !p-0 text-[11px] font-bold text-violet-100">{initials}</Link>
            {notificationsOpen && (
              <div className="glass fixed left-3 right-3 top-[4.75rem] z-50 rounded-2xl p-4 shadow-[0_30px_90px_rgba(0,0,0,.5)] sm:absolute sm:left-auto sm:right-10 sm:top-12 sm:w-[310px]">
                <div className="flex items-center justify-between gap-3"><div><div className="kicker">Workspace activity</div><div className="mt-1 text-sm font-semibold text-white">You are all caught up</div></div><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-300/[.06] text-[#4edea3]">✓</span></div>
                <p className="muted mt-3 text-xs leading-5">CreatorOS surfaces publishing failures and workflow errors directly where they happen, so this panel stays focused on system-level alerts.</p>
                <button onClick={() => setNotificationsOpen(false)} className="mt-4 text-xs font-semibold text-violet-300 hover:text-violet-200">Dismiss</button>
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto w-full min-w-0 max-w-[1220px] p-3 sm:p-6 lg:p-7">{children}</div>
      </main>

      <nav aria-label="Mobile navigation" className="mobile-bottom-nav fixed inset-x-2 bottom-2 z-50 flex items-stretch justify-around gap-1 rounded-2xl border border-white/[.08] bg-[#050a18]/94 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:inset-x-3 sm:bottom-3 sm:p-2 lg:hidden">
        {nav.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label} aria-current={active ? "page" : undefined} className={`flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[9px] font-semibold transition ${active ? "border border-violet-300/10 bg-violet-500/15 text-violet-100" : "text-[#67748d]"}`}>
              <span className="text-base leading-none">{item.icon}</span>
              <span className="max-w-full truncate">{item.label === "Content Studio" ? "Studio" : item.label === "AI Assistant" ? "AI" : item.label}</span>
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen((open) => !open)} aria-label="More navigation" aria-expanded={moreOpen} className={`flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[9px] font-semibold transition ${moreOpen || nav.slice(4).some((item) => item.href === pathname) ? "border border-violet-300/10 bg-violet-500/15 text-violet-100" : "text-[#67748d]"}`}><span className="text-sm leading-none">•••</span><span>More</span></button>
        {moreOpen && <div className="glass absolute inset-x-0 bottom-[4.6rem] grid max-h-[60dvh] grid-cols-2 gap-2 overflow-y-auto rounded-2xl p-3 shadow-2xl">{nav.slice(4).map((item) => { const active = pathname === item.href; return <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-12 min-w-0 items-center gap-3 rounded-xl px-3 text-xs font-semibold ${active ? "bg-violet-500/15 text-violet-100" : "text-[#9aa6bd] hover:bg-white/[.03]"}`}><span className="grid w-5 shrink-0 place-items-center text-sm">{item.icon}</span><span className="min-w-0 truncate">{item.label}</span></Link>; })}</div>}
      </nav>

      {commandOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#01040d]/75 px-0 pt-0 backdrop-blur-md sm:items-start sm:px-4 sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label="CreatorOS quick switcher" onMouseDown={(event) => { if (event.currentTarget === event.target) closeCommand(); }}>
          <div className="glass neon-border max-h-[88dvh] w-full max-w-xl overflow-hidden rounded-t-[26px] rounded-b-none shadow-[0_40px_140px_rgba(0,0,0,.65)] sm:max-h-none sm:rounded-[24px]">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/10 sm:hidden" />
            <div className="flex items-center gap-3 border-b border-white/[.06] px-4 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-200">⌕</span>
              <input autoFocus value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} placeholder="Search CreatorOS workspace..." className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-[#5f6c83] sm:text-sm" />
              <button onClick={closeCommand} className="secondary-btn !h-9 !min-h-9 !px-2 text-[10px] sm:hidden" aria-label="Close quick switcher">Close</button>
              <span className="kbd hidden sm:inline-flex">Esc</span>
            </div>
            <div className="max-h-[58dvh] overflow-y-auto p-2 sm:max-h-[52vh]">
              {commandResults.length ? commandResults.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeCommand} className={`group flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 transition ${pathname === item.href ? "border-violet-300/15 bg-violet-500/[.08]" : "border-transparent hover:border-white/[.05] hover:bg-white/[.025]"}`}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[.025] text-sm text-violet-200">{item.icon}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white">{item.label}</span><span className="mt-1 block truncate text-[10px] text-[#6f7b92]">{item.description}</span></span>
                  <span className="shrink-0 text-xs text-[#556278] transition group-hover:translate-x-0.5 group-hover:text-violet-300">↗</span>
                </Link>
              )) : <div className="px-5 py-10 text-center"><div className="text-sm font-semibold text-white">No matching workspace</div><div className="muted mt-1 text-xs">Try searching for analytics, calendar, AI or settings.</div></div>}
            </div>
            <div className="flex items-center justify-between border-t border-white/[.05] px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] text-[9px] text-[#56637a]"><span>Navigate without leaving your workflow</span><span>CreatorOS AI</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
