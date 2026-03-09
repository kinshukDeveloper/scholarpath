"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/advertise/AdvertisePage.tsx
//
// Advertise / Partner page:
//   ✦ Hero with reach stats
//   ✦ 3 listing tiers (Basic / Featured / Sponsored)
//   ✦ Who should advertise section
//   ✦ Partnership enquiry form
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star, Zap, Building2, Users, Eye,
  CheckCircle2, ArrowRight, Mail, Loader2,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"

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

const TIERS = [
  {
    name:     "Basic Listing",
    price:    "Free",
    sub:      "Always free",
    color:    T.textMuted,
    icon:     Star,
    features: [
      "Listed in scholarship database",
      "Searchable by students",
      "Eligibility filtering included",
      "Deadline shown in listings",
    ],
    cta:     "Submit a scholarship",
    href:    "/admin",
    accent:  false,
  },
  {
    name:     "Featured Listing",
    price:    "₹2,000",
    sub:      "per month",
    color:    "#f59e0b",
    icon:     Zap,
    features: [
      "Everything in Basic",
      "★ Featured badge on card",
      "Priority placement in listings",
      "Highlighted in search results",
      "Shown in dashboard feed",
      "Monthly analytics report",
    ],
    cta:     "Get featured",
    href:    "#enquiry",
    accent:  true,
  },
  {
    name:     "Sponsored",
    price:    "₹10,000",
    sub:      "per month",
    color:    "#c084fc",
    icon:     Building2,
    features: [
      "Everything in Featured",
      "Homepage banner placement",
      "Email newsletter mention",
      "Dedicated landing page",
      "Logo in partners section",
      "Priority support",
      "Custom tracking link",
    ],
    cta:     "Enquire now",
    href:    "#enquiry",
    accent:  false,
  },
]

const WHO = [
  { icon: Building2, label: "NGOs & Trusts",         desc: "Reach eligible students directly and fill your scholarship slots." },
  { icon: Users,     label: "Colleges & Universities",desc: "Promote merit scholarships and drive applications from top students." },
  { icon: Star,      label: "Corporates (CSR)",       desc: "Run CSR scholarship programmes with verified student reach." },
  { icon: Zap,       label: "EdTech Companies",       desc: "Reach students actively searching for educational support." },
]

export default function AdvertisePage() {
  const [form,   setForm]   = useState({ name: "", org: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    await new Promise(r => setTimeout(r, 1200))
    setStatus("done")
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-[14px] outline-none caret-emerald-400"
  const inputStyle = { background: T.bgAlt, border: `1px solid ${T.border}`, color: T.text }

  return (
    <AppLayout noPad>
      <div style={{ background: T.bg, minHeight: "100vh" }}>

        {/* Hero */}
        <section className="pt-28 pb-16 px-5 text-center"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
              style={{ color: T.accent }}>Advertise</p>
            <h1 className="text-[44px] sm:text-[56px] font-black tracking-tighter mb-5"
              style={{ color: T.text }}>
              Reach <span style={{ color: T.accent }}>12,000+</span> Indian students
            </h1>
            <p className="text-[16px] max-w-xl mx-auto mb-10" style={{ color: T.textDim }}>
              ScholarPath is where Indian students discover scholarships. Put your listing,
              brand, or CSR programme in front of the right audience.
            </p>

            {/* Reach stats */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Users, value: "12,000+", label: "Monthly students"  },
                { icon: Eye,   value: "50,000+", label: "Monthly page views" },
                { icon: Star,  value: "500+",    label: "Scholarships listed"},
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                  <Icon size={15} style={{ color: T.accent }} />
                  <div className="text-left">
                    <p className="text-[18px] font-black leading-none" style={{ color: T.accent }}>
                      {value}
                    </p>
                    <p className="text-[11px]" style={{ color: T.textMuted }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Pricing tiers */}
        <section className="py-20 px-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
                style={{ color: T.accent }}>Listing options</p>
              <h2 className="text-[34px] font-black tracking-tight" style={{ color: T.text }}>
                Simple, transparent pricing
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {TIERS.map((tier, i) => {
                const Icon = tier.icon
                return (
                  <motion.div key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-6 relative"
                    style={{
                      background: tier.accent
                        ? `linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))`
                        : T.bgCard,
                      border: `1px solid ${tier.accent ? "rgba(245,158,11,0.3)" : T.border}`,
                    }}
                  >
                    {tier.accent && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1
                                      rounded-full text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: "#f59e0b", color: T.bg }}>
                        Most popular
                      </div>
                    )}

                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: tier.color + "14" }}>
                      <Icon size={18} style={{ color: tier.color }} />
                    </div>

                    <h3 className="text-[16px] font-bold mb-1" style={{ color: T.text }}>
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-[30px] font-black tracking-tight"
                        style={{ color: tier.color }}>
                        {tier.price}
                      </span>
                      <span className="text-[12px]" style={{ color: T.textMuted }}>{tier.sub}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-[13px]"
                          style={{ color: T.textDim }}>
                          <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5"
                            style={{ color: tier.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a href={tier.href}
                      className="flex items-center justify-center gap-2 w-full py-2.5
                                 rounded-xl text-[13px] font-bold transition-all hover:opacity-90"
                      style={tier.accent
                        ? { background: "#f59e0b", color: T.bg }
                        : { background: tier.color + "14",
                            border: `1px solid ${tier.color}28`,
                            color: tier.color }
                      }>
                      {tier.cta} <ArrowRight size={13} />
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Who should advertise */}
        <section className="py-20 px-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-[30px] font-black tracking-tight" style={{ color: T.text }}>
                Who advertises on ScholarPath?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {WHO.map((w, i) => {
                const Icon = w.icon
                return (
                  <motion.div key={w.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 p-5 rounded-2xl"
                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                      <Icon size={18} style={{ color: T.accent }} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold mb-1" style={{ color: T.text }}>{w.label}</p>
                      <p className="text-[13px] leading-relaxed" style={{ color: T.textDim }}>{w.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enquiry form */}
        <section id="enquiry" className="py-20 px-5">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
                style={{ color: T.accent }}>Get started</p>
              <h2 className="text-[30px] font-black tracking-tight mb-2" style={{ color: T.text }}>
                Partner with us
              </h2>
              <p className="text-[14px]" style={{ color: T.textDim }}>
                We&apos;ll get back to you within 24 hours with a media kit and pricing.
              </p>
            </div>

            {status === "done" ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-center py-14 rounded-2xl"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                  <CheckCircle2 size={26} style={{ color: T.accent }} />
                </div>
                <p className="text-[18px] font-bold mb-1" style={{ color: T.text }}>Enquiry received!</p>
                <p className="text-[14px]" style={{ color: T.textDim }}>
                  We&apos;ll reply to {form.email} within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: T.textMuted }}>Your name</label>
                    <input required value={form.name} onChange={e => set("name", e.target.value)}
                      placeholder="Sunita Sharma" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: T.textMuted }}>Organisation</label>
                    <input required value={form.org} onChange={e => set("org", e.target.value)}
                      placeholder="XYZ Foundation" className={inputCls} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: T.textMuted }}>Work email</label>
                  <input type="email" required value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="sunita@xyzfoundation.org" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: T.textMuted }}>Tell us about your scholarship / campaign</label>
                  <textarea rows={4} required value={form.message} onChange={e => set("message", e.target.value)}
                    placeholder="Brief description, target students, duration, budget range..."
                    className={inputCls + " resize-none"} style={inputStyle} />
                </div>
                <motion.button type="submit" disabled={status === "loading"}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5
                             rounded-xl text-[14px] font-bold disabled:opacity-60"
                  style={{ background: T.accent, color: T.bg }}>
                  {status === "loading"
                    ? <Loader2 size={16} className="animate-spin" />
                    : <><Mail size={15} /> Send enquiry</>
                  }
                </motion.button>
              </form>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}