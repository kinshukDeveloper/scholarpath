"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/about/page.tsx
//
// Sections:
//   1. Hero / Mission statement
//   2. Story section
//   3. Impact stats (GSAP count-up)
//   4. Solo developer "Me" section
//   5. Advisors / partners logos
//   6. Contact section
// ─────────────────────────────────────────────────────────────
 
import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AppLayout from "@/components/layout/AppLayout"
import {
  Heart,  Mail, Twitter, Github,
  Linkedin, MessageCircle, MapPin, Code2, Coffee,
  IndianRupee, Users, BookOpen, Award,
} from "lucide-react"
import { ContactForm } from "@/types"

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)
// ── Design tokens (matches app dark theme) ────────────────────
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

// ─────────────────────────────────────────────────────────────
// 1. HERO / MISSION
// ─────────────────────────────────────────────────────────────
function MissionHero() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.querySelectorAll(".m-el"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: "power3.out", delay: 0.1 }
    )
  }, [])

  return (
    <section ref={ref} className="relative pt-28 pb-20 px-5 overflow-hidden"
      style={{ background: T.bg }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 600px 350px at 50% 20%, rgba(52,211,153,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="m-el opacity-0 inline-flex items-center gap-2 px-3 py-1.5
                        rounded-full mb-6 text-[12px] font-bold"
          style={{ background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }}>
          <Heart size={11} fill="currentColor" />
          Built for India&apos;s students
        </div>

        <h1 className="m-el opacity-0 text-[48px] sm:text-[60px] font-black
                       tracking-tighter leading-[1.05] mb-6"
          style={{ color: T.text }}>
          Every student deserves to{" "}
          <span style={{ color: T.accent }}>know</span> what&apos;s available.
        </h1>

        <p className="m-el opacity-0 text-[17px] leading-relaxed max-w-2xl mx-auto"
          style={{ color: T.textDim }}>
          India has thousands of scholarships worth crores of rupees — but most
          students never find them. ScholarPath exists to change that: one
          searchable, filtered, reminder-powered platform for every eligible student.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. STORY SECTION
// ─────────────────────────────────────────────────────────────
function Story() {
  return (
    <section className="py-20 px-5" style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
            style={{ color: T.accent }}>Our story</p>

          <div className="space-y-5 text-[15px] leading-[1.85]" style={{ color: T.textDim }}>
            <p>
              ScholarPath started with a simple frustration: a friend missed a
              ₹50,000 scholarship deadline because he found out about it three
              days too late. The scholarship was right there on the government portal
              — buried under 40 filters and a URL nobody bookmarks.
            </p>
            <p>
              India has over <span style={{ color: T.text, fontWeight: 600 }}>3,000 active scholarships</span> at
              any given time — central, state, private, and NGO-funded. Most students
              know about two or three. The rest go unclaimed.
            </p>
            <p>
              ScholarPath is built to fix that. Not with another government portal,
              but with a fast, searchable, eligibility-aware platform that actually
              tells you what you qualify for — and reminds you before it&apos;s too late.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. IMPACT STATS
// ─────────────────────────────────────────────────────────────
function StatNum({ value, suffix, label, delay }: {
  value: number; suffix: string; label: string; delay: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const numRef = useRef<HTMLSpanElement>(null)
  const proxy  = useRef({ n: 0 })

  useEffect(() => {
    if (!inView || !numRef.current) return
    gsap.to(proxy.current, {
      n: value,
      duration: 1.6,
      delay,
      ease: "power3.out",
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent =
            (value >= 1000
              ? Math.round(proxy.current.n).toLocaleString("en-IN")
              : Math.round(proxy.current.n).toString()) + suffix
      },
    })
  }, [inView, value, suffix, delay])

  return (
    <div ref={ref} className="text-center py-8">
      <div className="text-[44px] sm:text-[52px] font-black tabular-nums tracking-tight leading-none"
        style={{ color: T.accent }}>
        <span ref={numRef}>0{suffix}</span>
      </div>
      <p className="text-[13px] mt-2 font-medium" style={{ color: T.textDim }}>{label}</p>
    </div>
  )
}

function ImpactStats() {
  const STATS = [
    { icon: BookOpen,      value: 500,   suffix: "+",  label: "Scholarships indexed"       },
    { icon: Users,         value: 12000, suffix: "+",  label: "Students helped"             },
    { icon: IndianRupee,   value: 2500,  suffix: "Cr", label: "Total funding surfaced"      },
    { icon: Award,         value: 94,    suffix: "%",  label: "Features free forever"       },
  ]

  return (
    <section className="py-6 px-5" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: T.accent }}>Impact</p>
          <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight"
            style={{ color: T.text }}>
            Small team. Real numbers.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
          style={{ borderColor: T.border }}>
          {STATS.map((s, i) => (
            <StatNum key={s.label} value={s.value} suffix={s.suffix}
              label={s.label} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 4. SOLO DEVELOPER "ME" SECTION
// ─────────────────────────────────────────────────────────────
function SoloDev() {
  return (
    <section className="py-20 px-5" style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-8"
          style={{ color: T.accent }}>
          The person behind ScholarPath
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-8 items-start"
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center
                            text-[40px] select-none"
              style={{
                background: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(96,165,250,0.10))",
                border: `1px solid ${T.accentRing}`,
              }}>
              👨‍💻
            </div>
            {/* Social links */}
            <div className="flex gap-2 mt-3">
              {[
                { icon: Twitter,  href: "https://twitter.com",  label: "Twitter"  },
                { icon: Github,   href: "https://github.com",   label: "GitHub"   },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                             transition-colors hover:opacity-80"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                  <Icon size={14} style={{ color: T.textDim }} />
                </a>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-[22px] font-black tracking-tight"
                style={{ color: T.text }}>
                Hi, I&apos;m [Kinshuk] 👋
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: T.accentDim, color: T.accent, border: `1px solid ${T.accentRing}` }}>
                Solo founder
              </span>
            </div>

            {/* Location + role chips */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: MapPin,  label: "India"              },
                { icon: Code2,   label: "Full-stack dev"      },
                { icon: Coffee,  label: "Side-project builder" },
              ].map(({ icon: Icon, label }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium
                             px-2.5 py-1 rounded-lg"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim }}>
                  <Icon size={11} style={{ color: T.accent }} />
                  {label}
                </span>
              ))}
            </div>

            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: T.textDim }}>
              <p>
                I built ScholarPath alone — from the database schema and Supabase
                backend to every component you see here. It started as a weekend
                project and became something I genuinely believe Indian students
                needed.
              </p>
              <p>
                I&apos;m a full-stack developer passionate about building products that
                solve real problems. ScholarPath is my attempt to use software to
                create real opportunity — not just another SaaS.
              </p>
              <p>
                If you&apos;re a student who found a scholarship through this, or a
                developer who wants to contribute, I&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What I built callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 rounded-2xl p-6"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
        >
          <p className="text-[12px] font-bold uppercase tracking-widest mb-4"
            style={{ color: T.textMuted }}>
            What I built this with
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js 14", "Supabase", "Tailwind CSS", "Framer Motion",
              "GSAP", "Razorpay", "Resend", "Vercel"].map(tech => (
              <span key={tech}
                className="text-[12px] font-medium px-3 py-1.5 rounded-xl"
                style={{ background: T.bgAlt, border: `1px solid ${T.border}`, color: T.textDim }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 5. ADVISORS / PARTNERS LOGOS
// ─────────────────────────────────────────────────────────────
const PARTNERS = [
  { name: "NSP",       full: "National Scholarship Portal",   emoji: "🏛️" },
  { name: "AICTE",     full: "All India Council for Technical Education", emoji: "🎓" },
  { name: "UGC",       full: "University Grants Commission",  emoji: "📚" },
  { name: "HDFC",      full: "HDFC Bank Parivartan",          emoji: "🏦" },
  { name: "Buddy4Study",full: "Buddy4Study",                  emoji: "🤝" },
  { name: "Vidyasaarathi",full: "Vidyasaarathi",              emoji: "🌱" },
]

function PartnersSection() {
  return (
    <section className="py-20 px-5" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: T.accent }}>Partners & Sources</p>
          <h2 className="text-[30px] font-black tracking-tight" style={{ color: T.text }}>
            Scholarship data sourced from
          </h2>
          <p className="text-[14px] mt-2" style={{ color: T.textDim }}>
            We aggregate and verify data from trusted Indian scholarship bodies.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PARTNERS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl p-5 flex flex-col items-center text-center gap-3"
              style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
            >
              <span className="text-[32px]">{p.emoji}</span>
              <div>
                <p className="text-[14px] font-bold" style={{ color: T.text }}>{p.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: T.textMuted }}>{p.full}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// 6. CONTACT SECTION
// ─────────────────────────────────────────────────────────────
function ContactSection() {
  const [form,    setForm]    = useState<ContactForm>({ name: "", email: "", message: "" })
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error">("idle")
const INPUT_FIELDS: {
  key: keyof ContactForm
  label: string
  type: string
  placeholder: string
}[] = [
  { key: "name", label: "Your name", type: "text", placeholder: "Rahul Kumar" },
  { key: "email", label: "Email address", type: "email", placeholder: "rahul@example.com" },
]
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    // Replace with your Resend / email API call
    await new Promise(r => setTimeout(r, 1200))
    setStatus("sent")
  }

  const CONTACT_LINKS = [
    { icon: Mail,    label: "Email",   value: "hello@scholarpath.in",  href: "mailto:hello@scholarpath.in" },
    { icon: Twitter, label: "Twitter", value: "@scholarpath_in",       href: "https://twitter.com"         },
    { icon: Github,  label: "GitHub",  value: "github.com/scholarpath", href: "https://github.com"         },
  ]

  return (
    <section className="py-20 px-5" style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: T.accent }}>Contact</p>
          <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight mb-3"
            style={{ color: T.text }}>
            Let&apos;s talk
          </h2>
          <p className="text-[15px]" style={{ color: T.textDim }}>
            Student, developer, or partner — I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact links */}
          <div className="space-y-3">
            {CONTACT_LINKS.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-2xl group transition-colors"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                  <Icon size={16} style={{ color: T.accent }} />
                </div>
                <div>
                  <p className="text-[12px] font-medium" style={{ color: T.textMuted }}>{label}</p>
                  <p className="text-[14px] font-semibold group-hover:underline"
                    style={{ color: T.text }}>{value}</p>
                </div>
              </motion.a>
            ))}

            <div className="mt-6 p-5 rounded-2xl"
              style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: T.accent }}>
                Want to contribute?
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: T.textDim }}>
                ScholarPath is open to contributions — scholarship data, translations,
                feature ideas, or code. Open a GitHub issue or drop me an email.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
          >
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center
                              text-center py-8 gap-3">
                <span className="text-[40px]">🎉</span>
                <p className="text-[16px] font-bold" style={{ color: T.text }}>
                  Message sent!
                </p>
                <p className="text-[13px]" style={{ color: T.textDim }}>
                  I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {INPUT_FIELDS.map(({ key, label, type, placeholder }) => (
                  <div key={String(key)}>
                    <label className="block text-[12px] font-medium mb-1.5"
                      style={{ color: T.textDim }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }) as ContactForm)}
                      className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none
                                 transition-all caret-emerald-400"
                      style={{
                        background: T.bgAlt,
                        border: `1px solid ${T.border}`,
                        color: T.text,
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-medium mb-1.5"
                    style={{ color: T.textDim }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me what&apos;s on your mind..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none
                               resize-none transition-all caret-emerald-400"
                    style={{
                      background: T.bgAlt,
                      border: `1px solid ${T.border}`,
                      color: T.text,
                    }}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{  scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3
                             rounded-xl text-[14px] font-bold transition-all
                             disabled:opacity-60"
                  style={{ background: T.accent, color: T.bg }}
                >
                  {status === "sending" ? (
                    <motion.span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <><MessageCircle size={15} /> Send message</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <AppLayout noPad>
      <MissionHero />
      <Story />
      <ImpactStats />
      <SoloDev />
      <PartnersSection />
      <ContactSection />
    </AppLayout>
  )
}