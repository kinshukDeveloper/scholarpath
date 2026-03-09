"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/dashboard/StatsRow.tsx
//
// Animated stat cards: saved, applied, upcoming deadlines.
// Numbers count up on mount with GSAP.
// Each card has an icon, label, delta indicator.
//
// USAGE:
//   <StatsRow userId={user.id} />
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Bookmark, FileText, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────
interface Stat {
  label:    string
  value:    number
  icon:     React.ElementType
  color:    string        // tailwind text color
  bg:       string        // tailwind bg color
  ring:     string        // tailwind ring color
  suffix?:  string
}

// ── Count-up hook ─────────────────────────────────────────────
function useCountUp(target: number, duration = 1.2, delay = 0) {
  const ref   = useRef<HTMLSpanElement>(null)
  const proxy = useRef({ val: 0 })

  useEffect(() => {
    if (!ref.current || target === 0) return
    gsap.to(proxy.current, {
      val: target,
      duration,
      delay,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current)
          ref.current.textContent = Math.round(proxy.current.val).toString()
      },
    })
  }, [target, duration, delay])

  return ref
}

// ── Single stat card ──────────────────────────────────────────
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const countRef = useCountUp(stat.value, 1.1, index * 0.12)
  const Icon     = stat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-5
                 flex items-center gap-4 group hover:bg-white/[0.035]
                 transition-colors duration-200"
    >
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                       flex-shrink-0 ${stat.bg} ring-1 ${stat.ring}`}>
        <Icon size={18} className={stat.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-white/35 font-medium mb-0.5">{stat.label}</p>
        <div className="flex items-baseline gap-1">
          <span
            ref={countRef}
            className={`text-[26px] font-bold tabular-nums leading-none ${stat.color}`}
          >
            {stat.value === 0 ? "0" : ""}
          </span>
          {stat.suffix && (
            <span className="text-[12px] text-white/30">{stat.suffix}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-5
                    flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-white/[0.06] animate-pulse flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-20 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="h-6 w-12 rounded-full bg-white/[0.06] animate-pulse" />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
interface StatsRowProps {
  userId: string
}

export default function StatsRow({ userId }: StatsRowProps) {
  const [stats,   setStats]   = useState<Stat[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [bookmarks, applications, reminders] = await Promise.all([
        supabase
          .from("bookmarks")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),

        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),

        supabase
          .from("reminders")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("sent", false)
          .gte("remind_at", new Date().toISOString())
          .lte("remind_at", new Date(Date.now() + 30 * 864e5).toISOString()),
      ])

      setStats([
        {
          label:  "Saved Scholarships",
          value:  bookmarks.count  ?? 0,
          icon:   Bookmark,
          color:  "text-emerald-400",
          bg:     "bg-emerald-500/10",
          ring:   "ring-emerald-500/20",
        },
        {
          label:  "Applications Tracked",
          value:  applications.count ?? 0,
          icon:   FileText,
          color:  "text-blue-400",
          bg:     "bg-blue-500/10",
          ring:   "ring-blue-500/20",
        },
        {
          label:   "Deadlines This Month",
          value:   reminders.count ?? 0,
          icon:    Clock,
          color:   "text-amber-400",
          bg:      "bg-amber-500/10",
          ring:    "ring-amber-500/20",
          suffix:  reminders.count === 1 ? "reminder" : "reminders",
        },
      ])
    }
    load()
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => <StatSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
    </div>
  )
}