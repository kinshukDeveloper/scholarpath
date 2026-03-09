"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/LoginForm.tsx
// Self-contained login form. Drop onto /login/page.tsx.
// Handles validation, error display, and redirect on success.
//
// USAGE:
//   // src/app/(auth)/login/page.tsx
//   import LoginForm   from "@/components/auth/LoginForm"
//   import GoogleButton from "@/components/auth/GoogleButton"
//   import AuthDivider  from "@/components/auth/AuthDivider"
//
//   export default function LoginPage() {
//     return (
//       <div className="...your page wrapper...">
//         <GoogleButton redirectTo="/dashboard" />
//         <AuthDivider />
//         <LoginForm redirectTo="/dashboard" />
//       </div>
//     )
//   }
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import AuthButton from "./AuthButton"
import FormInput from "./FormInput"
// ── Validation ────────────────────────────────────────────────
function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {}
  if (!email)                      errors.email    = "Email is required"
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email"
  if (!password)                   errors.password = "Password is required"
  else if (password.length < 6)    errors.password = "Minimum 6 characters"
  return errors
}

// ── Component ─────────────────────────────────────────────────
interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState("")

  const router   = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError("")

    // Client-side validation first
    const errs = validate(email, password)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Map Supabase error messages to friendly ones
      const msg = error.message.includes("Invalid login")
        ? "Incorrect email or password"
        : error.message.includes("Email not confirmed")
        ? "Please verify your email first"
        : error.message
      setApiError(msg)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      noValidate
      className="w-full space-y-4"
    >

      {/* API error banner */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            className="flex items-start gap-2.5 rounded-xl px-4 py-3
                       bg-red-500/[0.08] border border-red-500/[0.18]"
          >
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-400">{apiError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <FormInput
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })) }}
        error={errors.email}
        autoComplete="email"
      />

      {/* Password */}
      <FormInput
        label="Password"
        type={showPass ? "text" : "password"}
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }}
        error={errors.password}
        autoComplete="current-password"
        rightElement={
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="text-white/25 hover:text-white/60 transition-colors p-0.5"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {/* Forgot password link */}
      <div className="flex justify-end -mt-1">
        <Link
          href="/forgot-password"
          className="text-[12px] text-white/30 hover:text-white/60
                     transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <AuthButton
        loading={loading}
        icon={<ArrowRight size={15} />}
        className="mt-1"
      >
        Sign in
      </AuthButton>

      {/* Register link */}
      <p className="text-center text-[12px] text-white/25 pt-1">
        No account?{" "}
        <Link
          href="/register"
          className="text-emerald-400 font-semibold hover:text-emerald-300
                     transition-colors"
        >
          Create one free
        </Link>
      </p>

    </motion.form>
  )
}