"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "./app-shell";

type Mode = "login" | "register" | "reset";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const endpoint = isRegister ? "/api/auth/register" : isReset ? "/api/auth/reset-password" : "/api/auth/login";
    try {
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (base) {
        const res = await fetch(`${base}${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error("We could not complete that request. Check your details and try again.");
        const payload = await res.json().catch(() => ({}));
        if (payload?.access_token && typeof window !== "undefined") localStorage.setItem("creatoros_token", payload.access_token);
      }
      if (isReset) setMessage("Reset instructions are ready. Check your email or backend response."); else router.push("/dashboard");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <main className="premium-grid relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="pulse-glow absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/[.14] blur-[100px]" />
      <Link href="/" className="absolute left-6 top-6"><Logo /></Link>
      <div className="glass neon-border relative w-full max-w-md rounded-[26px] p-7 shadow-[0_40px_120px_rgba(0,0,0,.5)] sm:p-9">
        <div className="text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-xl text-violet-200 shadow-[0_0_30px_rgba(124,58,237,.15)]">✦</div><h1 className="text-2xl font-semibold tracking-[-.04em] text-white">{isRegister ? "Create your workspace" : isReset ? "Reset your password" : "Welcome back"}</h1><p className="muted mt-2 text-sm">{isRegister ? "Start building a smarter social growth workflow." : isReset ? "Enter the email attached to your CreatorOS account." : "Sign in to continue to CreatorOS AI."}</p></div>
        {!isReset && <div className="mt-7 grid grid-cols-2 gap-3"><button className="secondary-btn">G&nbsp;&nbsp; Google</button><button className="secondary-btn">●&nbsp;&nbsp; Apple</button></div>}
        {!isReset && <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-[.16em] text-[#536079]"><span className="h-px flex-1 bg-white/[.07]"/>or<span className="h-px flex-1 bg-white/[.07]"/></div>}
        <form onSubmit={submit} className="space-y-4">
          {isRegister && <label className="block"><span className="label mb-2 block">Full name</span><input className="field" name="name" placeholder="Your name" required /></label>}
          <label className="block"><span className="label mb-2 block">Email address</span><input className="field" type="email" name="email" placeholder="you@example.com" required /></label>
          {!isReset && <label className="block"><span className="flex items-center justify-between"><span className="label mb-2 block">Password</span>{mode === "login" && <Link href="/forgot-password" className="mb-2 text-xs text-violet-300 hover:text-violet-200">Forgot password?</Link>}</span><input className="field" type="password" name="password" placeholder="••••••••" minLength={8} required /></label>}
          {message && <div className="rounded-xl border border-violet-300/10 bg-violet-500/[.07] p-3 text-xs leading-5 text-violet-100">{message}</div>}
          <button className="primary-btn !mt-6 w-full" disabled={loading}>{loading ? "Working..." : isRegister ? "Create account" : isReset ? "Send reset instructions" : "Log in"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#7b879e]">{isRegister ? <>Already have an account? <Link className="text-violet-300" href="/login">Log in</Link></> : !isReset ? <>New to CreatorOS? <Link className="text-violet-300" href="/register">Create an account</Link></> : <Link className="text-violet-300" href="/login">Back to login</Link>}</p>
      </div>
    </main>
  );
}
