"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/filters/ActiveFilterBar.tsx
//
// Shows currently active filters as dismissible pill tags.
// Appears only when at least one filter is active.
// Each pill removes just that filter on click.
// "Clear all" removes everything.
//
// USAGE:
//   <ActiveFilterBar filters={filters} onChange={setFilters} />
// ─────────────────────────────────────────────────────────────

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { ScholarshipFilters } from "@/types"

// ── Build pills from filters object ──────────────────────────
interface Pill {
  key:   string
  label: string
  clear: () => ScholarshipFilters
}

function buildPills(f: ScholarshipFilters): Pill[] {
  const pills: Pill[] = []

  f.category?.forEach(c =>
    pills.push({
      key:   `cat-${c}`,
      label: c,
      clear: () => ({ ...f, category: f.category?.filter(v => v !== c) }),
    })
  )

  f.education_level?.forEach(l =>
    pills.push({
      key:   `edu-${l}`,
      label: l,
      clear: () => ({ ...f, education_level: f.education_level?.filter(v => v !== l) }),
    })
  )

  if (f.state)
    pills.push({
      key:   "state",
      label: f.state,
      clear: () => ({ ...f, state: undefined }),
    })

  if (f.gender && f.gender !== "All")
    pills.push({
      key:   "gender",
      label: f.gender,
      clear: () => ({ ...f, gender: undefined }),
    })

  if (f.amount_min)
    pills.push({
      key:   "amount",
      label: `₹${(f.amount_min / 1000).toFixed(0)}K+`,
      clear: () => ({ ...f, amount_min: undefined }),
    })

  if (f.is_featured)
    pills.push({
      key:   "featured",
      label: "★ Featured",
      clear: () => ({ ...f, is_featured: undefined }),
    })

  return pills
}

// ── Component ─────────────────────────────────────────────────
interface ActiveFilterBarProps {
  filters:   ScholarshipFilters
  onChange:  (f: ScholarshipFilters) => void
  className?: string
}

export default function ActiveFilterBar({
  filters,
  onChange,
  className = "",
}: ActiveFilterBarProps) {
  const pills = buildPills(filters)

  return (
    <AnimatePresence>
      {pills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0   }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{    opacity: 0, height: 0   }}
          transition={{ duration: 0.22 }}
          className={`overflow-hidden ${className}`}
        >
          <div className="flex flex-wrap items-center gap-2 py-2">

            {/* Pills */}
            <AnimatePresence>
              {pills.map(pill => (
                <motion.button
                  key={pill.key}
                  onClick={() => onChange(pill.clear())}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1    }}
                  exit={{    opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{  scale: 0.94 }}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1
                             rounded-full text-[12px] font-medium
                             bg-emerald-500/10 ring-1 ring-emerald-500/25
                             text-emerald-300 hover:bg-emerald-500/20
                             transition-colors"
                >
                  {pill.label}
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20
                                   flex items-center justify-center flex-shrink-0">
                    <X size={9} strokeWidth={2.5} />
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Clear all */}
            {pills.length > 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onChange({})}
                className="text-[11px] text-white/25 hover:text-white/50
                           transition-colors ml-1 underline underline-offset-2"
              >
                Clear all
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}