import Link from "next/link";
import { Logo } from "@/components/app-shell";
import { Card, SparkChart } from "@/components/ui";

export default function Home() {
  return (
    <main className="premium-grid min-h-screen overflow-hidden">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[.05] bg-[#030713]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo />
          <div className="hidden items-center gap-8 text-sm text-[#8d99b1] md:flex"><a href="#features">Features</a><a href="#intelligence">Intelligence</a><a href="#workflow">Workflow</a></div>
          <div className="flex items-center gap-3"><Link href="/login" className="secondary-btn">Log in</Link><Link href="/register" className="primary-btn">Start growing</Link></div>
        </div>
      </nav>
      <section className="relative mx-auto flex min-h-[940px] max-w-7xl flex-col items-center px-6 pb-24 pt-44 text-center">
        <div className="pulse-glow pointer-events-none absolute left-1/2 top-28 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/[.13] blur-[100px]" />
        <div className="relative pill border-violet-300/20 bg-violet-500/[.08] text-violet-200"><span className="status-dot" /> AI-powered social growth intelligence</div>
        <h1 className="relative mt-8 max-w-5xl text-5xl font-semibold leading-[.98] tracking-[-.065em] text-white sm:text-7xl lg:text-[88px]">The operating system for <span className="gradient-text">modern creators.</span></h1>
        <p className="relative mt-7 max-w-2xl text-base leading-7 text-[#8996af] sm:text-lg">Create smarter. Schedule with confidence. Understand what is working. CreatorOS AI turns your content and engagement data into clear growth actions.</p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3"><Link href="/register" className="primary-btn !min-h-12 !px-6">Enter CreatorOS <span>↗</span></Link><Link href="/dashboard" className="secondary-btn !min-h-12 !px-6">View live workspace</Link></div>
        <div className="relative mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-[#64708a]"><span>Facebook + Instagram</span><span>•</span><span>AI captions + analysis</span><span>•</span><span>Scheduling + analytics</span></div>
        <div className="relative mt-20 w-full max-w-6xl rounded-[28px] border border-violet-300/15 bg-gradient-to-b from-white/[.055] to-white/[.01] p-2 shadow-[0_50px_140px_rgba(0,0,0,.55),0_0_80px_rgba(124,58,237,.08)]">
          <div className="overflow-hidden rounded-[22px] border border-white/[.06] bg-[#050a18] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400/70"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70"/></div><div className="pill">Live growth workspace</div></div>
            <div className="grid gap-4 md:grid-cols-4">{[["Total Reach","8.2M","+18.4%"],["Engagement","5.26%","+1.8%"],["Followers","12.5K","+12.1%"],["Profile Visits","98.3K","+8.7%"]].map(([a,b,c]) => <div key={a} className="rounded-xl border border-white/[.055] bg-white/[.02] p-4 text-left"><div className="text-[11px] text-[#7f8ba3]">{a}</div><div className="mt-2 text-2xl font-semibold text-white">{b}</div><div className="mt-1 text-[11px] text-[#4edea3]">↗ {c}</div></div>)}</div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_.8fr]"><div className="rounded-xl border border-white/[.055] bg-white/[.015] p-4"><div className="mb-4 flex justify-between text-left"><div><div className="font-semibold text-white">Growth momentum</div><div className="mt-1 text-xs text-[#6f7b92]">Reach and engagement over the last 30 days</div></div><div className="pill">30 days</div></div><SparkChart compact /></div><div className="rounded-xl border border-white/[.055] bg-white/[.015] p-4 text-left"><div className="kicker">AI Recommendation</div><div className="mt-4 text-xl font-semibold text-white">Post tonight at 7:30 PM</div><p className="mt-3 text-sm leading-6 text-[#7f8ba3]">Your audience is most active between 7 PM and 9 PM. Educational carousel posts perform 31% better in this window.</p><div className="mt-5 pill border-emerald-300/10 text-[#4edea3]">High confidence</div></div></div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.05] bg-white/[.012] py-8"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">{[["12.5K","Audience managed"],["8.2M","Monthly reach"],["432K","Engagements"],["98.3K","Profile visits"]].map(([n,l]) => <div key={l}><div className="text-2xl font-semibold text-white">{n}</div><div className="mt-1 text-xs text-[#718099]">{l}</div></div>)}</div></section>
      <section id="features" className="mx-auto max-w-7xl px-6 py-28"><div className="mx-auto max-w-2xl text-center"><div className="kicker">One premium workspace</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Everything you need to grow, without the noise.</h2><p className="muted mt-5 leading-7">A focused MVP built around the workflows creators actually repeat every week.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{[["✦","AI Content Studio","Generate captions, hashtags and stronger CTAs from a simple content brief."],["⌁","Growth Intelligence","See reach, engagement and content performance translated into useful decisions."],["▦","Smart Scheduling","Plan Facebook and Instagram content in a visual calendar and keep your publishing queue organized."]].map(([i,t,d]) => <Card key={t} className="neon-border p-7"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-200">{i}</div><h3 className="mt-6 text-xl font-semibold text-white">{t}</h3><p className="muted mt-3 text-sm leading-6">{d}</p></Card>)}</div></section>
      <footer className="border-t border-white/[.05] py-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between"><Logo/><div className="text-xs text-[#68758f]">CreatorOS AI. Built for focused, data-driven social growth.</div></div></footer>
    </main>
  );
}
