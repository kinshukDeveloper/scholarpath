"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/dashboard/widgets.tsx
//
// Exports 4 dashboard widgets:
//   1. UpcomingDeadlines   — saved scholarships sorted by deadline
//   2. RecentlyViewed      — last 5 viewed (localStorage)
//   3. ApplicationTracker  — kanban-style status cards
//   4. EligibilityFeed     — matched scholarships from profile
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Clock, IndianRupee, Eye, ChevronRight,
    FileText, CheckCircle2, XCircle, HelpCircle,
    Zap, GraduationCap, ArrowUpRight,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// ── Helpers ───────────────────────────────────────────────────
function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}
function fmtAmt(n: number) {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return String(n)
}

// ── Shared widget shell ───────────────────────────────────────
function Widget({
    title,
    icon: Icon,
    iconColor,
    href,
    hrefLabel,
    children,
}: {
    title: string
    icon: React.ElementType
    iconColor: string
    href?: string
    hrefLabel?: string
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.07] p-5 flex flex-col"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Icon size={14} className={iconColor} />
                    <h3 className="text-[14px] font-semibold text-white">{title}</h3>
                </div>
                {href && (
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-[11px] text-white/25
                       hover:text-emerald-400 transition-colors group"
                    >
                        {hrefLabel ?? "View all"}
                        <ChevronRight size={11}
                            className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>
            {children}
        </motion.div>
    )
}

// ── Skeleton rows ─────────────────────────────────────────────
function SkeleRows({ n = 3 }: { n?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 rounded-full bg-white/[0.06]" />
                        <div className="h-2.5 w-1/2 rounded-full bg-white/[0.04]" />
                    </div>
                    <div className="h-3 w-10 rounded-full bg-white/[0.04]" />
                </div>
            ))}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// 1. UPCOMING DEADLINES
// ─────────────────────────────────────────────────────────────
interface DeadlineItem {
    id: string; title: string; amount: number; deadline: string
}

export function UpcomingDeadlines({ userId }: { userId: string }) {
    const [items, setItems] = useState<DeadlineItem[] | null>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase
            .from("bookmarks")
            .select("scholarships(id, title, amount, deadline)")
            .eq("user_id", userId)
            .order("scholarships(deadline)", { ascending: true })
            .limit(5)
            .then(({ data }) => {
                const rows = (data ?? [])
                    .flatMap((b) => b.scholarships ?? [])
                    .filter((s) => daysUntil(s.deadline) >= 0)
                    .slice(0, 5)

                setItems(rows)
            })
    }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

    const urgencyStyle = (days: number) =>
        days <= 7 ? "text-red-400 bg-red-500/8 ring-red-500/20"
            : days <= 30 ? "text-amber-400 bg-amber-500/8 ring-amber-500/20"
                : "text-white/30"

    return (
        <Widget
            title="Upcoming Deadlines"
            icon={Clock}
            iconColor="text-amber-400"
            href="/bookmarks"
            hrefLabel="All saved"
        >
            {!items ? (
                <SkeleRows />
            ) : items.length === 0 ? (
                <p className="text-[13px] text-white/25 text-center py-6">
                    No saved scholarships with upcoming deadlines
                </p>
            ) : (
                <div className="space-y-2">
                    {items.map((item, i) => {
                        const days = daysUntil(item.deadline)
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Link
                                    href={`/scholarships/${item.id}`}
                                    className="flex items-center gap-3 p-2.5 rounded-xl
                             hover:bg-white/[0.04] transition-colors group"
                                >
                                    {/* Days badge */}
                                    <div className={`w-11 h-11 rounded-xl flex flex-col items-center
                                   justify-center flex-shrink-0 ring-1
                                   ${urgencyStyle(days)}`}>
                                        <span className="text-[14px] font-bold leading-none tabular-nums">
                                            {days}
                                        </span>
                                        <span className="text-[9px] opacity-70">days</span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-white/70 truncate
                                  group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <p className="text-[11px] text-emerald-400/60 flex items-center gap-0.5">
                                            <IndianRupee size={9} />{fmtAmt(item.amount)}
                                        </p>
                                    </div>

                                    <ChevronRight size={13}
                                        className="text-white/15 group-hover:text-white/40
                               group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </Widget>
    )
}

// ─────────────────────────────────────────────────────────────
// 2. RECENTLY VIEWED
// ─────────────────────────────────────────────────────────────
const RV_KEY = "sp-recently-viewed"

export function addToRecentlyViewed(id: string, title: string, amount: number) {
    if (typeof window === "undefined") return
    try {
        const existing: { id: string; title: string; amount: number; ts: number }[] =
            JSON.parse(localStorage.getItem(RV_KEY) ?? "[]")
        const filtered = existing.filter(i => i.id !== id)
        const updated = [{ id, title, amount, ts: Date.now() }, ...filtered].slice(0, 8)
        localStorage.setItem(RV_KEY, JSON.stringify(updated))
    } catch { }
}

export function RecentlyViewed() {
    const [items, setItems] = useState<
        { id: string; title: string; amount: number; ts: number }[]
    >([])

    useEffect(() => {
        try {
            setItems(JSON.parse(localStorage.getItem(RV_KEY) ?? "[]").slice(0, 5))
        } catch { }
    }, [])

    return (
        <Widget
            title="Recently Viewed"
            icon={Eye}
            iconColor="text-blue-400"
            href="/scholarships"
            hrefLabel="Browse all"
        >
            {items.length === 0 ? (
                <p className="text-[13px] text-white/25 text-center py-6">
                    No scholarships viewed yet
                </p>
            ) : (
                <div className="space-y-1">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/scholarships/${item.id}`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                           hover:bg-white/[0.04] transition-colors group"
                            >
                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20
                                flex items-center justify-center flex-shrink-0">
                                    <GraduationCap size={13} className="text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] text-white/60 truncate
                                group-hover:text-white/90 transition-colors">
                                        {item.title}
                                    </p>
                                </div>
                                <span className="text-[11px] text-emerald-400/50 flex-shrink-0
                                 flex items-center gap-0.5">
                                    <IndianRupee size={9} />{fmtAmt(item.amount)}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </Widget>
    )
}

// ─────────────────────────────────────────────────────────────
// 3. APPLICATION STATUS TRACKER
// ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    planning: { label: "Planning", color: "text-white/40", bg: "bg-white/[0.05]", ring: "ring-white/10", icon: HelpCircle },
    applied: { label: "Applied", color: "text-blue-400", bg: "bg-blue-500/10", ring: "ring-blue-500/20", icon: FileText },
    under_review: { label: "Under Review", color: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/20", icon: Clock },
    approved: { label: "Approved", color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", icon: CheckCircle2 },
    rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", ring: "ring-red-500/20", icon: XCircle },
}

interface AppItem {
    id: string
    status: keyof typeof STATUS_CONFIG
    scholarships: { id: string; title: string; amount: number } | null
}

export function ApplicationTracker({ userId }: { userId: string }) {
    const [items, setItems] = useState<AppItem[] | null>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase
            .from("applications")
            .select("id, status, scholarships(id, title, amount)")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .limit(6)
            .then(({ data }) => {
                const rows: AppItem[] = (data ?? [])
                    .map((row) => ({
                        id: row.id,
                        status: (row.status ?? "planning") as keyof typeof STATUS_CONFIG,
                        scholarships: Array.isArray(row.scholarships)
                            ? (row.scholarships[0] ?? null)
                            : (row.scholarships as { id: string; title: string; amount: number } | null),
                    }))
                    .filter((r) => Boolean(r.scholarships))

                setItems(rows)
            })
    }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

    async function updateStatus(
        appId: string,
        status: keyof typeof STATUS_CONFIG
    ) {
        await supabase.from("applications").update({ status }).eq("id", appId)
        setItems(prev =>
            prev?.map(a => a.id === appId ? { ...a, status } : a) ?? null
        )
    }

    return (
        <Widget
            title="Applications"
            icon={FileText}
            iconColor="text-blue-400"
            href="/applications"
            hrefLabel="Manage all"
        >
            {!items ? (
                <SkeleRows n={4} />
            ) : items.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-[13px] text-white/25 mb-3">
                        No applications tracked yet
                    </p>
                    <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium
                       text-emerald-400/70 hover:text-emerald-400 transition-colors"
                    >
                        Browse scholarships <ArrowUpRight size={12} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((app, i) => {
                        if (!app.scholarships) return null
                        const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.planning
                        const Icon = cfg.icon
                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-center gap-3 p-2.5 rounded-xl
                           bg-white/[0.02] ring-1 ring-white/[0.05]"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                 flex-shrink-0 ring-1 ${cfg.bg} ${cfg.ring}`}>
                                    <Icon size={13} className={cfg.color} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <Link href={`/scholarships/${app.scholarships.id}`}>
                                        <p className="text-[12px] font-medium text-white/65 truncate
                                  hover:text-white transition-colors">
                                            {app.scholarships.title}
                                        </p>
                                    </Link>
                                    {/* Status selector */}
                                    <select
                                        value={app.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                app.id,
                                                e.target.value as keyof typeof STATUS_CONFIG
                                            )
                                        }
                                        className="mt-0.5 bg-transparent text-[11px] outline-none
                               cursor-pointer appearance-none"
                                        style={{ color: "rgba(255,255,255,0.3)" }}
                                    >
                                        {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                                            <option key={val} value={val} style={{ background: "#0f172a" }}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </Widget>
    )
}

// ─────────────────────────────────────────────────────────────
// 4. ELIGIBILITY MATCH FEED
// ─────────────────────────────────────────────────────────────
interface MatchItem {
    id: string; title: string; amount: number; deadline: string; provider: string
}

export function EligibilityFeed({ userId }: { userId: string }) {
    const [items, setItems] = useState<MatchItem[] | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            // Fetch user profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("education_level, category, state, gender, income_annual")
                .eq("id", userId)
                .single()

            if (!profile) { setItems([]); return }

            // Build a Supabase query filtering on user attributes
            let q = supabase
                .from("scholarships")
                .select("id, title, amount, deadline, provider")
                .eq("is_active", true)
                .gte("deadline", new Date().toISOString().split("T")[0])
                .order("deadline", { ascending: true })
                .limit(5)

            if (profile.category)
                q = q.or(`category.cs.{"${profile.category}"},category.cs.{"All"}`)

            if (profile.state)
                q = q.or(`state.eq.${profile.state},state.eq.All India`)

            if (profile.income_annual)
                q = q.or(`income_max.is.null,income_max.gte.${profile.income_annual}`)

            const { data } = await q
            setItems((data as MatchItem[]) ?? [])
        }
        load()
    }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Widget
            title="Matched for You"
            icon={Zap}
            iconColor="text-emerald-400"
            href="/scholarships"
            hrefLabel="See all"
        >
            {!items ? (
                <SkeleRows />
            ) : items.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-[13px] text-white/25 mb-2">
                        Complete your profile to get matches
                    </p>
                    <Link
                        href="/settings"
                        className="text-[12px] text-emerald-400/70 hover:text-emerald-400
                       transition-colors"
                    >
                        Update profile →
                    </Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item, i) => {
                        const days = daysUntil(item.deadline)
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Link
                                    href={`/scholarships/${item.id}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             hover:bg-white/[0.04] transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10
                                  ring-1 ring-emerald-500/20 flex items-center
                                  justify-center flex-shrink-0">
                                        <Zap size={13} className="text-emerald-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] text-white/65 truncate
                                  group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-emerald-400/60
                                       flex items-center gap-0.5">
                                                <IndianRupee size={9} />{fmtAmt(item.amount)}
                                            </span>
                                            <span className="text-white/15">·</span>
                                            <span className={`text-[11px] ${days <= 7 ? "text-red-400/70"
                                                : days <= 30 ? "text-amber-400/70"
                                                    : "text-white/25"
                                                }`}>
                                                {days}d left
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={13}
                                        className="text-white/15 group-hover:text-white/40
                               group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </Widget>
    )
}