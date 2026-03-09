"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/AuthCard.tsx
// Page-level wrapper for auth forms. Provides the dark card,
// heading, and the decorative left panel on desktop.
//
// USAGE — login page:
//   import AuthCard     from "@/components/auth/AuthCard"
//   import LoginForm    from "@/components/auth/LoginForm"
//   import GoogleButton from "@/components/auth/GoogleButton"
//   import AuthDivider  from "@/components/auth/AuthDivider"
//
//   export default function LoginPage() {
//     return (
//       <AuthCard
//         heading="Welcome back"
//         sub="Sign in to continue your scholarship journey"
//       >
//         <GoogleButton redirectTo="/dashboard" />
//         <AuthDivider />
//         <LoginForm redirectTo="/dashboard" />
//       </AuthCard>
//     )
//   }
//
// USAGE — register page:
//   <AuthCard
//     heading="Create your account"
//     sub="Takes 60 seconds · Unlock 500+ scholarships"
//     wide                         ← wider card for multi-step form
//   >
//     <GoogleButton label="Sign up with Google" redirectTo="/dashboard?welcome=1" />
//     <AuthDivider label="or sign up with email" />
//     <RegisterForm redirectTo="/dashboard?welcome=1" />
//   </AuthCard>
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion"
import Link from "next/link"
import { Sparkles } from "lucide-react"

// ── Decorative stat pill ──────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-[11px] text-white/30 mt-0.5">{label}</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────
interface AuthCardProps {
  heading:  string
  sub:      string
  children: React.ReactNode
  wide?:    boolean      // use for RegisterForm (more space for chips)
}

export default function AuthCard({
  heading,
  sub,
  children,
  wide = false,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* ── Left panel: decorative (desktop only) ── */}
      <motion.div
        className="hidden lg:flex flex-col justify-between
                   w-[440px] flex-shrink-0 relative overflow-hidden
                   border-r border-white/[0.05]"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-80
                        bg-gradient-to-t from-emerald-950/30 to-transparent
                        pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                            flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-[16px] tracking-tight">
              Scholar<span className="text-emerald-400">Path</span>
            </span>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 px-10 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400 tracking-wide">
              500+ scholarships live
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-[1.15] mb-4
                         tracking-tight">
            Find the scholarship
            <br />
            <span className="text-emerald-400">built for you.</span>
          </h2>
          <p className="text-[13px] text-white/35 leading-relaxed max-w-[280px]">
            Smart eligibility matching, deadline reminders, and document
            checklists — all in one place.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8 pt-8 border-t border-white/[0.06]">
            <StatPill value="500+"   label="Scholarships" />
            <StatPill value="₹10Cr+" label="Available aid" />
            <StatPill value="24 hr"  label="Reminders"    />
          </div>
        </div>
      </motion.div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">

        {/* Subtle glow behind card */}
        <div className="absolute w-96 h-96 rounded-full
                        bg-emerald-500/[0.03] blur-3xl pointer-events-none" />

        <motion.div
          className={`relative w-full ${wide ? "max-w-[480px]" : "max-w-[400px]"}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                            flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">
              Scholar<span className="text-emerald-400">Path</span>
            </span>
          </Link>

          {/* Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.07]
                          backdrop-blur-sm p-8 shadow-2xl shadow-black/40">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-[22px] font-bold text-white mb-1.5 tracking-tight">
                {heading}
              </h1>
              <p className="text-[13px] text-white/35">{sub}</p>
            </div>

            {/* Slot for GoogleButton + AuthDivider + LoginForm/RegisterForm */}
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}