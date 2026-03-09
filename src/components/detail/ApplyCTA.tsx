"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/ApplyCTA.tsx
//
// Sticky sidebar card with:
//   ✦ Apply Now button (external link)
//   ✦ Set Reminder toggle (saves to Supabase reminders table)
//   ✦ Bookmark toggle
//   ✦ Urgent warning when ≤7 days left
//   ✦ Redirects unauthenticated users to /login
//
// USAGE:
//   <ApplyCTA scholarship={scholarship} />
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ExternalLink, Bell, BellOff, Bookmark, BookmarkCheck,
    AlertTriangle, CheckCircle2, Lock,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Scholarship } from "@/types"
import { User } from "@supabase/supabase-js"

function daysUntil(d: string) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}

// ── Component ─────────────────────────────────────────────────
interface ApplyCTAProps {
    scholarship: Scholarship
}

export default function ApplyCTA({ scholarship }: ApplyCTAProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isReminded, setIsReminded] = useState(false)
    const [remLoading, setRemLoading] = useState(false)
    const [bookLoading, setBookLoading] = useState(false)
    const [toast, setToast] = useState("")

    const router = useRouter()
    const supabase = createClient()
    const days = daysUntil(scholarship.deadline)
    const closed = days < 0

    // Auth + existing bookmark/reminder state
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            if (!user) return

            // Check bookmark
            supabase.from("bookmarks")
                .select("id").match({ user_id: user.id, scholarship_id: scholarship.id })
                .maybeSingle()
                .then(({ data }) => setIsBookmarked(!!data))

            // Check reminder
            supabase.from("reminders")
                .select("id").match({ user_id: user.id, scholarship_id: scholarship.id })
                .maybeSingle()
                .then(({ data }) => setIsReminded(!!data))
        })
    }, [scholarship.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function showToast(msg: string) {
        setToast(msg)
        setTimeout(() => setToast(""), 2500)
    }

    // ── Bookmark toggle ────────────────────────────────────────
    async function toggleBookmark() {
        if (!user) { router.push("/login"); return }
        setBookLoading(true)

        if (isBookmarked) {
            await supabase.from("bookmarks")
                .delete().match({ user_id: user.id, scholarship_id: scholarship.id })
            setIsBookmarked(false)
            showToast("Removed from saved")
        } else {
            await supabase.from("bookmarks")
                .insert({ user_id: user.id, scholarship_id: scholarship.id })
            setIsBookmarked(true)
            showToast("Saved!")
        }
        setBookLoading(false)
    }

    // ── Reminder toggle ────────────────────────────────────────
    async function toggleReminder() {
        if (!user) { router.push("/login"); return }
        setRemLoading(true)

        if (isReminded) {
            await supabase.from("reminders")
                .delete().match({ user_id: user.id, scholarship_id: scholarship.id })
            setIsReminded(false)
            showToast("Reminder removed")
        } else {
            // Set reminder 7 days before deadline
            const remindAt = new Date(scholarship.deadline)
            remindAt.setDate(remindAt.getDate() - 7)

            await supabase.from("reminders").insert({
                user_id: user.id,
                scholarship_id: scholarship.id,
                remind_at: remindAt.toISOString(),
                channel: "email",
            })
            setIsReminded(true)
            showToast("Reminder set — we'll email you 7 days before deadline")
        }
        setRemLoading(false)
    }

    return (
        <div className="sticky top-24 space-y-3">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                       bg-emerald-500/10 ring-1 ring-emerald-500/25
                       text-[12px] font-medium text-emerald-400"
                    >
                        <CheckCircle2 size={13} />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main CTA card */}
            <div className="rounded-2xl bg-emerald-500/[0.04] ring-1 ring-emerald-500/15 p-5 space-y-3">

                {/* Urgent warning */}
                <AnimatePresence>
                    {days > 0 && days <= 7 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-2.5 rounded-xl px-3 py-2.5
                         bg-red-500/8 ring-1 ring-red-500/20 overflow-hidden"
                        >
                            <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                            <div>
                                <p className="text-[12px] font-semibold text-red-400">
                                    Only {days} day{days !== 1 ? "s" : ""} left!
                                </p>
                                <p className="text-[11px] text-red-400/60 mt-0.5">
                                    Start your application immediately.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Apply Now */}
                {!closed ? (
                    <motion.a
                        href={scholarship.apply_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-2 w-full py-3.5
                       rounded-xl bg-emerald-500 text-slate-950 text-[14px]
                       font-bold shadow-lg shadow-emerald-900/30
                       hover:bg-emerald-400 transition-colors"
                    >
                        Apply Now
                        <ExternalLink size={14} />
                    </motion.a>
                ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-3.5
                          rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]
                          text-[14px] font-semibold text-white/25 cursor-not-allowed">
                        <Lock size={14} />
                        Deadline Passed
                    </div>
                )}

                {/* Set Reminder */}
                <motion.button
                    onClick={toggleReminder}
                    disabled={remLoading || closed}
                    whileHover={!closed ? { scale: 1.01 } : {}}
                    whileTap={!closed ? { scale: 0.97 } : {}}
                    className={`w-full flex items-center justify-center gap-2 py-3
                      rounded-xl text-[13px] font-medium transition-all
                      disabled:opacity-40 disabled:cursor-not-allowed
                      ${isReminded
                            ? "bg-amber-500/10 ring-1 ring-amber-500/25 text-amber-400"
                            : "bg-white/[0.04] ring-1 ring-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.07]"
                        }`}
                >
                    {remLoading ? (
                        <motion.span
                            className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                        />
                    ) : isReminded ? (
                        <><BellOff size={14} /> Remove Reminder</>
                    ) : (
                        <><Bell size={14} /> Set Reminder</>
                    )}
                </motion.button>

                {/* Reminder hint */}
                <AnimatePresence>
                    {isReminded && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] text-amber-400/50 text-center"
                        >
                            We&apos;ll email you 7 days before the deadline
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Bookmark + auth hint */}
            <motion.button
                onClick={toggleBookmark}
                disabled={bookLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 py-2.5
                    rounded-xl text-[13px] font-medium transition-all
                    ${isBookmarked
                        ? "bg-emerald-500/10 ring-1 ring-emerald-500/25 text-emerald-400"
                        : "bg-white/[0.04] ring-1 ring-white/[0.08] text-white/40 hover:text-white/70"
                    }`}
            >
                {isBookmarked
                    ? <><BookmarkCheck size={14} /> Saved</>
                    : <><Bookmark size={14} /> Save scholarship</>
                }
            </motion.button>

            {!user && (
                <p className="text-center text-[11px] text-white/20">
                    <a href="/login" className="text-emerald-400/70 hover:text-emerald-400 transition-colors">
                        Sign in
                    </a>{" "}
                    to save and set reminders
                </p>
            )}
        </div>
    )
}