"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/reminders/RemindersPage.tsx
//
// Reminders management page:
//   ✦ List all active reminders (sorted by remind_at)
//   ✦ Channel badge (email / whatsapp / sms)
//   ✦ Sent / unsent status
//   ✦ Delete reminder
//   ✦ Empty state with CTA to browse scholarships
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bell, BellOff, Mail, MessageCircle, Smartphone,
    Trash2, ArrowRight, Clock, CheckCircle2,
    IndianRupee,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { createClient } from "@/lib/supabase/client"

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

const CHANNEL_CONFIG = {
    email: { icon: Mail, color: "#60a5fa", label: "Email" },
    whatsapp: { icon: MessageCircle, color: "#34d399", label: "WhatsApp" },
    sms: { icon: Smartphone, color: "#f59e0b", label: "SMS" },
}

function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}
function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
}
function fmtAmt(n: number) {
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return String(n)
}

interface ReminderItem {
    id: string
    remind_at: string
    channel: "email" | "whatsapp" | "sms"
    sent: boolean | null
    scholarships: {
        id: string
        title: string
        amount: number
        deadline: string
        provider: string
    } | null
}
function SkeletonRow() {
    return (
        <div className="rounded-2xl p-5 animate-pulse"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-5 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-3 w-1/3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="w-8 h-8 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    )
}

export default function RemindersPage() {
    const [items, setItems] = useState<ReminderItem[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<"upcoming" | "sent">("upcoming")
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) { router.push("/login"); return }

            supabase
                .from("reminders")
                .select("id, remind_at, channel, sent, scholarships(id, title, amount, deadline, provider)")
                .eq("user_id", user.id)
                .order("remind_at", { ascending: true })
                .then(({ data }) => {
                    const rows: ReminderItem[] = (data ?? []).map((r) => ({
                        id: r.id,
                        remind_at: r.remind_at,
                        channel: r.channel as ReminderItem["channel"],
                        sent: r.sent ?? false,
                        scholarships: Array.isArray(r.scholarships)
                            ? (r.scholarships[0] ?? null)
                            : (r.scholarships as ReminderItem["scholarships"]),
                    }))

                    setItems(rows)
                    setLoading(false)
                })
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function deleteReminder(id: string) {
        await supabase.from("reminders").delete().eq("id", id)
        setItems(prev => prev.filter(r => r.id !== id))
    }

    const filtered = items.filter(r => tab === "sent" ? r.sent : !r.sent)

    const upcomingCount = items.filter(r => !r.sent).length
    const sentCount = items.filter(r => r.sent).length
    const TABS: { id: "upcoming" | "sent"; label: string; count: number }[] = [
        { id: "upcoming", label: "Upcoming", count: upcomingCount },
        { id: "sent", label: "Sent", count: sentCount },
    ]

    return (
        <AppLayout noPad>
            <div style={{ background: T.bg, minHeight: "100vh" }}>
                <div className="max-w-3xl mx-auto px-5 pt-24 pb-16">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                                <Bell size={18} style={{ color: T.accent }} />
                            </div>
                            <div>
                                <h1 className="text-[24px] font-black tracking-tight" style={{ color: T.text }}>
                                    Reminders
                                </h1>
                                <p className="text-[13px]" style={{ color: T.textMuted }}>
                                    {loading ? "Loading…" : `${upcomingCount} upcoming`}
                                </p>
                            </div>
                        </div>
                        <Link href="/scholarships"
                            className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold
                         px-4 py-2 rounded-xl transition-colors"
                            style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim }}>
                            + Add reminder
                        </Link>
                    </div>

                    {/* Info callout */}
                    <div className="rounded-2xl p-4 mb-6 flex items-start gap-3"
                        style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                        <Bell size={14} className="flex-shrink-0 mt-0.5" style={{ color: T.accent }} />
                        <p className="text-[13px] leading-relaxed" style={{ color: T.accent }}>
                            Reminders are sent <strong>7 days before each scholarship deadline</strong> via your chosen channel.
                            Set reminders from any scholarship detail page.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {TABS.map(t => (
                            <motion.button key={t.id}
                                onClick={() => setTab(t.id)}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                           text-[13px] font-semibold transition-all"
                                style={tab === t.id ? {
                                    background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent,
                                } : {
                                    background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted,
                                }}>
                                {t.label}
                                {t.count > 0 && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                        style={{
                                            background: tab === t.id ? T.accent : "rgba(255,255,255,0.08)",
                                            color: tab === t.id ? T.bg : T.textMuted,
                                        }}>
                                        {t.count}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        {loading && [0, 1, 2].map(i => <SkeletonRow key={i} />)}

                        {!loading && filtered.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-20 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                                    {tab === "sent"
                                        ? <CheckCircle2 size={24} style={{ color: T.textMuted }} />
                                        : <BellOff size={24} style={{ color: T.textMuted }} />
                                    }
                                </div>
                                <div>
                                    <p className="text-[16px] font-semibold mb-1" style={{ color: T.textDim }}>
                                        {tab === "sent" ? "No reminders sent yet" : "No upcoming reminders"}
                                    </p>
                                    <p className="text-[13px]" style={{ color: T.textMuted }}>
                                        {tab === "upcoming"
                                            ? "Open any scholarship and tap 'Set Reminder' to get notified before the deadline."
                                            : "Sent reminders will appear here."}
                                    </p>
                                </div>
                                {tab === "upcoming" && (
                                    <Link href="/scholarships"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold"
                                        style={{ background: T.accent, color: T.bg }}>
                                        Browse scholarships <ArrowRight size={14} />
                                    </Link>
                                )}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {filtered.map((r, i) => {
                                const s = r.scholarships
                                const cfg = CHANNEL_CONFIG[r.channel] ?? CHANNEL_CONFIG.email
                                const Icon = cfg.icon
                                const deadlineDays = s ? daysUntil(s.deadline) : null

                                return (
                                    <motion.div key={r.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                        transition={{ delay: i * 0.05 }}
                                        className="rounded-2xl p-5"
                                        style={{
                                            background: T.bgCard,
                                            border: `1px solid ${r.sent ? "rgba(255,255,255,0.04)" : T.border}`,
                                            opacity: r.sent ? 0.6 : 1,
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {/* Channel icon */}
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background: cfg.color + "14", border: `1px solid ${cfg.color}28` }}>
                                                    <Icon size={15} style={{ color: cfg.color }} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* Scholarship title */}
                                                    {s ? (
                                                        <Link href={`/scholarships/${s.id}`}
                                                            className="text-[14px] font-semibold hover:underline leading-snug line-clamp-1"
                                                            style={{ color: T.text }}>
                                                            {s.title}
                                                        </Link>
                                                    ) : (
                                                        <p className="text-[14px] font-semibold" style={{ color: T.textDim }}>
                                                            Scholarship removed
                                                        </p>
                                                    )}

                                                    {/* Amount + provider */}
                                                    {s && (
                                                        <p className="text-[12px] mt-0.5 flex items-center gap-1"
                                                            style={{ color: T.textMuted }}>
                                                            <IndianRupee size={10} />{fmtAmt(s.amount)} · {s.provider}
                                                        </p>
                                                    )}

                                                    {/* Reminder time row */}
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        {/* Channel badge */}
                                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                                                            style={{ background: cfg.color + "12", color: cfg.color }}>
                                                            {cfg.label}
                                                        </span>

                                                        {/* Remind at */}
                                                        <span className="flex items-center gap-1 text-[11px]"
                                                            style={{ color: T.textMuted }}>
                                                            <Clock size={10} />
                                                            {fmtDate(r.remind_at)}
                                                        </span>

                                                        {/* Sent badge */}
                                                        {r.sent && (
                                                            <span className="flex items-center gap-1 text-[11px] font-medium"
                                                                style={{ color: T.accent }}>
                                                                <CheckCircle2 size={11} /> Sent
                                                            </span>
                                                        )}

                                                        {/* Deadline days */}
                                                        {deadlineDays !== null && !r.sent && (
                                                            <span className="text-[11px]"
                                                                style={{
                                                                    color: deadlineDays <= 7 ? "#f87171"
                                                                        : deadlineDays <= 30 ? "#fbbf24"
                                                                            : T.textMuted,
                                                                }}>
                                                                Deadline in {deadlineDays}d
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delete */}
                                            <motion.button
                                                onClick={() => deleteReminder(r.id)}
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.90 }}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center
                                   flex-shrink-0 transition-colors"
                                                style={{
                                                    background: "rgba(248,113,113,0.08)",
                                                    border: "1px solid rgba(248,113,113,0.18)"
                                                }}>
                                                <Trash2 size={13} style={{ color: "#f87171" }} />
                                            </motion.button>
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