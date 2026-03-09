"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/scholarships/ScholarshipCard.tsx
//
// Features:
//   ✦ Bookmark toggle (optimistic UI, syncs to Supabase)
//   ✦ Deadline urgency badge (red/yellow/green)
//   ✦ Document count indicator
//   ✦ Featured / sponsored badge
//   ✦ Framer Motion hover lift + bookmark pop
//   ✦ GSAP scroll reveal (triggered by parent ScholarshipGrid)
//
// USAGE:
//   <ScholarshipCard
//     scholarship={s}
//     isBookmarked={bookmarks.has(s.id)}
//     onBookmark={handleBookmark}
//     index={i}               ← for staggered GSAP reveal
//   />
// ─────────────────────────────────────────────────────────────

import { useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Bookmark, BookmarkCheck, IndianRupee,
  FileText, Star, ArrowUpRight,
} from "lucide-react"
import type { Scholarship } from "@/types"

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)

// ── Helpers ───────────────────────────────────────────────────
function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 864e5)
}

function formatAmount(amount: number): string {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)   return `${(amount / 1000).toFixed(0)}K`
  return String(amount)
}

// ── Urgency config ────────────────────────────────────────────
function getUrgency(deadline: string) {
  const d = daysUntil(deadline)
  if (d < 0)   return { label: "Closed",        dot: "bg-white/20",      text: "text-white/30",     ring: ""                                    }
  if (d <= 7)  return { label: `${d}d left`,    dot: "bg-red-400",       text: "text-red-400",      ring: "ring-1 ring-red-500/20 bg-red-500/8"  }
  if (d <= 30) return { label: `${d}d left`,    dot: "bg-amber-400",     text: "text-amber-400",    ring: "ring-1 ring-amber-500/20 bg-amber-500/8" }
  return       { label: `${d}d left`,           dot: "bg-emerald-400",   text: "text-white/35",     ring: ""                                    }
}

// ── BookmarkButton ────────────────────────────────────────────
function BookmarkButton({
  active,
  onClick,
}: {
  active: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.1 }}
      className={`relative w-8 h-8 rounded-xl flex items-center justify-center
                  flex-shrink-0 transition-all duration-200
                  ${active
                    ? "bg-emerald-500/15 ring-1 ring-emerald-500/30"
                    : "bg-white/[0.04] ring-1 ring-white/[0.08] hover:bg-white/[0.08]"
                  }`}
      aria-label={active ? "Remove bookmark" : "Bookmark scholarship"}
    >
      <AnimatePresence mode="wait">
        {active ? (
          <motion.span
            key="filled"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0   }}
            exit={{    scale: 0, rotate: 12  }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            <BookmarkCheck size={14} className="text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{    scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
          >
            <Bookmark size={14} className="text-white/30" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple on bookmark */}
      <AnimatePresence>
        {active && (
          <motion.span
            key="ripple"
            className="absolute inset-0 rounded-xl ring-2 ring-emerald-400"
            initial={{ opacity: 0.6, scale: 1   }}
            animate={{ opacity: 0,   scale: 1.7 }}
            exit={{    opacity: 0                }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ── UrgencyBadge ──────────────────────────────────────────────
function UrgencyBadge({ deadline }: { deadline: string }) {
  const u = getUrgency(deadline)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                      rounded-lg text-[11px] font-medium ${u.ring} ${u.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${u.dot}
                        ${daysUntil(deadline) <= 7 && daysUntil(deadline) >= 0
                          ? "animate-pulse" : ""}`}
      />
      {u.label}
    </span>
  )
}

// ── FeaturedBadge ─────────────────────────────────────────────
function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                     text-[10px] font-bold tracking-wide uppercase
                     bg-amber-500/10 ring-1 ring-amber-500/25 text-amber-400">
      <Star size={9} fill="currentColor" />
      Featured
    </span>
  )
}

// ── CategoryPill ──────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  SC:       "bg-violet-500/8  text-violet-400/80  ring-violet-500/15",
  ST:       "bg-blue-500/8    text-blue-400/80    ring-blue-500/15",
  OBC:      "bg-sky-500/8     text-sky-400/80     ring-sky-500/15",
  General:  "bg-slate-500/8   text-slate-400/80   ring-slate-500/15",
  EWS:      "bg-teal-500/8    text-teal-400/80    ring-teal-500/15",
  Minority: "bg-rose-500/8    text-rose-400/80    ring-rose-500/15",
}

function CategoryPill({ cat }: { cat: string }) {
  const color = CAT_COLORS[cat] ?? "bg-white/5 text-white/40 ring-white/10"
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ring-1 ${color}`}>
      {cat}
    </span>
  )
}

// ── SkeletonCard (exported for use in grid) ───────────────────
export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-5 space-y-4">
      {/* Top row */}
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-16 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="h-4 w-3/4 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="h-3 w-1/2 rounded-full bg-white/[0.04] animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-xl bg-white/[0.04] animate-pulse" />
      </div>
      {/* Amount */}
      <div className="h-8 w-32 rounded-full bg-white/[0.06] animate-pulse" />
      {/* Pills */}
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-md bg-white/[0.04] animate-pulse" />
        <div className="h-5 w-10 rounded-md bg-white/[0.04] animate-pulse" />
      </div>
      {/* Footer */}
      <div className="flex justify-between pt-1">
        <div className="h-6 w-20 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-4 w-16 rounded-full bg-white/[0.04] animate-pulse" />
      </div>
    </div>
  )
}

// ── Main ScholarshipCard ──────────────────────────────────────
interface ScholarshipCardProps {
  scholarship:  Scholarship
  isBookmarked: boolean
  onBookmark:   (id: string) => void
  index?:       number          // for GSAP stagger
  reveal?:      boolean         // false = skip GSAP (already visible)
}

export default function ScholarshipCard({
  scholarship,
  isBookmarked,
  onBookmark,
  index   = 0,
  reveal  = true,
}: ScholarshipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const days    = daysUntil(scholarship.deadline)
  const closed  = days < 0

  // GSAP scroll reveal
  useEffect(() => {
    if (!reveal || !cardRef.current) return
    const el = cardRef.current
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: (index % 6) * 0.06,   // stagger within a row of 6
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
      }
    )
  }, [index, reveal])

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onBookmark(scholarship.id)
  }

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity: reveal ? 0 : 1 }}   // GSAP starts from 0
      whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
      className="group relative"
    >
      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.25), 0 8px 32px rgba(16,185,129,0.04)",
        }}
      />

      <Link href={`/scholarships/${scholarship.id}`} className="block">
        <div
          className={`relative rounded-2xl p-5 h-full flex flex-col gap-4
                      bg-white/[0.025] ring-1 ring-white/[0.07]
                      transition-colors duration-200
                      group-hover:bg-white/[0.035]
                      ${closed ? "opacity-60" : ""}`}
        >
          {/* ── Row 1: badges + bookmark ── */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {scholarship.is_featured && <FeaturedBadge />}
            </div>
            <BookmarkButton active={isBookmarked} onClick={handleBookmark} />
          </div>

          {/* ── Row 2: title + provider ── */}
          <div className="space-y-1 -mt-1">
            <h3 className="text-[14px] font-semibold text-white leading-snug
                           line-clamp-2 group-hover:text-emerald-50
                           transition-colors duration-200">
              {scholarship.title}
            </h3>
            <p className="text-[12px] text-white/35 truncate">
              {scholarship.provider}
            </p>
          </div>

          {/* ── Row 3: amount ── */}
          <div className="flex items-baseline gap-1">
            <IndianRupee
              size={15}
              className="text-emerald-400 flex-shrink-0 mb-0.5"
            />
            <span className="text-[28px] font-bold text-emerald-400 leading-none
                             tabular-nums tracking-tight">
              {formatAmount(scholarship.amount)}
            </span>
            <span className="text-[11px] text-white/30 ml-0.5">
              / {scholarship.amount_type}
            </span>
          </div>

          {/* ── Row 4: category + education pills ── */}
          <div className="flex flex-wrap gap-1.5">
            {scholarship.category?.slice(0, 2).map((cat) => (
              <CategoryPill key={cat} cat={cat} />
            ))}
            {scholarship.education_level?.slice(0, 1).map((lvl) => (
              <span
                key={lvl}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md
                           bg-emerald-500/8 text-emerald-400/70 ring-1 ring-emerald-500/15"
              >
                {lvl}
              </span>
            ))}
            {scholarship.state !== "All India" && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md
                               bg-blue-500/8 text-blue-400/70 ring-1 ring-blue-500/15">
                {scholarship.state}
              </span>
            )}
          </div>

          {/* ── Row 5: footer — urgency + doc count + arrow ── */}
          <div className="flex items-center justify-between mt-auto pt-3
                          border-t border-white/[0.05]">
            <div className="flex items-center gap-2">
              <UrgencyBadge deadline={scholarship.deadline} />

              {/* Document count */}
              {(scholarship.documents?.length ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px]
                                 text-white/25">
                  <FileText size={11} />
                  {scholarship.documents?.length ?? 0} docs
                </span>
              )}
            </div>

            {/* Arrow — appears on hover */}
            <motion.div
              className="flex items-center gap-1 text-[11px] font-medium
                         text-white/20"
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
              // Note: whileHover on parent triggers this via group
            >
              <span className="hidden group-hover:inline text-white/50">
                View
              </span>
              <ArrowUpRight
                size={14}
                className="opacity-0 group-hover:opacity-50
                           transition-opacity duration-200"
              />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}