"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/CookieBanner.tsx
//
// GDPR-style cookie consent banner:
//   ✦ Slides up from bottom on first visit
//   ✦ "Accept all" / "Manage" / "Reject non-essential"
//   ✦ Manage drawer with granular toggles
//   ✦ Persists choice in localStorage (key: "sp_cookie_consent")
//   ✦ Exposes useCookieConsent() hook for analytics opt-in check
//
// ADD TO ROOT LAYOUT:
//   import CookieBanner from "@/components/CookieBanner"
//   // inside <body>:
//   <CookieBanner />
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, Settings, X, Check, Shield } from "lucide-react"

const T = {
  bg:         "#0d1829",
  border:     "rgba(255,255,255,0.09)",
  text:       "#f8fafc",
  textDim:    "rgba(248,250,252,0.55)",
  textMuted:  "rgba(248,250,252,0.28)",
  accent:     "#34d399",
  accentDim:  "rgba(52,211,153,0.10)",
  accentRing: "rgba(52,211,153,0.28)",
}

// ── Types & storage key ───────────────────────────────────────
const STORAGE_KEY = "sp_cookie_consent"

export interface CookieConsent {
  essential:   true       // always required
  analytics:   boolean
  preferences: boolean
  decided:     boolean
}

const DEFAULT: CookieConsent = {
  essential:   true,
  analytics:   false,
  preferences: false,
  decided:     false,
}

// ── Context (for use in other components) ────────────────────
const ConsentCtx = createContext<CookieConsent>(DEFAULT)
export function useCookieConsent() { return useContext(ConsentCtx) }

// ── Toggle switch ─────────────────────────────────────────────
function Toggle({ on, onChange, disabled = false }: {
  on: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <motion.button
      onClick={() => !disabled && onChange(!on)}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.92 }}
      className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors"
      style={{
        background:  on ? T.accent : "rgba(255,255,255,0.08)",
        border:      `1px solid ${on ? T.accentRing : T.border}`,
        cursor:      disabled ? "not-allowed" : "pointer",
        opacity:     disabled ? 0.5 : 1,
      }}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full shadow"
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ background: on ? T.bg : "rgba(255,255,255,0.4)" }}
      />
    </motion.button>
  )
}

// ── Main banner ───────────────────────────────────────────────
export default function CookieBanner() {
  const [consent,    setConsent]    = useState<CookieConsent>(DEFAULT)
  const [visible,    setVisible]    = useState(false)
  const [managing,   setManaging]   = useState(false)
  const [draft,      setDraft]      = useState({ analytics: false, preferences: false })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as CookieConsent
        setConsent(saved)
        setVisible(!saved.decided)
      } else {
        // First visit — show after short delay
        setTimeout(() => setVisible(true), 1200)
      }
    } catch {
      setTimeout(() => setVisible(true), 1200)
    }
  }, [])

  function save(next: CookieConsent) {
    const final = { ...next, decided: true }
    setConsent(final)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(final)) } catch {}
    setVisible(false)
    setManaging(false)
  }

  function acceptAll() {
    save({ essential: true, analytics: true, preferences: true, decided: true })
  }

  function rejectNonEssential() {
    save({ essential: true, analytics: false, preferences: false, decided: true })
  }

  function saveManaged() {
    save({ essential: true, analytics: draft.analytics, preferences: draft.preferences, decided: true })
  }

  function openManage() {
    setDraft({ analytics: consent.analytics, preferences: consent.preferences })
    setManaging(true)
  }

  const CATEGORIES = [
    {
      key:      "essential" as const,
      label:    "Essential cookies",
      desc:     "Required for login and core platform functionality. Cannot be disabled.",
      required: true,
      value:    true,
    },
    {
      key:      "analytics" as const,
      label:    "Analytics cookies",
      desc:     "Anonymous page views and performance data. Helps us understand what's working.",
      required: false,
      value:    draft.analytics,
    },
    {
      key:      "preferences" as const,
      label:    "Preference cookies",
      desc:     "Remember your theme choice and recently viewed scholarships (stored locally).",
      required: false,
      value:    draft.preferences,
    },
  ]

  return (
    <ConsentCtx.Provider value={consent}>
      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop for manage drawer on mobile */}
            {managing && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[59] bg-black/40"
                onClick={() => setManaging(false)}
              />
            )}

            {/* Banner */}
            <motion.div
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "110%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.1 }}
              className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px]
                         z-[60] rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background:   T.bg,
                border:       `1px solid ${T.border}`,
                boxShadow:    "0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              {/* Main banner content */}
              <AnimatePresence mode="wait">
                {!managing ? (
                  <motion.div key="main"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-5">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                          <Cookie size={14} style={{ color: T.accent }} />
                        </div>
                        <p className="text-[14px] font-bold" style={{ color: T.text }}>
                          Cookie preferences
                        </p>
                      </div>
                      <button onClick={rejectNonEssential}
                        className="w-6 h-6 rounded-lg flex items-center justify-center
                                   transition-colors hover:opacity-70"
                        style={{ color: T.textMuted }}>
                        <X size={14} />
                      </button>
                    </div>

                    {/* Body */}
                    <p className="text-[13px] leading-relaxed mb-4" style={{ color: T.textDim }}>
                      We use essential cookies to keep you logged in, and optional analytics cookies
                      to improve the platform. We never use advertising cookies.{" "}
                      <Link href="/cookie-policy"
                        className="underline underline-offset-2 hover:opacity-80"
                        style={{ color: T.accent }}>
                        Learn more
                      </Link>
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        onClick={acceptAll}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 rounded-xl text-[13px] font-bold
                                   flex items-center justify-center gap-1.5"
                        style={{ background: T.accent, color: "#020817" }}>
                        <Check size={13} /> Accept all
                      </motion.button>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={openManage}
                          whileTap={{ scale: 0.96 }}
                          className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                                     flex items-center justify-center gap-1.5"
                          style={{
                            background: T.accentDim,
                            border:     `1px solid ${T.accentRing}`,
                            color:      T.accent,
                          }}>
                          <Settings size={12} /> Manage
                        </motion.button>
                        <motion.button
                          onClick={rejectNonEssential}
                          whileTap={{ scale: 0.96 }}
                          className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border:     `1px solid ${T.border}`,
                            color:      T.textDim,
                          }}>
                          Reject optional
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Manage drawer */
                  <motion.div key="manage"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-5">

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Shield size={14} style={{ color: T.accent }} />
                        <p className="text-[14px] font-bold" style={{ color: T.text }}>
                          Manage cookies
                        </p>
                      </div>
                      <button onClick={() => setManaging(false)}>
                        <X size={14} style={{ color: T.textMuted }} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-5">
                      {CATEGORIES.map(cat => (
                        <div key={cat.key}
                          className="flex items-start justify-between gap-4 p-3 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}` }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[13px] font-semibold" style={{ color: T.text }}>
                                {cat.label}
                              </p>
                              {cat.required && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                                  style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] leading-relaxed" style={{ color: T.textMuted }}>
                              {cat.desc}
                            </p>
                          </div>
                          <Toggle
                            on={cat.value}
                            disabled={cat.required}
                            onChange={v => setDraft(d => ({ ...d, [cat.key]: v }))}
                          />
                        </div>
                      ))}
                    </div>

                    <motion.button
                      onClick={saveManaged}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 rounded-xl text-[13px] font-bold
                                 flex items-center justify-center gap-1.5"
                      style={{ background: T.accent, color: "#020817" }}>
                      <Check size={13} /> Save preferences
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConsentCtx.Provider>
  )
}