"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/EligibilitySection.tsx
//
// Displays:
//   ✦ Eligibility description text
//   ✦ Color-coded tag pills (category, education, gender, income, state)
//   ✦ "You match" indicator if user profile matches
//
// USAGE:
//   <EligibilitySection scholarship={scholarship} />
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Scholarship } from "@/types"

// ── Tag config ────────────────────────────────────────────────
const TAG_STYLES: Record<string, string> = {
  // Category
  SC:       "bg-violet-500/8  text-violet-300/80  ring-violet-500/20",
  ST:       "bg-blue-500/8    text-blue-300/80    ring-blue-500/20",
  OBC:      "bg-sky-500/8     text-sky-300/80     ring-sky-500/20",
  General:  "bg-slate-500/8   text-slate-300/80   ring-slate-500/20",
  EWS:      "bg-teal-500/8    text-teal-300/80    ring-teal-500/20",
  Minority: "bg-rose-500/8    text-rose-300/80    ring-rose-500/20",
  // Education
  "10th":   "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  "12th":   "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  UG:       "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  PG:       "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  PhD:      "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  Diploma:  "bg-emerald-500/8 text-emerald-300/80 ring-emerald-500/20",
  // Gender
  Female:   "bg-pink-500/8    text-pink-300/80    ring-pink-500/20",
  Male:     "bg-indigo-500/8  text-indigo-300/80  ring-indigo-500/20",
}

function Tag({ label, style }: { label: string; style?: string }) {
  const cls = style ?? TAG_STYLES[label] ?? "bg-white/5 text-white/50 ring-white/10"
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1   }}
      className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px]
                  font-medium ring-1 ${cls}`}
    >
      {label}
    </motion.span>
  )
}

// ── Match indicator ───────────────────────────────────────────
function MatchBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0  }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                 bg-emerald-500/10 ring-1 ring-emerald-500/25 text-emerald-400
                 text-[12px] font-semibold mb-5"
    >
      <ShieldCheck size={13} />
      You appear eligible for this scholarship
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
interface EligibilitySectionProps {
  scholarship: Scholarship
}

export default function EligibilitySection({ scholarship }: EligibilitySectionProps) {
  const [matches, setMatches] = useState(false)
  const supabase = createClient()

  // Simple eligibility check against user profile
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("education_level, category, state, gender, income_annual")
        .eq("id", user.id)
        .single()

      if (!profile) return

      const catMatch = !scholarship.category?.length
        || (profile.category != null && scholarship.category.includes(profile.category))
        || scholarship.category.includes("All")

      const eduMatch = !scholarship.education_level?.length
        || scholarship.education_level.some(l =>
            profile.education_level != null && profile.education_level.toLowerCase().includes(l.toLowerCase()))

      const stateMatch = !scholarship.state
        || scholarship.state === "All India"
        || scholarship.state === profile.state

      const genderMatch = !scholarship.gender
        || scholarship.gender === "All"
        || scholarship.gender === profile.gender

      const incomeMatch = !scholarship.income_max
        || !profile.income_annual
        || profile.income_annual <= scholarship.income_max

      setMatches(catMatch && eduMatch && stateMatch && genderMatch && incomeMatch)
    })
  }, [scholarship]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build all tag groups
  const tags: { label: string; style?: string }[] = [
    ...(scholarship.category?.map(c => ({ label: c })) ?? []),
    ...(scholarship.education_level?.map(l => ({ label: l })) ?? []),
    ...(scholarship.gender && scholarship.gender !== "All"
        ? [{ label: scholarship.gender }] : []),
    ...(scholarship.state && scholarship.state !== "All India"
        ? [{ label: scholarship.state, style: "bg-blue-500/8 text-blue-300/80 ring-blue-500/20" }]
        : []),
    ...(scholarship.income_max
        ? [{
            label: `Income ≤ ₹${scholarship.income_max.toLocaleString("en-IN")}`,
            style: "bg-amber-500/8 text-amber-300/80 ring-amber-500/20",
          }]
        : []),
  ]

  return (
    <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-6">

      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={14} className="text-emerald-400" />
        <h3 className="text-[14px] font-semibold text-white">
          Eligibility Criteria
        </h3>
      </div>

      {/* Match badge */}
      {matches && <MatchBadge />}

      {/* Description */}
      {scholarship.eligibility && (
        <p className="text-[13px] text-white/50 leading-relaxed mb-5">
          {scholarship.eligibility}
        </p>
      )}

      {/* Tag pills */}
      {tags.length > 0 && (
        <div className="pt-4 border-t border-white/[0.06]">
          <p className="text-[11px] font-medium text-white/25 uppercase
                        tracking-widest mb-3">
            Who can apply
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Tag label={t.label} style={t.style} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}