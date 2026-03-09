"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/FormInput.tsx
// A floating-label input with focus glow, error shake,
// and optional right-side element (e.g. show/hide password).
//
// USAGE:
//   <FormInput
//     label="Email address"
//     type="email"
//     value={email}
//     onChange={e => setEmail(e.target.value)}
//     error={errors.email}
//   />
// ─────────────────────────────────────────────────────────────

import { useState, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface FormInputProps {
  label:        string
  value:        string
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void
  type?:        string
  error?:       string
  hint?:        string
  disabled?:    boolean
  autoComplete?: string
  rightElement?: React.ReactNode   // e.g. show/hide password toggle
  className?:   string
}

export default function FormInput({
  label,
  value,
  onChange,
  type        = "text",
  error,
  hint,
  disabled    = false,
  autoComplete,
  rightElement,
  className   = "",
}: FormInputProps) {
  const [focused, setFocused] = useState(false)
  const id = useId()

  const lifted = focused || value.length > 0

  return (
    <div className={`relative ${className}`}>

      {/* Shake wrapper on error */}
      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Border glow ring */}
        <div
          className={`relative rounded-xl transition-all duration-200
            ${error
              ? "ring-1 ring-red-500/50 shadow-[0_0_0_3px_rgba(239,68,68,0.07)]"
              : focused
              ? "ring-1 ring-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.06)]"
              : "ring-1 ring-white/[0.08]"
            }`}
        >
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder=" "
            className={`peer w-full rounded-xl bg-white/[0.03] pt-6 pb-2
                        text-[14px] text-white outline-none
                        ${rightElement ? "pl-4 pr-11" : "px-4"}
                        disabled:opacity-40 disabled:cursor-not-allowed
                        placeholder-transparent caret-emerald-400`}
          />

          {/* Floating label */}
          <label
            htmlFor={id}
            className={`absolute left-4 pointer-events-none font-medium
                        transition-all duration-200 origin-left
                        ${lifted
                          ? "top-2 text-[10px] scale-100"
                          : "top-1/2 -translate-y-1/2 text-[14px]"
                        }
                        ${error
                          ? "text-red-400/80"
                          : focused
                          ? "text-emerald-400"
                          : "text-white/30"
                        }`}
          >
            {label}
          </label>

          {/* Right element slot */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
      </motion.div>

      {/* Error / hint message */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 mt-1.5 ml-1
                       text-[11px] text-red-400"
          >
            <AlertCircle size={11} className="flex-shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="mt-1.5 ml-1 text-[11px] text-white/25"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}