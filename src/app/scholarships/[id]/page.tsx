"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/scholarships/[id]/page.tsx
//
// Composes all detail components into the final page.
// Data fetching here — components receive props, stay pure.
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ArrowLeft, IndianRupee, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import AppLayout from "@/components/layout/AppLayout"
import DeadlineRing from "@/components/detail/DeadlineRing"
import DocumentChecklist from "@/components/detail/DocumentChecklist"
import ApplyCTA from "@/components/detail/ApplyCTA"
import EligibilitySection from "@/components/detail/EligibilitySection"
import RelatedScholarships from "@/components/detail/RelatedScholarships"
import ShareButton from "@/components/detail/ShareButton"
import { ScholarshipJsonLd } from "@/lib/seo/ScholarshipJsonLd"
import type { Scholarship } from "@/types"


// ── Skeleton ──────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <AppLayout noPad>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-pulse">
        <div className="h-4 w-24 rounded-full bg-white/[0.06]" />
        <div className="h-8 w-2/3 rounded-xl bg-white/[0.06]" />
        <div className="h-4 w-1/3 rounded-full bg-white/[0.04]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 rounded-2xl bg-white/[0.04]" />
            <div className="h-48 rounded-2xl bg-white/[0.04]" />
            <div className="h-56 rounded-2xl bg-white/[0.04]" />
          </div>
          <div className="space-y-4">
            <div className="h-52 rounded-2xl bg-white/[0.04]" />
            <div className="h-36 rounded-2xl bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function ScholarshipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Fetch + increment view count
  useEffect(() => {
    supabase
      .from("scholarships")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setLoading(false); return }
        setScholarship(data)
        setLoading(false)
        // Increment view count (fire and forget)
        supabase.from("scholarships")
          .update({ view_count: (data.view_count ?? 0) + 1 })
          .eq("id", id)
      })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // GSAP hero stagger on load
  useEffect(() => {
    if (!heroRef.current || loading) return
    gsap.fromTo(
      heroRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: "power3.out" }
    )
  }, [loading])

  if (loading) return <PageSkeleton />
  if (notFound || !scholarship) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-[16px] font-semibold text-white/50 mb-2">
          Scholarship not found
        </p>
        <p className="text-[13px] text-white/25 mb-6">
          It may have been removed or the link is incorrect.
        </p>
        <Link href="/scholarships"
          className="text-[13px] text-emerald-400 hover:text-emerald-300 transition-colors">
          ← Browse all scholarships
        </Link>
      </div>
    </AppLayout>
  )

  return (
    <>
      <ScholarshipJsonLd scholarship={scholarship} />
      <AppLayout noPad>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* ── Hero ── */}
          <div ref={heroRef}>

            {/* Back + share row */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-[13px] text-white/35
                         hover:text-white/70 transition-colors group"
                whileHover={{ x: -2 }}
              >
                <ArrowLeft size={15}
                  className="group-hover:-translate-x-0.5 transition-transform" />
                All Scholarships
              </motion.button>

              <ShareButton compact />
            </div>

            {/* Provider chip */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-medium px-3 py-1 rounded-full
                             bg-white/[0.04] ring-1 ring-white/[0.08] text-white/40">
                {scholarship.provider}
              </span>
              {scholarship.is_featured && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full
                               bg-amber-500/10 ring-1 ring-amber-500/25 text-amber-400
                               uppercase tracking-wide">
                  ★ Featured
                </span>
              )}
              <span className="text-[11px] text-white/20 flex items-center gap-1">
                <Eye size={11} />
                {scholarship.view_count ?? 0} views
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug
                         tracking-tight mb-4 max-w-2xl">
              {scholarship.title}
            </h1>

            {/* Amount + deadline ring row */}
            <div className="flex flex-wrap items-center gap-8 mb-2">
              <div>
                <p className="text-[11px] font-medium text-white/25 uppercase
                            tracking-widest mb-1">
                  Scholarship Amount
                </p>
                <div className="flex items-baseline gap-1">
                  <IndianRupee size={20} className="text-emerald-400 mb-0.5" />
                  <span className="text-[40px] font-bold text-emerald-400
                                 leading-none tabular-nums tracking-tight">
                    {scholarship.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[13px] text-white/30 ml-1">
                    / {scholarship.amount_type}
                  </span>
                </div>
              </div>

              <DeadlineRing deadline={scholarship.deadline} />
            </div>

            {/* About */}
            {scholarship.description && (
              <p className="text-[14px] text-white/45 leading-relaxed max-w-2xl mt-4
                          border-t border-white/[0.06] pt-5">
                {scholarship.description}
              </p>
            )}
          </div>

          {/* ── Body grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            {/* Left: main content */}
            <div className="lg:col-span-2 space-y-5">
              <EligibilitySection scholarship={scholarship} />
              <DocumentChecklist
                scholarshipId={scholarship.id}
                documents={scholarship.documents ?? []}
              />
            </div>

            {/* Right: sticky sidebar */}
            <div className="space-y-5">
              <ApplyCTA scholarship={scholarship} />
              <RelatedScholarships
                currentId={scholarship.id}
                categories={scholarship.category}
              />
            </div>
          </div>

        </div>
      </AppLayout>
    </>
  )
}