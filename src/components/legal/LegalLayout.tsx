"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/legal/LegalLayout.tsx
//
// Shared layout for all legal pages.
// Renders:
//   ✦ Sticky left Table of Contents (desktop)
//   ✦ Reading progress bar
//   ✦ Prose content area
//   ✦ Last updated date + contact CTA at bottom
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AppLayout from "@/components/layout/AppLayout"
import { ChevronRight, Mail } from "lucide-react"

const T = {
  bg:         "#020817",
  bgAlt:      "rgba(255,255,255,0.018)",
  bgCard:     "rgba(255,255,255,0.028)",
  border:     "rgba(255,255,255,0.07)",
  text:       "#f8fafc",
  textDim:    "rgba(248,250,252,0.5)",
  textMuted:  "rgba(248,250,252,0.25)",
  accent:     "#34d399",
  accentDim:  "rgba(52,211,153,0.10)",
  accentRing: "rgba(52,211,153,0.28)",
}

export interface LegalSection {
  id:      string
  heading: string
  body:    React.ReactNode
}

interface Props {
  title:       string
  subtitle:    string
  updated:     string
  sections:    LegalSection[]
}

function ReadingBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct(Math.min((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100, 100))
    }
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <div className="fixed top-0 left-0 h-[3px] z-[60] transition-all"
      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${T.accent}, #60a5fa)` }} />
  )
}

export default function LegalLayout({ title, subtitle, updated, sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? "")

  // Highlight active TOC item on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <AppLayout noPad>
      <ReadingBar />
      <div style={{ background: T.bg, minHeight: "100vh" }}>

        {/* Hero */}
        <div className="pt-28 pb-12 px-5 text-center"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
              style={{ color: T.accent }}>Legal</p>
            <h1 className="text-[38px] sm:text-[50px] font-black tracking-tighter mb-3"
              style={{ color: T.text }}>
              {title}
            </h1>
            <p className="text-[14px]" style={{ color: T.textMuted }}>
              {subtitle} · Last updated: {updated}
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-14 flex gap-10">

          {/* TOC sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: T.textMuted }}>
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-[12px]
                               font-medium transition-all group"
                    style={active === s.id ? {
                      background: T.accentDim,
                      color:      T.accent,
                      border:     `1px solid ${T.accentRing}`,
                    } : {
                      color: T.textMuted,
                    }}>
                    <ChevronRight size={11}
                      className={`transition-transform ${active === s.id ? "translate-x-0.5" : ""}`}
                      style={{ color: active === s.id ? T.accent : T.textMuted }} />
                    {s.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0 space-y-12">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <h2 className="text-[20px] font-black tracking-tight mb-4 pb-3"
                  style={{ color: T.text, borderBottom: `1px solid ${T.border}` }}>
                  {s.heading}
                </h2>
                <div className="text-[14px] leading-[1.9] space-y-3"
                  style={{ color: T.textDim }}>
                  {s.body}
                </div>
              </motion.section>
            ))}

            {/* Footer CTA */}
            <div className="rounded-2xl p-6 mt-8"
              style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
              <p className="text-[14px] font-semibold mb-1" style={{ color: T.text }}>
                Questions about this policy?
              </p>
              <p className="text-[13px] mb-4" style={{ color: T.textDim }}>
                Email us and we&apos;ll respond within 2 business days.
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                           text-[13px] font-bold transition-colors"
                style={{ background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }}>
                <Mail size={13} /> Contact us
              </Link>
            </div>
          </article>
        </div>
      </div>
    </AppLayout>
  )
}