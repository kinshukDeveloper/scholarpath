"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/ShareButton.tsx
//
// Copies current URL to clipboard.
// Shows animated toast on success.
// Falls back to Web Share API on mobile if available.
//
// USAGE:
//   <ShareButton title={scholarship.title} />
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Check, Copy } from "lucide-react"

interface ShareButtonProps {
    title?: string       // used in Web Share API
    compact?: boolean      // icon-only mode
    className?: string
}

export default function ShareButton({
    title = "Check out this scholarship on ScholarPath",
    compact = false,
    className = "",
}: ShareButtonProps) {
    const [state, setState] = useState<"idle" | "copied" | "shared">("idle")

    async function handleShare() {
        const url = window.location.href

        // Web Share API (mobile)
        if (navigator.share) {
            try {
                await navigator.share({ title, url })
                setState("shared")
                setTimeout(() => setState("idle"), 2000)
                return
            } catch {
                // User cancelled — fall through to clipboard
            }
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(url)
            setState("copied")
            setTimeout(() => setState("idle"), 2000)
        } catch {
            // Clipboard blocked — last resort: select text
            const el = document.createElement("textarea")
            el.value = url
            document.body.appendChild(el)
            el.select()
            document.execCommand("copy")
            document.body.removeChild(el)
            setState("copied")
            setTimeout(() => setState("idle"), 2000)
        }
    }

    const done = state !== "idle"

    return (
        <div className={`relative ${className}`}>
            <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.93 }}
                className={`flex items-center gap-2 rounded-xl transition-all duration-200
                    ${compact
                        ? "w-9 h-9 justify-center bg-white/[0.04] ring-1 ring-white/[0.08] hover:bg-white/[0.08]"
                        : "px-4 py-2.5 bg-white/[0.04] ring-1 ring-white/[0.08] hover:bg-white/[0.08]"
                    }
                    ${done ? "ring-emerald-500/30 bg-emerald-500/8" : ""}`}
                aria-label="Share scholarship"
            >
                <AnimatePresence mode="wait">
                    {done ? (
                        <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -12 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                            <Check size={14} className="text-emerald-400" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            {typeof navigator !== "undefined" && "share" in navigator
                                ? <Share2 size={14} className="text-white/40" />
                                : <Copy size={14} className="text-white/40" />
                            }
                        </motion.span>
                    )}
                </AnimatePresence>

                {!compact && (
                    <span className={`text-[13px] font-medium transition-colors
                            ${done ? "text-emerald-400" : "text-white/50"}`}>
                        {state === "copied" ? "Link copied!"
                            : state === "shared" ? "Shared!"
                                : "Share"}
                    </span>
                )}
            </motion.button>

            {/* Floating toast for compact mode */}
            <AnimatePresence>
                {compact && done && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.9 }}
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                       whitespace-nowrap px-3 py-1.5 rounded-lg
                       bg-slate-800 ring-1 ring-white/10
                       text-[11px] font-medium text-white/70
                       shadow-xl pointer-events-none z-10"
                    >
                        {state === "copied" ? "Link copied!" : "Shared!"}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}