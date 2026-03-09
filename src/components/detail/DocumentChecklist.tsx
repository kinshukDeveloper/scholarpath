"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/DocumentChecklist.tsx
//
// Interactive document checklist with:
//   ✦ Check/uncheck animation (spring pop)
//   ✦ Progress bar that fills as docs are checked
//   ✦ Persisted to localStorage keyed by scholarshipId
//   ✦ "All ready!" celebration state
//
// USAGE:
//   <DocumentChecklist
//     scholarshipId={scholarship.id}
//     documents={scholarship.documents}
//   />
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, FileText, PartyPopper } from "lucide-react"

// ── Storage helpers ───────────────────────────────────────────
function storageKey(id: string) { return `sp-docs-${id}` }

function loadChecked(id: string): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(storageKey(id)) ?? "{}") }
  catch { return {} }
}

function saveChecked(id: string, state: Record<string, boolean>) {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKey(id), JSON.stringify(state))
}

// ── Single doc row ────────────────────────────────────────────
function DocRow({
  doc,
  checked,
  onToggle,
  index,
}: {
  doc:      string
  checked:  boolean
  onToggle: () => void
  index:    number
}) {
  return (
    <motion.button
      onClick={onToggle}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0   }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      whileHover={{ x: 2 }}
      className="w-full flex items-center gap-3 py-2.5 text-left group"
    >
      {/* Checkbox */}
      <motion.div
        animate={{
          background:   checked ? "rgb(52 211 153)"       : "rgba(255,255,255,0.03)",
          borderColor:  checked ? "rgb(52 211 153)"       : "rgba(255,255,255,0.12)",
          boxShadow:    checked ? "0 0 10px rgba(52,211,153,0.3)" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center
                   flex-shrink-0 transition-colors"
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0   }}
              exit={{    scale: 0, rotate: 12  }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
            >
              <Check size={11} className="text-slate-950" strokeWidth={3.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <span
        className={`text-[13px] leading-snug transition-all duration-200
                    ${checked
                      ? "text-white/25 line-through"
                      : "text-white/65 group-hover:text-white/90"
                    }`}
      >
        {doc}
      </span>
    </motion.button>
  )
}

// ── Main component ────────────────────────────────────────────
interface DocumentChecklistProps {
  scholarshipId: string
  documents:     string[]
}

export default function DocumentChecklist({
  scholarshipId,
  documents,
}: DocumentChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [celebrated, setCelebrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setChecked(loadChecked(scholarshipId))
  }, [scholarshipId])

  const doneCount = Object.values(checked).filter(Boolean).length
  const total     = documents.length
  const pct       = total > 0 ? (doneCount / total) * 100 : 0
  const allDone   = doneCount === total && total > 0

  // Trigger celebration once when all checked
  useEffect(() => {
    if (allDone && !celebrated) setCelebrated(true)
    if (!allDone) setCelebrated(false)
  }, [allDone]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(doc: string) {
    const next = { ...checked, [doc]: !checked[doc] }
    setChecked(next)
    saveChecked(scholarshipId, next)
  }

  function resetAll() {
    setChecked({})
    saveChecked(scholarshipId, {})
  }

  if (!documents || documents.length === 0) return null

  return (
    <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-emerald-400" />
          <h3 className="text-[14px] font-semibold text-white">
            Documents Checklist
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold tabular-nums"
            style={{ color: allDone ? "#34d399" : "rgba(255,255,255,0.3)" }}>
            {doneCount}/{total}
          </span>
          {doneCount > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={resetAll}
              className="text-[11px] text-white/20 hover:text-white/50
                         transition-colors"
            >
              Reset
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/[0.06] mb-5 mt-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: allDone
              ? "linear-gradient(90deg, #34d399, #10b981)"
              : "linear-gradient(90deg, #34d399, #6ee7b7)",
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Doc rows */}
      <div className="divide-y divide-white/[0.04]">
        {documents.map((doc, i) => (
          <DocRow
            key={doc}
            doc={doc}
            checked={!!checked[doc]}
            onToggle={() => toggle(doc)}
            index={i}
          />
        ))}
      </div>

      {/* All done celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{    opacity: 0, y: 8, scale: 0.96 }}
            className="mt-5 flex items-center gap-2.5 rounded-xl px-4 py-3
                       bg-emerald-500/10 ring-1 ring-emerald-500/25"
          >
            <PartyPopper size={15} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-emerald-400">
                All documents ready!
              </p>
              <p className="text-[11px] text-emerald-400/50 mt-0.5">
                You&apos;re prepared to apply for this scholarship.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}