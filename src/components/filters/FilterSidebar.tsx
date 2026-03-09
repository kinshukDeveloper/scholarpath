"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/filters/FilterSidebar.tsx
//
// Features:
//   ✦ Category chips (multi-select, color-coded)
//   ✦ Education level chips (multi-select)
//   ✦ State dropdown (searchable)
//   ✦ Gender toggle (All / Male / Female)
//   ✦ Amount range (preset buttons)
//   ✦ Featured only toggle
//   ✦ Active filter count badge
//   ✦ Reset all button
//   ✦ Collapsible sections with spring animation
//   ✦ Mobile: full-screen drawer triggered by parent
//
// USAGE (desktop):
//   <FilterSidebar filters={filters} onChange={setFilters} />
//
// USAGE (mobile drawer):
//   <FilterSidebar
//     filters={filters}
//     onChange={setFilters}
//     mobile
//     open={drawerOpen}
//     onClose={() => setDrawerOpen(false)}
//   />
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SlidersHorizontal, X, ChevronDown, Star,
  RotateCcw, Check,
} from "lucide-react"
import type { ScholarshipFilters } from "@/types"

// ── Data ──────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "General",  color: "bg-slate-500/10  text-slate-300/80  ring-slate-500/20  data-[active]:bg-slate-500/20  data-[active]:ring-slate-400/40  data-[active]:text-slate-200" },
  { label: "OBC",      color: "bg-sky-500/10    text-sky-300/80    ring-sky-500/20    data-[active]:bg-sky-500/20    data-[active]:ring-sky-400/40    data-[active]:text-sky-200" },
  { label: "SC",       color: "bg-violet-500/10 text-violet-300/80 ring-violet-500/20 data-[active]:bg-violet-500/20 data-[active]:ring-violet-400/40 data-[active]:text-violet-200" },
  { label: "ST",       color: "bg-blue-500/10   text-blue-300/80   ring-blue-500/20   data-[active]:bg-blue-500/20   data-[active]:ring-blue-400/40   data-[active]:text-blue-200" },
  { label: "EWS",      color: "bg-teal-500/10   text-teal-300/80   ring-teal-500/20   data-[active]:bg-teal-500/20   data-[active]:ring-teal-400/40   data-[active]:text-teal-200" },
  { label: "Minority", color: "bg-rose-500/10   text-rose-300/80   ring-rose-500/20   data-[active]:bg-rose-500/20   data-[active]:ring-rose-400/40   data-[active]:text-rose-200" },
]

const EDUCATION_LEVELS = [
  "10th", "11th", "12th", "Diploma", "UG (Grad)", "PG (Post-Grad)", "PhD",
]

const AMOUNT_PRESETS = [
  { label: "Any",   value: undefined },
  { label: "₹5K+",  value: 5000      },
  { label: "₹25K+", value: 25000     },
  { label: "₹50K+", value: 50000     },
  { label: "₹1L+",  value: 100000    },
]

const STATES = [
  "All India","Andhra Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh",
  "Uttarakhand","West Bengal",
]

// ── Helpers ───────────────────────────────────────────────────
function countActiveFilters(f: ScholarshipFilters): number {
  let n = 0
  if (f.category?.length)         n += f.category.length
  if (f.education_level?.length)  n += f.education_level.length
  if (f.state)                    n++
  if (f.gender && f.gender !== "All") n++
  if (f.amount_min)               n++
  if (f.is_featured)              n++
  return n
}

// ── Sub-components ────────────────────────────────────────────

// Collapsible section wrapper
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest
                         text-white/30 group-hover:text-white/50 transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={13} className="text-white/20" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0  }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0  }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Multi-select chip
function Chip({
  label,
  active,
  colorClass,
  onToggle,
}: {
  label:      string
  active:     boolean
  colorClass: string
  onToggle:   () => void
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.04 }}
      whileTap={{  scale: 0.94 }}
      data-active={active ? "" : undefined}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                  text-[12px] font-medium ring-1 transition-all duration-150
                  ${colorClass}`}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{    width: 0, opacity: 0 }}
          >
            <Check size={10} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
      {label}
    </motion.button>
  )
}

// Toggle between options (e.g. gender, amount presets)
function OptionRow<T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
}: {
  options:  T[]
  value:    T
  onChange: (v: T) => void
  getLabel: (o: T) => string
  getValue: (o: T) => unknown
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const active = getValue(opt) === getValue(value)
        return (
          <motion.button
            key={getLabel(opt)}
            onClick={() => onChange(opt)}
            whileTap={{ scale: 0.94 }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium
                        ring-1 transition-all duration-150
                        ${active
                          ? "bg-emerald-500/15 ring-emerald-500/40 text-emerald-300"
                          : "bg-white/[0.03] ring-white/[0.08] text-white/40 hover:text-white/70 hover:ring-white/20"
                        }`}
          >
            {getLabel(opt)}
          </motion.button>
        )
      })}
    </div>
  )
}

// Searchable state dropdown
function StateDropdown({
  value,
  onChange,
}: {
  value:    string
  onChange: (v: string) => void
}) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState("")

  const filtered = STATES.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5
                    text-[13px] ring-1 transition-all text-left
                    ${open
                      ? "ring-emerald-500/35 bg-emerald-500/5"
                      : "ring-white/[0.08] bg-white/[0.03] hover:ring-white/20"
                    }
                    ${value ? "text-white/80" : "text-white/25"}`}
      >
        {value || "All states"}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} className="text-white/25 flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setSearch("") }} />
            <motion.div
              initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0,  scaleY: 1    }}
              exit={{    opacity: 0, y: -6, scaleY: 0.95 }}
              transition={{ duration: 0.18 }}
              style={{ transformOrigin: "top" }}
              className="absolute z-20 top-full mt-1.5 w-full rounded-xl
                         bg-slate-900 ring-1 ring-white/[0.08]
                         shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* Search input */}
              <div className="px-3 pt-2.5 pb-1.5">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search state…"
                  className="w-full bg-white/[0.05] rounded-lg px-3 py-2
                             text-[12px] text-white placeholder:text-white/25
                             outline-none caret-emerald-400 ring-1 ring-white/[0.07]"
                  autoFocus
                />
              </div>

              {/* Options */}
              <ul className="max-h-44 overflow-y-auto py-1">
                {filtered.map(s => (
                  <li key={s}>
                    <button
                      onClick={() => {
                        onChange(s === "All India" ? "" : s)
                        setOpen(false)
                        setSearch("")
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] transition-colors
                                  ${s === value || (s === "All India" && !value)
                                    ? "text-emerald-400 bg-emerald-500/8"
                                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                                  }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-4 py-3 text-[12px] text-white/20 text-center">
                    No states found
                  </li>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main FilterSidebar ────────────────────────────────────────
interface FilterSidebarProps {
  filters:   ScholarshipFilters
  onChange:  (f: ScholarshipFilters) => void
  mobile?:   boolean
  open?:     boolean
  onClose?:  () => void
}

export default function FilterSidebar({
  filters,
  onChange,
  mobile  = false,
  open    = false,
  onClose,
}: FilterSidebarProps) {
  const activeCount = countActiveFilters(filters)

  // Helpers
  function toggleArr(key: "category" | "education_level", val: string) {
    const arr = filters[key] ?? []
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
    })
  }

  function reset() {
    onChange({})
  }

  // ── Panel content ────────────────────────────────────────
  const panel = (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-emerald-400" />
          <span className="text-[14px] font-semibold text-white">Filters</span>
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{    scale: 0 }}
                className="min-w-[20px] h-5 px-1.5 rounded-full
                           bg-emerald-500 text-slate-950 text-[10px]
                           font-bold flex items-center justify-center"
              >
                {activeCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={reset}
              className="flex items-center gap-1 text-[11px] text-white/30
                         hover:text-white/60 transition-colors"
            >
              <RotateCcw size={11} /> Reset
            </motion.button>
          )}
          {mobile && onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center
                         justify-center hover:bg-white/[0.08] transition-colors"
            >
              <X size={14} className="text-white/40" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto space-y-0 pr-0.5
                      scrollbar-thin scrollbar-track-transparent
                      scrollbar-thumb-white/10">

        {/* Category */}
        <Section title="Category">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(({ label, color }) => (
              <Chip
                key={label}
                label={label}
                active={(filters.category ?? []).includes(label)}
                colorClass={color}
                onToggle={() => toggleArr("category", label)}
              />
            ))}
          </div>
        </Section>

        {/* Education Level */}
        <Section title="Education Level">
          <div className="flex flex-wrap gap-1.5">
            {EDUCATION_LEVELS.map(lvl => (
              <Chip
                key={lvl}
                label={lvl}
                active={(filters.education_level ?? []).includes(lvl)}
                colorClass="bg-emerald-500/8 text-emerald-300/70 ring-emerald-500/15
                            data-[active]:bg-emerald-500/20 data-[active]:ring-emerald-400/40 data-[active]:text-emerald-200"
                onToggle={() => toggleArr("education_level", lvl)}
              />
            ))}
          </div>
        </Section>

        {/* State */}
        <Section title="State">
          <StateDropdown
            value={filters.state ?? ""}
            onChange={state => onChange({ ...filters, state: state || undefined })}
          />
        </Section>

        {/* Gender */}
        <Section title="Gender">
          <OptionRow
            options={["All", "Female", "Male"]}
            value={filters.gender ?? "All"}
            onChange={g => onChange({ ...filters, gender: g === "All" ? undefined : g })}
            getLabel={o => o}
            getValue={o => o}
          />
        </Section>

        {/* Amount */}
        <Section title="Minimum Amount">
          <OptionRow
            options={AMOUNT_PRESETS}
            value={AMOUNT_PRESETS.find(p => p.value === filters.amount_min) ?? AMOUNT_PRESETS[0]}
            onChange={p => onChange({ ...filters, amount_min: p.value })}
            getLabel={p => p.label}
            getValue={p => p.value}
          />
        </Section>

        {/* Featured toggle */}
        <Section title="Other" defaultOpen={false}>
          <motion.button
            onClick={() => onChange({ ...filters, is_featured: !filters.is_featured })}
            whileTap={{ scale: 0.96 }}
            className={`w-full flex items-center justify-between px-3 py-2.5
                        rounded-xl ring-1 transition-all
                        ${filters.is_featured
                          ? "bg-amber-500/10 ring-amber-500/30"
                          : "bg-white/[0.03] ring-white/[0.07] hover:ring-white/20"
                        }`}
          >
            <span className="flex items-center gap-2 text-[13px] font-medium
                             text-white/60">
              <Star size={13} className={filters.is_featured ? "text-amber-400" : "text-white/25"} />
              Featured only
            </span>
            {/* Toggle pill */}
            <div className={`w-8 h-4 rounded-full transition-colors relative
                             ${filters.is_featured ? "bg-amber-500" : "bg-white/10"}`}>
              <motion.div
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                animate={{ left: filters.is_featured ? "18px" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              />
            </div>
          </motion.button>
        </Section>
      </div>

      {/* Mobile apply button */}
      {mobile && (
        <div className="pt-4 flex-shrink-0">
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950
                       text-[14px] font-bold hover:bg-emerald-400 transition-colors"
          >
            Show results
            {activeCount > 0 && ` (${activeCount} filter${activeCount > 1 ? "s" : ""})`}
          </motion.button>
        </div>
      )}
    </div>
  )

  // ── Desktop: static sidebar ──────────────────────────────
  if (!mobile) {
    return (
      <aside className="w-56 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)]
                        rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-5">
        {panel}
      </aside>
    )
  }

  // ── Mobile: full-screen drawer ───────────────────────────
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0       }}
            exit={{    y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50
                       bg-slate-950 rounded-t-2xl ring-1 ring-white/[0.07]
                       px-5 pt-5 pb-6 max-h-[85vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-5 flex-shrink-0" />
            {panel}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}