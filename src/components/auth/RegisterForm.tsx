"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/RegisterForm.tsx
// 3-step registration form:
//   Step 1 → Email + password + name
//   Step 2 → Education level + category  (chip selectors)
//   Step 3 → State + income              (for eligibility matching)
//
// USAGE:
//   // src/app/(auth)/register/page.tsx
//   import RegisterForm  from "@/components/auth/RegisterForm"
//   import GoogleButton  from "@/components/auth/GoogleButton"
//   import AuthDivider   from "@/components/auth/AuthDivider"
//
//   export default function RegisterPage() {
//     return (
//       <div className="...your page wrapper...">
//         <GoogleButton label="Sign up with Google" redirectTo="/dashboard?welcome=1" />
//         <AuthDivider label="or sign up with email" />
//         <RegisterForm redirectTo="/dashboard?welcome=1" />
//       </div>
//     )
//   }
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, ArrowLeft, Check,
  Eye, EyeOff, AlertTriangle, User, GraduationCap, MapPin,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import FormInput  from "@/components/auth/FormInput"
import AuthButton from "@/components/auth/AuthButton"

// ── Data ──────────────────────────────────────────────────────
const EDUCATION_LEVELS = [
  "10th", "11th", "12th", "Diploma",
  "UG (Grad)", "PG (Post-Grad)", "PhD",
]

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS", "Minority"]

const STATES = [
  "Andhra Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh",
  "Uttarakhand","West Bengal",
]

// ── Step config ───────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Account",  icon: User          },
  { id: 2, label: "Profile",  icon: GraduationCap },
  { id: 3, label: "Location", icon: MapPin        },
]

// ── Chip selector ─────────────────────────────────────────────
function ChipGroup({
  options,
  value,
  onChange,
}: {
  options:  string[]
  value:    string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <motion.button
            key={opt}
            type="button"
            onClick={() => onChange(active ? "" : opt)}
            whileHover={{ scale: 1.04 }}
            whileTap={{  scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-[12px] font-medium transition-all duration-150
                        ${active
                          ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
                          : "bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20"
                        }`}
          >
            {active && <Check size={11} strokeWidth={3} />}
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}

// ── Select dropdown ───────────────────────────────────────────
function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label:       string
  options:     string[]
  value:       string
  onChange:    (v: string) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <p className="text-[11px] font-medium text-white/30 mb-2">{label}</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between
                      rounded-xl px-4 py-3 text-[14px] transition-all duration-150
                      bg-white/[0.03] border text-left
                      ${open
                        ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                        : "border-white/[0.08] hover:border-white/20"
                      }
                      ${value ? "text-white" : "text-white/30"}`}
        >
          {value || placeholder}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/25 ml-2"
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <motion.ul
                initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0,  scaleY: 1    }}
                exit={{    opacity: 0, y: -6, scaleY: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: "top" }}
                className="absolute z-20 mt-1.5 w-full max-h-52 overflow-y-auto
                           rounded-xl bg-slate-900 border border-white/[0.08]
                           shadow-2xl shadow-black/50 py-1"
              >
                {options.map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => { onChange(opt); setOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-[13px]
                                  transition-colors
                                  ${opt === value
                                    ? "text-emerald-400 bg-emerald-500/[0.08]"
                                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                                  }`}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Step progress indicator ───────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const done   = current > step.id
        const active = current === step.id
        const Icon   = step.icon

        return (
          <div key={step.id} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  background: done
                    ? "rgba(16,185,129,1)"
                    : active
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(255,255,255,0.04)",
                  borderColor: done || active
                    ? "rgba(16,185,129,0.5)"
                    : "rgba(255,255,255,0.08)",
                }}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center"
              >
                {done
                  ? <Check size={14} className="text-slate-950" strokeWidth={3} />
                  : <Icon  size={14} className={active ? "text-emerald-400" : "text-white/20"} />
                }
              </motion.div>
              <span className={`text-[10px] font-medium hidden sm:block
                                ${active ? "text-emerald-400" : done ? "text-white/40" : "text-white/20"}`}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3 mb-5">
                <div className="h-px bg-white/[0.06] relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-emerald-500/40"
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Slide animation variants ──────────────────────────────────
const slide = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center:               ({ x: 0,          opacity: 1 }),
  exit:  (dir: number) => ({ x: dir * -48, opacity: 0 }),
}

// ── Main component ────────────────────────────────────────────
interface RegisterFormProps {
  redirectTo?: string
}

export default function RegisterForm({ redirectTo = "/dashboard?welcome=1" }: RegisterFormProps) {
  const [step,      setStep]      = useState(1)
  const [direction, setDirection] = useState(1)   // 1 = forward, -1 = back
  const [loading,   setLoading]   = useState(false)
  const [apiError,  setApiError]  = useState("")
  const [showPass,  setShowPass]  = useState(false)

  // Form values
  const [fullName,       setFullName]       = useState("")
  const [email,          setEmail]          = useState("")
  const [password,       setPassword]       = useState("")
  const [educationLevel, setEducationLevel] = useState("")
  const [category,       setCategory]       = useState("")
  const [state,          setState]          = useState("")
  const [incomeAnnual,   setIncomeAnnual]   = useState("")

  // Field errors per step
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router   = useRouter()
  const supabase = createClient()

  // ── Validation per step ──────────────────────────────────
  function validateStep(n: number): Record<string, string> {
    const e: Record<string, string> = {}
    if (n === 1) {
      if (!fullName.trim())               e.fullName = "Full name is required"
      if (!email)                         e.email    = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email"
      if (!password)                      e.password = "Password is required"
      else if (password.length < 8)       e.password = "Minimum 8 characters"
    }
    // Steps 2 & 3 are optional — better UX than blocking
    return e
  }

  function goNext() {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  // ── Submit (step 3) ──────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError("")
    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      const msg = signUpError.message.includes("already registered")
        ? "This email is already in use — try signing in"
        : signUpError.message
      setApiError(msg)
      setLoading(false)
      return
    }

    // Upsert profile — trigger may or may not have run yet
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").upsert({
        id:              user.id,
        full_name:       fullName      || null,
        education_level: educationLevel || null,
        category:        category       || null,
        state:           state          || null,
        income_annual:   incomeAnnual   ? Number(incomeAnnual) : null,
        onboarded:       true,
      }, { onConflict: "id" })
    }

    router.push(redirectTo)
    router.refresh()
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <StepIndicator current={step} />

      {/* API error */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -8 }}
            className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-4
                       bg-red-500/[0.08] border border-red-500/[0.18]"
          >
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-400">{apiError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate>
        {/* Animated step content */}
        <div className="overflow-hidden" style={{ minHeight: 240 }}>
          <AnimatePresence mode="wait" custom={direction}>

            {/* ── Step 1: Account ─── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <FormInput
                  label="Full name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })) }}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <FormInput
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })) }}
                  error={errors.email}
                  autoComplete="email"
                />
                <FormInput
                  label="Password (min 8 characters)"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }}
                  error={errors.password}
                  autoComplete="new-password"
                  hint={!errors.password && password.length > 0 && password.length < 8
                    ? `${8 - password.length} more characters needed`
                    : undefined}
                  rightElement={
                    <button type="button" onClick={() => setShowPass((s) => !s)}
                      className="text-white/25 hover:text-white/60 transition-colors p-0.5"
                      tabIndex={-1}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </motion.div>
            )}

            {/* ── Step 2: Profile ─── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <div>
                  <p className="text-[11px] font-medium text-white/30 mb-2.5">
                    Current education level
                  </p>
                  <ChipGroup
                    options={EDUCATION_LEVELS}
                    value={educationLevel}
                    onChange={setEducationLevel}
                  />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white/30 mb-2.5">
                    Category
                    <span className="ml-1 text-white/15">(used for eligibility matching)</span>
                  </p>
                  <ChipGroup
                    options={CATEGORIES}
                    value={category}
                    onChange={setCategory}
                  />
                </div>
                <p className="text-[11px] text-white/20">
                  ✦ Both fields are optional — you can update them in Settings anytime
                </p>
              </motion.div>
            )}

            {/* ── Step 3: Location ─── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <SelectField
                  label="Your state"
                  options={STATES}
                  value={state}
                  onChange={setState}
                  placeholder="Select your state…"
                />
                <FormInput
                  label="Annual family income (₹) — optional"
                  type="number"
                  value={incomeAnnual}
                  onChange={(e) => setIncomeAnnual(e.target.value)}
                  hint="Helps us show income-based scholarships you qualify for"
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0  }}
            >
              <AuthButton
                type="button"
                onClick={goBack}
                variant="ghost"
                fullWidth={false}
                icon={<ArrowLeft size={15} />}
                className="px-5 flex-row-reverse"
              >
                Back
              </AuthButton>
            </motion.div>
          )}

          {step < 3 ? (
            <AuthButton
              type="button"
              onClick={goNext}
              icon={<ArrowRight size={15} />}
            >
              Continue
            </AuthButton>
          ) : (
            <AuthButton
              loading={loading}
              icon={<Check size={15} />}
            >
              Create account
            </AuthButton>
          )}
        </div>
      </form>

      <p className="text-center mt-5 text-[12px] text-white/25">
        Already have an account?{" "}
        <Link href="/login"
          className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}