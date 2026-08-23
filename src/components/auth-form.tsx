"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Logo } from "./app-shell";

type Mode = "login" | "register" | "reset";

type LoginResponse = { access_token: string; token_type?: string };
type ForgotPasswordResponse = { message: string; reset_token?: string | null };

const valueProps = [
  ["✦", "AI-assisted content", "Generate captions, hashtags and content improvements."],
  ["▦", "Smarter scheduling", "Turn ready drafts into a clear Facebook and Instagram publishing plan."],
  ["↗", "Growth intelligence", "Use performance history to guide posting time and growth decisions."],
] as const;

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    setSuccess(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (isRegister) {
        await apiFetch("/api/v1/auth/register", { method: "POST", body: JSON.stringify(data) });
        router.replace("/login");
      } else if (isReset) {
        const result = await apiFetch<ForgotPasswordResponse>("/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify(data) });
        setMessage(result.message);
        setResetToken(result.reset_token ?? "");
        setSuccess(true);
      } else {
        const payload = await apiFetch<LoginResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(data) });
        localStorage.setItem("creatoros_token", payload.access_token);
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-grid relative min-h-screen overflow-hidden bg-[#020611] px-5 py-6 sm:px-6 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:px-0 lg:py-0">
      <div className="pulse-glow pointer-events-none absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/[.14] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[30%] h-[420px] w-[420px] rounded-full bg-cyan-500/[.05] blur-[110px]" />

      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/[.05] bg-[#030816]/55 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(124,58,237,.13),transparent_30%)]" />
        <div className="relative"><Logo /></div>

        <div className="relative max-w-xl">
          <div className="pill w-fit border-violet-300/15 bg-violet-500/[.06] text-violet-100"><span className="status-dot" /> Creator-first growth workspace</div>
          <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-.065em] text-white xl:text-6xl">Turn every post into a <span className="gradient-text">better decision.</span></h1>
          <p className="muted mt-6 max-w-lg text-base leading-7">CreatorOS brings content creation support, scheduling, analytics and growth recommendations together so you can spend less time switching tools and more time improving the work.</p>

          <div className="mt-9 grid gap-3">
            {valueProps.map(([icon, title, description]) => (
              <div key={title} className="panel-hover flex gap-4 rounded-2xl border border-white/[.05] bg-white/[.016] p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/[.08] text-violet-200">{icon}</div>
                <div><div className="text-sm font-semibold text-white">{title}</div><p className="mt-1 text-xs leading-5 text-[#738097]">{description}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[10px] text-[#56637a]"><span>Facebook + Instagram · Qwen 3 · Analytics</span><span>CreatorOS AI</span></div>
      </section>

      <section className="relative flex min-h-[calc(100vh-3rem)] items-center justify-center py-12 lg:min-h-screen lg:px-10 xl:px-16">
        <div className="absolute left-0 top-0 p-1 lg:hidden"><Logo /></div>
        <div className="w-full max-w-md">
          <div className="mb-7 lg:hidden"><div className="pill w-fit border-violet-300/15 bg-violet-500/[.06] text-violet-100"><span className="status-dot" /> Secure CreatorOS access</div></div>

          <div className="glass neon-border relative overflow-hidden rounded-[28px] p-7 shadow-[0_40px_130px_rgba(0,0,0,.52)] sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/[.08] blur-[70px]" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="kicker">{isRegister ? "Create workspace" : isReset ? "Account recovery" : "Secure sign in"}</div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-.05em] text-white">{isRegister ? "Start growing smarter." : isReset ? "Get back into CreatorOS." : "Welcome back."}</h2>
                  <p className="muted mt-2 text-sm leading-6">{isRegister ? "Create your account and open the full creator growth workspace." : isReset ? "Enter the email attached to your CreatorOS account." : "Sign in to continue to your live CreatorOS workspace."}</p>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-lg text-violet-200 shadow-[0_0_30px_rgba(124,58,237,.12)]">✦</div>
              </div>

              <form onSubmit={submit} className="mt-7 space-y-4">
                {isRegister && <label className="block"><span className="label mb-2 block">Full name</span><input className="field" name="name" placeholder="Your name" autoComplete="name" required /></label>}
                <label className="block"><span className="label mb-2 block">Email address</span><input className="field" type="email" name="email" placeholder="you@example.com" autoComplete="email" required /></label>
                {!isReset && (
                  <label className="block">
                    <span className="flex items-center justify-between"><span className="label mb-2 block">Password</span>{mode === "login" && <Link href="/forgot-password" className="mb-2 text-xs font-semibold text-violet-300 hover:text-violet-200">Forgot password?</Link>}</span>
                    <div className="relative"><input className="field !pr-16" type={showPassword?"text":"password"} name="password" placeholder="••••••••" minLength={8} autoComplete={isRegister?"new-password":"current-password"} required /><button type="button" onClick={()=>setShowPassword(value=>!value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[10px] font-semibold text-[#748097] hover:bg-white/[.04] hover:text-white">{showPassword?"Hide":"Show"}</button></div>
                  </label>
                )}

                {isRegister && <div className="rounded-xl border border-white/[.045] bg-white/[.015] p-3 text-[10px] leading-5 text-[#718099]">By creating an account you are setting up a private CreatorOS workspace for the Version 1.0 Facebook and Instagram workflow.</div>}

                {message && <div role={success ? "status" : "alert"} className={`rounded-xl border p-3 text-xs leading-5 ${success ? "border-emerald-300/15 bg-emerald-300/[.06] text-emerald-100" : "border-rose-300/15 bg-rose-400/[.06] text-rose-100"}`}>{message}</div>}
                {resetToken && <Link href={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="secondary-btn w-full">Continue to password reset</Link>}

                <button className="primary-btn !mt-6 w-full !min-h-12" disabled={loading}>{loading ? "Working..." : isRegister ? "Create CreatorOS account" : isReset ? "Send reset instructions" : "Enter workspace"}</button>
              </form>

              <div className="mt-6 flex items-center gap-3"><div className="h-px flex-1 bg-white/[.05]"/><span className="text-[9px] font-semibold uppercase tracking-[.15em] text-[#56637a]">Secure workspace access</span><div className="h-px flex-1 bg-white/[.05]"/></div>
              <p className="mt-5 text-center text-xs text-[#7b879e]">{isRegister ? <>Already have an account? <Link className="font-semibold text-violet-300 hover:text-violet-200" href="/login">Log in</Link></> : !isReset ? <>New to CreatorOS? <Link className="font-semibold text-violet-300 hover:text-violet-200" href="/register">Create an account</Link></> : <Link className="font-semibold text-violet-300 hover:text-violet-200" href="/login">Back to login</Link>}</p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[.11em] text-[#4f5c72]"><span>JWT protected</span><span>•</span><span>CreatorOS API</span><span>•</span><span>Private workspace</span></div>
        </div>
      </section>
    </main>
  );
}
