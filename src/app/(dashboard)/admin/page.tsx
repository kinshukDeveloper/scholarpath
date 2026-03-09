"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/(dashboard)/admin/page.tsx
//
// Admin panel tabs:
//   1. Analytics overview    (views, signups, top scholarships)
//   2. Scholarships          (add / edit / delete)
//   3. Featured listings     (manage paid featured slots)
//   4. Users                 (table with search + role toggle)
//   5. Blog                  (post editor with preview)
//
// IMPORTANT: Protect this route with a Supabase RLS check
// for role = 'admin' in your middleware or layout.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BarChart2, GraduationCap, Star, Users,
    BookOpen, Plus, Search, Edit2, Trash2,
    Eye, TrendingUp, UserCheck,
    Save, X, CheckCircle2,
    ToggleLeft, ToggleRight, RefreshCw, Loader2,
} from "lucide-react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Scholarship, BlogPost } from "@/types"
import { createClient } from "@/lib/supabase/client"
// import { User } from "@supabase/supabase-js"

const T = {
    bg: "#020817",
    bgCard: "rgba(255,255,255,0.025)",
    bgInput: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.07)",
    text: "#f8fafc",
    textDim: "rgba(248,250,252,0.5)",
    textMuted: "rgba(248,250,252,0.25)",
    accent: "#34d399",
    accentDim: "rgba(52,211,153,0.10)",
    accentRing: "rgba(52,211,153,0.28)",
    danger: "#f87171",
    dangerDim: "rgba(248,113,113,0.10)",
}

// ── Shared UI ─────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
    return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: color + "18", color, border: `1px solid ${color}30` }}>
            {label}
        </span>
    )
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: T.textMuted }}>
                {label}
            </label>
            <input
                {...props}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none caret-emerald-400
                   transition-all focus:ring-1"
                style={{
                    background: T.bgInput,
                    border: `1px solid ${T.border}`,
                    color: T.text,
                }}
            />
        </div>
    )
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: T.textMuted }}>
                {label}
            </label>
            <textarea
                {...props}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none caret-emerald-400
                   resize-none transition-all"
                style={{
                    background: T.bgInput,
                    border: `1px solid ${T.border}`,
                    color: T.text,
                }}
            />
        </div>
    )
}

function ActionBtn({
    icon: Icon, label, variant = "default", onClick, loading = false, disabled = false,
}: {
    icon: React.ElementType; label: string
    variant?: "default" | "danger" | "accent"
    onClick?: () => void; loading?: boolean; disabled?: boolean
}) {
    const styles = {
        default: { background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim },
        danger: { background: T.dangerDim, border: `1px solid rgba(248,113,113,0.2)`, color: T.danger },
        accent: { background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent },
    }[variant]

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium
                 transition-colors disabled:opacity-40"
            style={styles}
        >
            {loading
                ? <Loader2 size={13} className="animate-spin" />
                : <Icon size={13} />
            }
            {label}
        </motion.button>
    )
}

// ─────────────────────────────────────────────────────────────
// TAB 1: ANALYTICS
// ─────────────────────────────────────────────────────────────
function AnalyticsTab() {
    const supabase = createClient()
    const [stats, setStats] = useState({ views: 0, signups: 0, bookmarks: 0, active: 0 })
    const [top, setTop] = useState<{ id: string; title: string; view_count: number | null }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const [scCount, usrCount, bkCount, topViews] = await Promise.all([
                supabase.from("scholarships").select("id", { count: "exact", head: true }).eq("is_active", true),
                supabase.from("profiles").select("id", { count: "exact", head: true }),
                supabase.from("bookmarks").select("id", { count: "exact", head: true }),
                supabase.from("scholarships").select("id, title, view_count")
                    .order("view_count", { ascending: false }).limit(5),
            ])
            setStats({
                views: topViews.data?.reduce((a, s) => a + (s.view_count ?? 0), 0) ?? 0,
                signups: usrCount.count ?? 0,
                bookmarks: bkCount.count ?? 0,
                active: scCount.count ?? 0,
            })
            setTop(topViews.data ?? [])
            setLoading(false)
        }
        load()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const STAT_CARDS = [
        { label: "Total page views", value: stats.views, icon: Eye, color: "#60a5fa" },
        { label: "Registered users", value: stats.signups, icon: UserCheck, color: T.accent },
        { label: "Total bookmarks", value: stats.bookmarks, icon: Star, color: "#f59e0b" },
        { label: "Active scholarships", value: stats.active, icon: GraduationCap, color: "#c084fc" },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <motion.div key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="rounded-2xl p-5"
                            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: s.color + "16" }}>
                                    <Icon size={15} style={{ color: s.color }} />
                                </div>
                                <p className="text-[12px]" style={{ color: T.textMuted }}>{s.label}</p>
                            </div>
                            {loading ? (
                                <div className="h-8 w-20 rounded-lg animate-pulse"
                                    style={{ background: "rgba(255,255,255,0.06)" }} />
                            ) : (
                                <p className="text-[28px] font-black tabular-nums"
                                    style={{ color: s.color }}>
                                    {s.value.toLocaleString("en-IN")}
                                </p>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Top scholarships */}
            <div className="rounded-2xl p-5"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <p className="text-[13px] font-bold mb-4 flex items-center gap-2"
                    style={{ color: T.text }}>
                    <TrendingUp size={14} style={{ color: T.accent }} />
                    Top viewed scholarships
                </p>
                <div className="space-y-2">
                    {loading ? [0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="h-4 flex-1 rounded-full"
                                style={{ background: "rgba(255,255,255,0.06)" }} />
                            <div className="h-4 w-12 rounded-full"
                                style={{ background: "rgba(255,255,255,0.04)" }} />
                        </div>
                    )) : top.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3 py-2"
                            style={{ borderBottom: i < top.length - 1 ? `1px solid ${T.border}` : "none" }}>
                            <span className="text-[12px] font-bold w-5 text-center"
                                style={{ color: T.textMuted }}>
                                {i + 1}
                            </span>
                            <p className="flex-1 text-[13px] truncate" style={{ color: T.textDim }}>
                                {s.title}
                            </p>
                            <span className="text-[12px] font-semibold flex items-center gap-1"
                                style={{ color: T.accent }}>
                                <Eye size={11} />{s.view_count ?? 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// TAB 2: SCHOLARSHIPS
// ─────────────────────────────────────────────────────────────
const BLANK_SC = {
    title: "", provider: "", amount: "", amount_type: "year",
    deadline: "", category: "", education_level: "", state: "All India",
    gender: "All", description: "", eligibility: "", apply_url: "",
    is_featured: false, is_active: true,
}
type ScholarshipRow = {
    id: string
    title: string
    provider: string
    amount: number
    deadline: string
    is_active: boolean | null
    is_featured: boolean | null

    category?: string[] | null
    education_level?: string[] | null
    description?: string | null
    eligibility?: string | null
}

function ScholarshipsTab() {
    const supabase = createClient()
    const [items, setItems] = useState<ScholarshipRow[]>([])
    const [editing, setEditing] = useState<ScholarshipRow | "new" | null>(null)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(BLANK_SC)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState("")

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500) }

    useEffect(() => { fetchItems() }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function fetchItems() {
        setLoading(true)
        const { data } = await supabase
            .from("scholarships").select("id,title,provider,amount,deadline,is_active,is_featured")
            .order("created_at", { ascending: false }).limit(50)
        setItems((data ?? []) as ScholarshipRow[])
        setLoading(false)
    }

    function openEdit(item: ScholarshipRow) {
        setEditing(item as unknown as Scholarship)

        setForm({
            ...BLANK_SC,
            ...item,
            amount: String(item.amount ?? ""),
            category: (item.category ?? []).join(", "),
            education_level: (item.education_level ?? []).join(", "),
            description: item.description ?? "",
            eligibility: item.eligibility ?? "",
            is_featured: item.is_featured ?? false,
            is_active: item.is_active ?? true
        })
    }

    function openNew() { setEditing("new"); setForm(BLANK_SC) }

    async function save() {
        setSaving(true)
        const payload = {
            ...form,
            amount: parseFloat(form.amount as string) || 0,
            category: form.category.split(",").map((s: string) => s.trim()).filter(Boolean),
            education_level: form.education_level.split(",").map((s: string) => s.trim()).filter(Boolean),
        }
        if (editing === "new") {
            await supabase.from("scholarships").insert(payload)
            showToast("Scholarship created!")
        } else {
            if (editing && typeof editing !== "string") {
                await supabase.from("scholarships")
                    .update(payload)
                    .eq("id", editing.id)
            }
            showToast("Scholarship updated!")
        }
        setSaving(false)
        setEditing(null)
        fetchItems()
    }

    async function deleteItem(id: string) {
        if (!confirm("Delete this scholarship?")) return
        await supabase.from("scholarships").delete().eq("id", id)
        setItems(prev => prev.filter(i => i.id !== id))
        showToast("Deleted.")
    }

    async function toggleActive(id: string, current: boolean) {
        await supabase.from("scholarships").update({ is_active: !current }).eq("id", id)
        setItems(prev => prev.map(i => i.id === id ? { ...i, is_active: !current } : i))
    }

    const filtered = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.provider?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-5">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5
                       rounded-xl text-[13px] font-semibold shadow-xl"
                        style={{ background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }}>
                        <CheckCircle2 size={14} />{toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top bar */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: T.textMuted }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search scholarships…"
                        className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] outline-none"
                        style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.text }} />
                </div>
                <ActionBtn icon={Plus} label="Add new" variant="accent" onClick={openNew} />
                <ActionBtn icon={RefreshCw} label="Refresh" onClick={fetchItems} />
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <table className="w-full text-[13px]">
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                            {["Title", "Provider", "Amount", "Deadline", "Status", "Actions"].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest"
                                    style={{ color: T.textMuted }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? [0, 1, 2, 3].map(i => (
                            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                                {[0, 1, 2, 3, 4, 5].map(j => (
                                    <td key={j} className="px-4 py-3">
                                        <div className="h-3 rounded-full animate-pulse"
                                            style={{ background: "rgba(255,255,255,0.06)", width: j === 0 ? "80%" : "50%" }} />
                                    </td>
                                ))}
                            </tr>
                        )) : filtered.map(item => (
                            <motion.tr key={item.id} layout
                                style={{ borderBottom: `1px solid ${T.border}` }}
                                className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-3 max-w-[220px]">
                                    <p className="truncate font-medium" style={{ color: T.text }}>{item.title}</p>
                                    {item.is_featured && <Badge label="Featured" color="#f59e0b" />}
                                </td>
                                <td className="px-4 py-3" style={{ color: T.textDim }}>{item.provider}</td>
                                <td className="px-4 py-3 font-semibold" style={{ color: T.accent }}>
                                    ₹{Number(item.amount).toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3" style={{ color: T.textDim }}>
                                    {new Date(item.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleActive(item.id, item.is_active ?? false)}
                                        className="flex items-center gap-1.5 text-[12px] font-medium transition-colors">
                                        {item.is_active
                                            ? <><ToggleRight size={16} style={{ color: T.accent }} /><span style={{ color: T.accent }}>Active</span></>
                                            : <><ToggleLeft size={16} style={{ color: T.textMuted }} /><span style={{ color: T.textMuted }}>Inactive</span></>
                                        }
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <ActionBtn icon={Edit2} label="Edit" onClick={() => openEdit(item)} />
                                        <ActionBtn icon={Trash2} label="Delete" variant="danger" onClick={() => deleteItem(item.id)} />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <p className="text-center py-10 text-[13px]" style={{ color: T.textMuted }}>
                        No scholarships found
                    </p>
                )}
            </div>

            {/* Edit / Create drawer */}
            <AnimatePresence>
                {editing && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditing(null)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 32 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto p-6 space-y-4"
                            style={{ background: "#0d1829", borderLeft: `1px solid ${T.border}` }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[16px] font-bold" style={{ color: T.text }}>
                                    {editing === "new" ? "Add new scholarship" : "Edit scholarship"}
                                </h3>
                                <button onClick={() => setEditing(null)}>
                                    <X size={18} style={{ color: T.textMuted }} />
                                </button>
                            </div>

                            <Input label="Title" value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            <Input label="Provider" value={form.provider}
                                onChange={e => setForm(f => ({ ...f, provider: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-3">
                                <Input label="Amount (₹)" type="number" value={form.amount as string}
                                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                                <Input label="Amount type" value={form.amount_type}
                                    placeholder="year / month / once"
                                    onChange={e => setForm(f => ({ ...f, amount_type: e.target.value }))} />
                            </div>
                            <Input label="Deadline" type="date" value={form.deadline}
                                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                            <Input label="Category (comma-separated)" value={form.category}
                                placeholder="SC, ST, OBC"
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
                            <Input label="Education level (comma-separated)" value={form.education_level}
                                placeholder="UG, PG"
                                onChange={e => setForm(f => ({ ...f, education_level: e.target.value }))} />
                            <Input label="State" value={form.state}
                                onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                            <Input label="Apply URL" type="url" value={form.apply_url}
                                onChange={e => setForm(f => ({ ...f, apply_url: e.target.value }))} />
                            <Textarea label="Eligibility" rows={3} value={form.eligibility}
                                onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} />
                            <Textarea label="Description" rows={3} value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

                            {/* Toggles */}
                            <div className="flex gap-4">
                                {[
                                    { key: "is_active", label: "Active" },
                                    { key: "is_featured", label: "Featured" },
                                ].map(({ key, label }) => (
                                    < button key={key}
                                        onClick={() =>
                                            setForm(f => ({
                                                ...f,
                                                [key]: !f[key as keyof typeof f] as boolean
                                            }))
                                        }
                                        className="flex items-center gap-2 text-[13px] font-medium">
                                        {form[key as keyof typeof form]
                                            ? <ToggleRight size={18} style={{ color: T.accent }} />
                                            : <ToggleLeft size={18} style={{ color: T.textMuted }} />
                                        }
                                        <span style={{ color: form[key as keyof typeof form] ? T.accent : T.textMuted }}>
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <motion.button onClick={save} disabled={saving}
                                whileTap={{ scale: 0.97 }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           text-[14px] font-bold mt-2 disabled:opacity-60"
                                style={{ background: T.accent, color: T.bg }}>
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={15} />}
                                {saving ? "Saving…" : "Save scholarship"}
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div >
    )
}

// ─────────────────────────────────────────────────────────────
// TAB 3: FEATURED LISTINGS
// ─────────────────────────────────────────────────────────────


type FeaturedListing = {
    id: string
    starts_at: string
    ends_at: string
    amount_paid: number | null
    status: string | null
    scholarships?: {
        title?: string
        provider?: string
    }
}


function FeaturedTab() {
    const supabase = createClient()
    const [items, setItems] = useState<FeaturedListing[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from("featured_listings")
            .select("*, scholarships(title, provider)")
            .order("created_at", { ascending: false })
            .then(({ data }) => { setItems(data ?? []); setLoading(false) })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function toggleStatus(id: string, active: boolean) {
        await supabase.from("featured_listings").update({ status: active ? "pending" : "active" }).eq("id", id)
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: active ? "pending" : "active" } : i))
    }

    const STATUS_COLORS: Record<string, string> = {
        active: T.accent,
        pending: "#f59e0b",
        expired: T.textMuted,
    }

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <table className="w-full text-[13px]">
                <thead>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                        {["Scholarship", "Period", "Amount Paid", "Status", "Toggle"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: T.textMuted }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? [0, 1, 2].map(i => (
                        <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                            {[0, 1, 2, 3, 4].map(j => (
                                <td key={j} className="px-4 py-3">
                                    <div className="h-3 rounded-full animate-pulse"
                                        style={{ background: "rgba(255,255,255,0.06)", width: j === 0 ? "80%" : "50%" }} />
                                </td>
                            ))}
                        </tr>
                    )) : items.map(item => {
                        const status = item.status ?? (new Date(item.ends_at) < new Date() ? "expired" : "pending")
                        return (
                            <tr key={item.id} style={{ borderBottom: `1px solid ${T.border}` }}
                                className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3">
                                    <p className="font-medium truncate max-w-[200px]" style={{ color: T.text }}>
                                        {item.scholarships?.title ?? "—"}
                                    </p>
                                    <p className="text-[11px]" style={{ color: T.textMuted }}>
                                        {item.scholarships?.provider}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-[12px]" style={{ color: T.textDim }}>
                                    {new Date(item.starts_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} –{" "}
                                    {new Date(item.ends_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </td>
                                <td className="px-4 py-3 font-semibold" style={{ color: T.accent }}>
                                    ₹{Number(item.amount_paid ?? 0).toLocaleString("en-IN")}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge label={status} color={STATUS_COLORS[status] ?? T.textMuted} />
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleStatus(item.id, item.status === "active")}>
                                        {item.status === "active"
                                            ? <ToggleRight size={20} style={{ color: T.accent }} />
                                            : <ToggleLeft size={20} style={{ color: T.textMuted }} />
                                        }
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {!loading && items.length === 0 && (
                <p className="text-center py-12 text-[13px]" style={{ color: T.textMuted }}>
                    No featured listings yet
                </p>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// TAB 4: USERS
// ─────────────────────────────────────────────────────────────

type UserRow = {
    id: string
    full_name: string | null
    email: string | null
    role: "user" | "admin" | null
    created_at: string | null
    education_level: string | null
    state: string | null
}
function UsersTab() {
    const supabase = createClient()
    const [users, setUsers] = useState<UserRow[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from("profiles")
            .select("id, full_name, email, role, created_at, education_level, state")
            .order("created_at", { ascending: false })
            .limit(100)
            .then(({ data }) => { setUsers(data ?? []); setLoading(false) })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function toggleRole(id: string, role: string) {
        const next = role === "admin" ? "user" : "admin"
        await supabase.from("profiles").update({ role: next }).eq("id", id)
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: next } : u))
    }

    const filtered = users.filter(u =>
        (u.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="relative max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: T.textMuted }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search users…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] outline-none"
                    style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.text }} />
            </div>

            <div className="rounded-2xl overflow-hidden"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <table className="w-full text-[13px]">
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                            {["Name / Email", "Education", "State", "Joined", "Role"].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest"
                                    style={{ color: T.textMuted }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? [0, 1, 2, 3, 4].map(i => (
                            <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                                {[0, 1, 2, 3, 4].map(j => (
                                    <td key={j} className="px-4 py-3">
                                        <div className="h-3 rounded-full animate-pulse"
                                            style={{ background: "rgba(255,255,255,0.06)", width: j === 0 ? "70%" : "50%" }} />
                                    </td>
                                ))}
                            </tr>
                        )) : filtered.map(user => (
                            <tr key={user.id} style={{ borderBottom: `1px solid ${T.border}` }}
                                className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3">
                                    <p className="font-medium" style={{ color: T.text }}>
                                        {user.full_name ?? "—"}
                                    </p>
                                    <p className="text-[11px]" style={{ color: T.textMuted }}>{user.email}</p>
                                </td>
                                <td className="px-4 py-3" style={{ color: T.textDim }}>
                                    {user.education_level ?? "—"}
                                </td>
                                <td className="px-4 py-3" style={{ color: T.textDim }}>
                                    {user.state ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-[12px]" style={{ color: T.textMuted }}>
                                    {new Date(user.created_at ?? "").toLocaleDateString("en-IN",
                                        { day: "numeric", month: "short", year: "numeric" })}
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleRole(user.id, user.role ?? "user")}
                                        className="flex items-center gap-1.5 text-[12px] font-medium">
                                        {user.role === "admin"
                                            ? <><Badge label="Admin" color="#c084fc" /></>
                                            : <span style={{ color: T.textMuted }}>User</span>
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <p className="text-center py-12 text-[13px]" style={{ color: T.textMuted }}>
                        No users found
                    </p>
                )}
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// TAB 5: BLOG EDITOR
// ─────────────────────────────────────────────────────────────
const BLANK_POST = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    is_published: false,

    author_name: "",
    is_featured: false,
    reading_time: 0,
    view_count: 0,
    tags: [] as string[]
}
type BlogPostRow = {
    id: string
    title: string
    slug: string
    category: string | null
    is_published: boolean | null
    published_at: string | null
}

function BlogTab() {
    const supabase = createClient()
    const [posts, setPosts] = useState<BlogPostRow[]>([])
    const [editing, setEditing] = useState<BlogPost | "new" | null>(null)
    const [form, setForm] = useState(BLANK_POST)
    const [saving, setSaving] = useState(false)
    const [preview, setPreview] = useState(false)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState("")

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500) }

    useEffect(() => {
        supabase
            .from("blog_posts")
            .select("id, title, slug, category, is_published, published_at")
            .order("created_at", { ascending: false })
            .then(({ data }) => { setPosts(data ?? []); setLoading(false) })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function openNew() {
        setEditing("new")
        setForm(BLANK_POST)
        setPreview(false)
    }

    function openEdit(post: BlogPostRow) {
  setEditing(post as unknown as BlogPost)

  setForm({
    ...BLANK_POST,

    title: post.title ?? "",
    slug: post.slug ?? "",
    category: post.category ?? "",

    excerpt: "",
    content: "",

    is_published: post.is_published ?? false,

    author_name: "",
    is_featured: false,
    reading_time: 0,
    view_count: 0,
    tags: []
  })

  setPreview(false)
}

    function autoSlug(title: string) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    }

    async function save() {
        setSaving(true)

        const payload = {
            ...form,
            slug: form.slug || autoSlug(form.title),
            published_at: form.is_published ? new Date().toISOString() : null,
        }

        if (editing === "new") {
            const { data } = await supabase
                .from("blog_posts")
                .insert(payload)
                .select()
                .single()

            if (data) setPosts(prev => [data as BlogPostRow, ...prev])
            showToast("Post created!")
        } else if (editing) {
            await supabase
                .from("blog_posts")
                .update(payload)
                .eq("id", editing.id)

            setPosts(prev =>
                prev.map(p => p.id === editing.id ? { ...p, ...payload } as BlogPostRow : p)
            )

            showToast("Post saved!")
        }

        setSaving(false)
        setEditing(null)
    }

    async function deletePost(id: string) {
        if (!confirm("Delete this post?")) return
        await supabase.from("blog_posts").delete().eq("id", id)
        setPosts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <div className="space-y-5">
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5
                       rounded-xl text-[13px] font-semibold shadow-xl"
                        style={{ background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }}>
                        <CheckCircle2 size={14} />{toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end">
                <ActionBtn icon={Plus} label="New post" variant="accent" onClick={openNew} />
            </div>

            {/* Posts list */}
            <div className="space-y-2">
                {loading ? [0, 1, 2].map(i => (
                    <div key={i} className="h-16 rounded-xl animate-pulse"
                        style={{ background: T.bgCard }} />
                )) : posts.map(post => (
                    <motion.div key={post.id} layout
                        className="flex items-center gap-4 px-4 py-3 rounded-xl"
                        style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold truncate" style={{ color: T.text }}>
                                {post.title || "Untitled"}
                            </p>
                            <div className="flex gap-2 mt-0.5">
                                <span className="text-[11px]" style={{ color: T.textMuted }}>{post.category}</span>
                                {post.is_published
                                    ? <Badge label="Published" color={T.accent} />
                                    : <Badge label="Draft" color={T.textMuted} />
                                }
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ActionBtn icon={Edit2} label="Edit" onClick={() => openEdit(post)} />
                            <ActionBtn icon={Trash2} label="Delete" variant="danger" onClick={() => deletePost(post.id)} />
                        </div>
                    </motion.div>
                ))}
                {!loading && posts.length === 0 && (
                    <p className="text-center py-10 text-[13px]" style={{ color: T.textMuted }}>
                        No posts yet — create your first one
                    </p>
                )}
            </div>

            {/* Editor drawer */}
            <AnimatePresence>
                {editing && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditing(null)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 32 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto p-6"
                            style={{ background: "#0d1829", borderLeft: `1px solid ${T.border}` }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[16px] font-bold" style={{ color: T.text }}>
                                    {editing === "new" ? "New post" : "Edit post"}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPreview(p => !p)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium"
                                        style={preview
                                            ? { background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }
                                            : { background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim }}>
                                        <Eye size={12} />{preview ? "Edit" : "Preview"}
                                    </button>
                                    <button onClick={() => setEditing(null)}>
                                        <X size={18} style={{ color: T.textMuted }} />
                                    </button>
                                </div>
                            </div>

                            {preview ? (
                                <div className="prose prose-invert max-w-none">
                                    <h1 style={{ color: T.text }}>{form.title || "Untitled"}</h1>
                                    <p style={{ color: T.textDim }}>{form.excerpt}</p>
                                    <div style={{ color: T.textDim, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                                        {form.content}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Input label="Title" value={form.title}
                                        onChange={e => setForm(f => ({
                                            ...f, title: e.target.value,
                                            slug: f.slug || autoSlug(e.target.value),
                                        }))} />
                                    <Input label="Slug (URL)" value={form.slug}
                                        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                                    <Input label="Category" value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
                                    <Textarea label="Excerpt" rows={2} value={form.excerpt}
                                        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
                                    <Textarea label="Content (Markdown)" rows={16} value={form.content}
                                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />

                                    <button onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                                        className="flex items-center gap-2 text-[13px] font-medium">
                                        {form.is_published
                                            ? <ToggleRight size={18} style={{ color: T.accent }} />
                                            : <ToggleLeft size={18} style={{ color: T.textMuted }} />
                                        }
                                        <span style={{ color: form.is_published ? T.accent : T.textMuted }}>
                                            Published
                                        </span>
                                    </button>

                                    <motion.button onClick={save} disabled={saving}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full flex items-center justify-center gap-2 py-3
                               rounded-xl text-[14px] font-bold disabled:opacity-60"
                                        style={{ background: T.accent, color: T.bg }}>
                                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                        {saving ? "Saving…" : "Save post"}
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────
// ROOT — Tab navigation
// ─────────────────────────────────────────────────────────────
const TABS = [
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "scholarships", label: "Scholarships", icon: GraduationCap },
    { id: "featured", label: "Featured", icon: Star },
    { id: "users", label: "Users", icon: Users },
    { id: "blog", label: "Blog", icon: BookOpen },
]

export default function AdminPage() {
    const [tab, setTab] = useState("analytics")

    return (
        <DashboardLayout title="Admin Panel" subtitle="Manage ScholarPath">
            {/* Tab bar */}
            <div className="flex gap-1 mb-8 flex-wrap">
                {TABS.map(t => {
                    const Icon = t.icon
                    const active = tab === t.id
                    return (
                        <motion.button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px]
                         font-semibold transition-all"
                            style={active ? {
                                background: T.accentDim,
                                border: `1px solid ${T.accentRing}`,
                                color: T.accent,
                            } : {
                                background: T.bgCard,
                                border: `1px solid ${T.border}`,
                                color: T.textMuted,
                            }}
                        >
                            <Icon size={14} />
                            {t.label}
                        </motion.button>
                    )
                })}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {tab === "analytics" && <AnalyticsTab />}
                    {tab === "scholarships" && <ScholarshipsTab />}
                    {tab === "featured" && <FeaturedTab />}
                    {tab === "users" && <UsersTab />}
                    {tab === "blog" && <BlogTab />}
                </motion.div>
            </AnimatePresence>
        </DashboardLayout>
    )
}