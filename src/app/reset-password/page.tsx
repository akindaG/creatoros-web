"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage(){
  const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage("");const data=Object.fromEntries(new FormData(e.currentTarget));try{await apiFetch("/api/v1/auth/reset-password",{method:"POST",body:JSON.stringify({token:data.token,new_password:data.new_password})});setMessage("Password updated. You can now sign in with your new password.");}catch(err){setMessage(err instanceof Error?err.message:"Password reset failed");}finally{setLoading(false);}}
  return <main className="premium-grid relative grid min-h-screen place-items-center px-5 py-12"><Link href="/" className="absolute left-6 top-6"><Logo/></Link><form onSubmit={submit} className="glass neon-border w-full max-w-md rounded-[26px] p-8"><div className="kicker">Security</div><h1 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-white">Choose a new password</h1><p className="muted mt-2 text-sm leading-6">Paste the reset token from the forgot-password flow, then choose a secure password.</p><label className="mt-6 block"><span className="label mb-2 block">Reset token</span><textarea name="token" className="field min-h-24 resize-none" required/></label><label className="mt-4 block"><span className="label mb-2 block">New password</span><input name="new_password" type="password" minLength={8} className="field" required/></label>{message&&<div className="mt-4 rounded-xl border border-violet-300/10 bg-violet-500/[.07] p-3 text-xs leading-5 text-violet-100">{message}</div>}<button className="primary-btn mt-6 w-full" disabled={loading}>{loading?"Updating...":"Update password"}</button><Link href="/login" className="secondary-btn mt-3 w-full">Back to login</Link></form></main>;
}
