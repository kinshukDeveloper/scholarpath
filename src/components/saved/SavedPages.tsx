"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/saved/SavedPage.tsx
//
// Saved / bookmarked scholarships page:
//   ✦ Tabs: All / Open / Closing Soon / Closed
//   ✦ Inline remove bookmark
//   ✦ Empty state with CTA
//   ✦ Redirects to /login if unauthenticated
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bookmark, BookmarkX, IndianRupee, Clock,
    ArrowRight, GraduationCap, ExternalLink,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { createClient } from "@/lib/supabase/client"
import type { Scholarship } from "@/types"

const T = {
    bg: "#020817",
    bgAlt: "rgba(255,255,255,0.018)",
    bgCard: "rgba(255,255,255,0.028)",
    border: "rgba(255,255,255,0.07)",
    text: "#f8fafc",
    textDim: "rgba(248,250,252,0.5)",
    textMuted: "rgba(248,250,252,0.25)",
    accent: "#34d399",
    accentDim: "rgba(52,211,153,0.10)",
    accentRing: "rgba(52,211,153,0.28)",
}

function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}
function fmtAmt(n: number) {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return String(n)
}

const TABS = [
    { id: "all", label: "All" },
    { id: "open", label: "Open" },
    { id: "urgent", label: "Closing Soon" },
    { id: "closed", label: "Closed" },
]

interface SavedItem {
    scholarship_id: string
    scholarships: Scholarship | null
}

function SkeletonRow() {
    return (
        <div className="rounded-2xl p-5 animate-pulse"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-5 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-3 w-1/3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="h-8 w-24 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    )
}

export default function SavedPage() {
    const [items, setItems] = useState<Scholarship[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState("all")
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push("/login"); return }

            supabase
                .from("bookmarks")
                .select("scholarship_id, scholarships(*)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .then(({ data }) => {
                    const rows = (data ?? [])
                        .map((b: SavedItem) => b.scholarships)
                        .filter((s): s is Scholarship => s !== null)

                    setItems(rows)
                    setLoading(false)
                })
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function removeBookmark(id: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from("bookmarks").delete()
            .match({ user_id: user.id, scholarship_id: id })
        setItems(prev => prev.filter(s => s.id !== id))
    }

    const filtered = items.filter(s => {
        const days = daysUntil(s.deadline)
        if (tab === "open") return days > 30
        if (tab === "urgent") return days >= 0 && days <= 30
        if (tab === "closed") return days < 0
        return true
    })

    const counts = {
        all: items.length,
        open: items.filter(s => daysUntil(s.deadline) > 30).length,
        urgent: items.filter(s => { const d = daysUntil(s.deadline); return d >= 0 && d <= 30 }).length,
        closed: items.filter(s => daysUntil(s.deadline) < 0).length,
    }

    return (
        <AppLayout noPad>
            <div style={{ background: T.bg, minHeight: "100vh" }}>
                <div className="max-w-3xl mx-auto px-5 pt-24 pb-16">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                            <Bookmark size={18} style={{ color: T.accent }} />
                        </div>
                        <div>
                            <h1 className="text-[24px] font-black tracking-tight" style={{ color: T.text }}>
                                Saved Scholarships
                            </h1>
                            <p className="text-[13px]" style={{ color: T.textMuted }}>
                                {loading ? "Loading…" : `${items.length} saved`}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {TABS.map(t => {
                            const count = counts[t.id as keyof typeof counts]
                            return (
                                <motion.button key={t.id} onClick={() => setTab(t.id)}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                             text-[12px] font-semibold transition-all"
                                    style={tab === t.id ? {
                                        background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent,
                                    } : {
                                        background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted,
                                    }}>
                                    {t.label}
                                    {count > 0 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                            style={{
                                                background: tab === t.id ? T.accent : "rgba(255,255,255,0.08)",
                                                color: tab === t.id ? T.bg : T.textMuted,
                                            }}>
                                            {count}
                                        </span>
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {loading && [0, 1, 2, 3].map(i => <SkeletonRow key={i} />)}

                        {!loading && filtered.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-20 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                                    <GraduationCap size={24} style={{ color: T.textMuted }} />
                                </div>
                                <div>
                                    <p className="text-[16px] font-semibold mb-1" style={{ color: T.textDim }}>
                                        {tab === "all" ? "No saved scholarships yet" : `No ${tab} scholarships`}
                                    </p>
                                    <p className="text-[13px]" style={{ color: T.textMuted }}>
                                        {tab === "all" ? "Browse and bookmark scholarships to see them here." : "Try a different tab."}
                                    </p>
                                </div>
                                {tab === "all" && (
                                    <Link href="/scholarships"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold"
                                        style={{ background: T.accent, color: T.bg }}>
                                        Browse scholarships <ArrowRight size={14} />
                                    </Link>
                                )}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {filtered.map((s, i) => {
                                const days = daysUntil(s.deadline)
                                const urgColor = days < 0 ? T.textMuted
                                    : days <= 7 ? "#f87171"
                                        : days <= 30 ? "#fbbf24"
                                            : T.accent
                                return (
                                    <motion.div key={s.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                        transition={{ delay: i * 0.05 }}
                                        className="rounded-2xl p-5"
                                        style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {/* Provider */}
                                                <p className="text-[11px] mb-1" style={{ color: T.textMuted }}>
                                                    {s.provider}
                                                </p>
                                                {/* Title */}
                                                <Link href={`/scholarships/${s.id}`}
                                                    className="text-[15px] font-bold leading-snug hover:underline"
                                                    style={{ color: T.text }}>
                                                    {s.title}
                                                </Link>
                                                {/* Amount + deadline */}
                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                    <span className="flex items-center gap-0.5 text-[13px] font-semibold"
                                                        style={{ color: T.accent }}>
                                                        <IndianRupee size={12} />{fmtAmt(s.amount)}
                                                        <span className="text-[11px] font-normal ml-0.5"
                                                            style={{ color: T.textMuted }}>
                                                            /{s.amount_type}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[12px] font-medium"
                                                        style={{ color: urgColor }}>
                                                        <Clock size={11} />
                                                        {days < 0 ? "Closed" : `${days}d left`}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {days >= 0 && s.apply_url && (
                                                    <a href={s.apply_url} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                                       text-[12px] font-bold transition-colors"
                                                        style={{ background: T.accent, color: T.bg }}>
                                                        Apply <ExternalLink size={11} />
                                                    </a>
                                                )}
                                                <motion.button
                                                    onClick={() => removeBookmark(s.id)}
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.90 }}
                                                    title="Remove bookmark"
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center
                                     transition-colors"
                                                    style={{
                                                        background: "rgba(248,113,113,0.08)",
                                                        border: "1px solid rgba(248,113,113,0.18)"
                                                    }}>
                                                    <BookmarkX size={14} style={{ color: "#f87171" }} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}