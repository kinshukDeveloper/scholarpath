"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/RelatedScholarships.tsx
//
// Fetches up to 3 scholarships sharing the same category.
// Renders as compact list rows with amount + deadline.
// Shows skeleton while loading, nothing if no results.
//
// USAGE:
//   <RelatedScholarships
//     currentId={scholarship.id}
//     categories={scholarship.category}
//   />
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, IndianRupee, Layers } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// ── Types ─────────────────────────────────────────────────────
interface RelatedItem {
  id:        string
  title:     string
  provider:  string
  amount:    number
  deadline:  string
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}

function formatAmt(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `${(n / 1000).toFixed(0)}K`
  return String(n)
}

// ── Skeleton row ──────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-3/4 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="h-2.5 w-1/2 rounded-full bg-white/[0.04] animate-pulse" />
      </div>
      <div className="h-3 w-10 rounded-full bg-white/[0.04] animate-pulse" />
    </div>
  )
}

// ── Related row ───────────────────────────────────────────────
function RelatedRow({ item, index }: { item: RelatedItem; index: number }) {
  const days   = daysUntil(item.deadline)
  const urgent = days >= 0 && days <= 30

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0  }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      <Link
        href={`/scholarships/${item.id}`}
        className="flex items-center gap-3 py-3 group"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-white/70 truncate
                        group-hover:text-white transition-colors duration-150">
            {item.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-emerald-400/70 flex items-center gap-0.5">
              <IndianRupee size={9} />
              {formatAmt(item.amount)}
            </span>
            <span className="text-white/15">·</span>
            <span
              className={`text-[11px] ${urgent ? "text-amber-400/70" : "text-white/25"}`}
            >
              {days < 0 ? "Closed" : `${days}d left`}
            </span>
          </div>
        </div>
        <ChevronRight
          size={14}
          className="text-white/15 group-hover:text-white/40
                     group-hover:translate-x-0.5 transition-all duration-150
                     flex-shrink-0"
        />
      </Link>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────
interface RelatedScholarshipsProps {
  currentId:  string
  categories: string[] | null
}

export default function RelatedScholarships({
  currentId,
  categories,
}: RelatedScholarshipsProps) {
  const [items,   setItems]   = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!categories?.length) { setLoading(false); return }

    supabase
      .from("scholarships")
      .select("id, title, provider, amount, deadline")
      .overlaps("category", categories ?? [])
      .neq("id", currentId)
      .eq("is_active", true)
      .order("deadline", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        setItems(data ?? [])
        setLoading(false)
      })
  }, [currentId, categories]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && items.length === 0) return null

  return (
    <div className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-6">

      <div className="flex items-center gap-2 mb-1">
        <Layers size={14} className="text-emerald-400" />
        <h3 className="text-[14px] font-semibold text-white">
          Similar Scholarships
        </h3>
      </div>

      <div className="divide-y divide-white/[0.05] mt-2">
        {loading
          ? [0, 1, 2].map((i) => <SkeletonRow key={i} />)
          : items.map((item, i) => (
              <RelatedRow key={item.id} item={item} index={i} />
            ))
        }
      </div>

      <Link
        href={`/scholarships?category=${categories?.[0] ?? ""}`}
        className="flex items-center gap-1.5 mt-4 text-[12px] text-white/25
                   hover:text-emerald-400 transition-colors group"
      >
        View all similar
        <ChevronRight size={12}
          className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}