"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/AuthButton.tsx
// Primary CTA button used across all auth forms.
// Handles loading state, disabled state, icon slot.
//
// USAGE:
//   <AuthButton loading={loading}>Sign in</AuthButton>
//   <AuthButton loading={loading} icon={<ArrowRight size={15}/>}>
//     Continue
//   </AuthButton>
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion"

interface AuthButtonProps {
  children:  React.ReactNode
  loading?:  boolean
  disabled?: boolean
  type?:     "submit" | "button" | "reset"
  onClick?:  () => void
  icon?:     React.ReactNode
  variant?:  "primary" | "ghost" | "danger"
  fullWidth?: boolean
  className?: string
}

const SPINNER = (
  <motion.span
    className="inline-block w-4 h-4 rounded-full border-2
               border-slate-950/30 border-t-slate-950/80"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
  />
)

export default function AuthButton({
  children,
  loading   = false,
  disabled  = false,
  type      = "submit",
  onClick,
  icon,
  variant   = "primary",
  fullWidth = true,
  className = "",
}: AuthButtonProps) {
  const base = `relative flex items-center justify-center gap-2
                rounded-xl font-semibold text-[14px] py-3 px-5
                transition-all duration-200 select-none outline-none
                focus-visible:ring-2 focus-visible:ring-emerald-400/60
                disabled:cursor-not-allowed
                ${fullWidth ? "w-full" : ""}`

  const variants = {
    primary: `bg-emerald-500 text-slate-950
              hover:bg-emerald-400 active:bg-emerald-600
              disabled:bg-emerald-500/30 disabled:text-slate-950/40
              shadow-md shadow-emerald-900/30`,

    ghost:   `bg-white/[0.04] text-white/60 border border-white/[0.08]
              hover:bg-white/[0.08] hover:text-white/90
              disabled:opacity-30`,

    danger:  `bg-red-500/10 text-red-400 border border-red-500/20
              hover:bg-red-500/20
              disabled:opacity-30`,
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      whileTap={!disabled  && !loading ? { scale: 0.98 } : {}}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        SPINNER
      ) : (
        <>
          {children}
          {icon && (
            <motion.span
              className="flex-shrink-0"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.18 }}
            >
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  )
}