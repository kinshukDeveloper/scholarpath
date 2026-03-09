"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/contact/ContactPage.tsx
//
// Sections:
//   ✦ Hero header
//   ✦ 3 contact reason cards (General / Bug / Partnership)
//   ✦ Contact form (name, email, subject, message)
//   ✦ Direct contact links (email, twitter, github)
//   ✦ FAQ shortcut links
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AppLayout from "@/components/layout/AppLayout"
import {
  Mail, Twitter, Github, MessageCircle,
  Bug, Handshake, HelpCircle,
  Check, Loader2, ChevronRight,
} from "lucide-react"

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

const REASONS = [
  {
    icon:  MessageCircle,
    color: "#34d399",
    title: "General enquiry",
    desc:  "Questions about ScholarPath, feedback, or suggestions.",
    subject: "General enquiry",
  },
  {
    icon:  Bug,
    color: "#f87171",
    title: "Report a bug",
    desc:  "Found something broken? Let us know and we'll fix it fast.",
    subject: "Bug report",
  },
  {
    icon:  Handshake,
    color: "#f59e0b",
    title: "Partnership",
    desc:  "NGO, college, or company — let's work together.",
    subject: "Partnership enquiry",
  },
]

const LINKS = [
  { icon: Mail,    label: "Email",   value: "hello@scholarpath.in",   href: "mailto:hello@scholarpath.in" },
  { icon: Twitter, label: "Twitter", value: "@scholarpath_in",        href: "https://twitter.com/scholarpath_in" },
  { icon: Github,  label: "GitHub",  value: "github.com/scholarpath", href: "https://github.com" },
]

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: T.textMuted }}>
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] mt-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: "" }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = "Name is required"
    if (!form.email.trim())   e.email   = "Email is required"
    if (!form.message.trim()) e.message = "Message is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setStatus("loading")
    // Replace with your Resend / email API
    await new Promise(r => setTimeout(r, 1200))
    setStatus("done")
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-[14px] outline-none caret-emerald-400 transition-all"
  const inputStyle = { background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text }

  return (
    <AppLayout noPad>
      <div style={{ background: T.bg, minHeight: "100vh" }}>

        {/* Hero */}
        <div className="pt-28 pb-14 px-5 text-center"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
              style={{ color: T.accent }}>Contact</p>
            <h1 className="text-[42px] sm:text-[54px] font-black tracking-tighter mb-4"
              style={{ color: T.text }}>
              Get in <span style={{ color: T.accent }}>touch</span>
            </h1>
            <p className="text-[16px] max-w-md mx-auto" style={{ color: T.textDim }}>
              We&apos;re a small team — every message gets a real reply within 24 hours.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-5 py-14">

          {/* Reason cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-14">
            {REASONS.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.button
                  key={r.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => set("subject", r.subject)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-2xl p-5 text-left transition-all"
                  style={{
                    background: form.subject === r.subject ? r.color + "12" : T.bgCard,
                    border: `1px solid ${form.subject === r.subject ? r.color + "40" : T.border}`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: r.color + "16" }}>
                    <Icon size={18} style={{ color: r.color }} />
                  </div>
                  <p className="text-[14px] font-bold mb-1" style={{ color: T.text }}>{r.title}</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: T.textDim }}>{r.desc}</p>
                </motion.button>
              )
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {status === "done" ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center
                             py-16 rounded-2xl h-full"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                    <Check size={28} style={{ color: T.accent }} />
                  </div>
                  <h3 className="text-[20px] font-bold mb-2" style={{ color: T.text }}>Message sent!</h3>
                  <p className="text-[14px]" style={{ color: T.textDim }}>
                    We&apos;ll reply to {form.email} within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Your name" error={errors.name}>
                      <input value={form.name} onChange={e => set("name", e.target.value)}
                        placeholder="Rahul Kumar" className={inputCls} style={inputStyle} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        placeholder="rahul@example.com" className={inputCls} style={inputStyle} />
                    </Field>
                  </div>
                  <Field label="Subject">
                    <input value={form.subject} onChange={e => set("subject", e.target.value)}
                      placeholder="What's this about?" className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Message" error={errors.message}>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)}
                      rows={5} placeholder="Tell us everything..."
                      className={inputCls + " resize-none"} style={inputStyle} />
                  </Field>
                  <motion.button type="submit" disabled={status === "loading"}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5
                               rounded-xl text-[14px] font-bold disabled:opacity-60"
                    style={{ background: T.accent, color: T.bg }}>
                    {status === "loading"
                      ? <Loader2 size={16} className="animate-spin" />
                      : <><MessageCircle size={15} /> Send message</>
                    }
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Contact links + FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {LINKS.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl group transition-colors"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                    <Icon size={16} style={{ color: T.accent }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium" style={{ color: T.textMuted }}>{label}</p>
                    <p className="text-[14px] font-semibold group-hover:underline"
                      style={{ color: T.text }}>{value}</p>
                  </div>
                </a>
              ))}

              <div className="rounded-2xl p-5 mt-2"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle size={14} style={{ color: T.accent }} />
                  <p className="text-[13px] font-bold" style={{ color: T.text }}>
                    Check the FAQ first
                  </p>
                </div>
                <p className="text-[12px] mb-4" style={{ color: T.textDim }}>
                  Most questions about eligibility, reminders, and accounts are answered there.
                </p>
                <Link href="/about#faq"
                  className="flex items-center gap-1.5 text-[13px] font-semibold group"
                  style={{ color: T.accent }}>
                  View FAQ
                  <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}