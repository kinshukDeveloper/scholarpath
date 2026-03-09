"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/page.tsx  — ScholarPath Landing Page
//
// Sections:
//   1. Navbar          (with theme toggle)
//   2. Hero            (GSAP stagger + floating cards)
//   3. Stats bar       (GSAP count-up on scroll)
//   4. How it works    (3-step)
//   5. Featured        (scholarship preview cards)
//   6. Testimonials    (GSAP horizontal marquee)
//   7. FAQ             (accordion)
//   8. Final CTA
//   9. Footer
//
// Theme: dark (default) ↔ light via ThemeContext + toggle button
// ─────────────────────────────────────────────────────────────

import {
  createContext, useContext, useState,
  useEffect, useRef,
} from "react"
import Link from "next/link"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Sun, Moon, Search, Bell, BookmarkCheck,
  ArrowRight, ChevronDown, GraduationCap,
  IndianRupee, Zap, Users, Star,
  CheckCircle, Menu, X as XIcon, LucideIcon 
} from "lucide-react"

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)
// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const DARK = {
  bg:         "#020817",
  bgAlt:      "rgba(255,255,255,0.018)",
  bgCard:     "rgba(255,255,255,0.028)",
  border:     "rgba(255,255,255,0.07)",
  textPrimary:"#f8fafc",
  textSecond: "rgba(248,250,252,0.5)",
  textMuted:  "rgba(248,250,252,0.25)",
  accent:     "#34d399",
  accentDim:  "rgba(52,211,153,0.10)",
  accentRing: "rgba(52,211,153,0.28)",
  navBg:      "rgba(2,8,23,0.88)",
  glow:       "radial-gradient(ellipse 700px 400px at 50% 30%, rgba(52,211,153,0.10) 0%, transparent 70%)",
}
const LIGHT = {
  bg:         "#f8fafc",
  bgAlt:      "#f1f5f9",
  bgCard:     "#ffffff",
  border:     "rgba(0,0,0,0.08)",
  textPrimary:"#0f172a",
  textSecond: "rgba(15,23,42,0.55)",
  textMuted:  "rgba(15,23,42,0.33)",
  accent:     "#059669",
  accentDim:  "rgba(5,150,105,0.08)",
  accentRing: "rgba(5,150,105,0.22)",
  navBg:      "rgba(248,250,252,0.92)",
  glow:       "none",
}

type Theme = typeof DARK
const ThemeCtx = createContext<{ t: Theme; dark: boolean; toggle: () => void }>({
  t: DARK, dark: true, toggle: () => {},
})
const useTheme = () => useContext(ThemeCtx)

// ── Toggle button ─────────────────────────────────────────────
function ThemeToggle() {
  const { t, dark, toggle } = useTheme()
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.07 }}
      whileTap={{  scale: 0.91 }}
      aria-label="Toggle theme"
      className="relative w-[52px] h-7 rounded-full flex items-center px-[3px]"
      style={{
        background: t.accentDim,
        boxShadow: `0 0 0 1px ${t.accentRing}`,
      }}
    >
      <Sun  size={10} className="absolute left-[7px]"  style={{ color: dark ? t.textMuted : t.accent }} />
      <Moon size={10} className="absolute right-[7px]" style={{ color: dark ? t.accent : t.textMuted }} />
      <motion.div
        className="w-[22px] h-[22px] rounded-full z-10 shadow"
        animate={{ x: dark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 30 }}
        style={{ background: t.accent }}
      />
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────
function Navbar() {
  const { t } = useTheme()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-50"
      animate={{
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottomColor: scrolled ? t.border : "transparent",
      }}
      style={{
        background: scrolled ? t.navBg : "transparent",
        borderBottom: "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: t.accent }}>
            <GraduationCap size={14} color={t.bg} />
          </div>
          <span className="text-[15px] font-bold tracking-tight" style={{ color: t.textPrimary }}>
            ScholarPath
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[["Scholarships", "/scholarships"], ["How it works", "#how-it-works"], ["FAQ", "#faq"]].map(([l, h]) => (
            <Link key={l} href={h}
              className="text-[13px] font-medium transition-colors hover:opacity-80"
              style={{ color: t.textSecond }}>
              {l}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login"
            className="hidden md:block text-[13px] font-medium transition-colors"
            style={{ color: t.textSecond }}>
            Sign in
          </Link>
          <Link href="/register"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl
                       text-[13px] font-bold shadow-sm transition-all hover:opacity-90"
            style={{ background: t.accent, color: t.bg }}>
            Get started <ArrowRight size={13} />
          </Link>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: t.bgCard, border: `1px solid ${t.border}` }}
          >
            {menuOpen ? <XIcon size={15} style={{ color: t.textSecond }} />
                      : <Menu  size={15} style={{ color: t.textSecond }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden px-5 pb-4 space-y-1"
            style={{ background: t.navBg, borderBottom: `1px solid ${t.border}` }}
          >
            {["Scholarships", "Sign in", "Get started"].map(l => (
              <Link key={l} href="/scholarships"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[14px] font-medium border-b"
                style={{ color: t.textSecond, borderColor: t.border }}>
                {l}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────
const FLOAT_CARDS = [
  { name: "PM Scholarship",   amount: "₹25,000/yr", color: "#34d399", x: "66%", y: "22%", delay: 0.9 },
  { name: "AICTE Pragati",    amount: "₹50,000/yr", color: "#60a5fa", x: "70%", y: "50%", delay: 1.05 },
  { name: "NSP Pre-Matric",   amount: "₹12,000/yr", color: "#f59e0b", x: "62%", y: "68%", delay: 1.2 },
]

function FloatingCard({ name, amount, color, x, y, delay }: typeof FLOAT_CARDS[0]) {
  const { t } = useTheme()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{
        opacity: 1, scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale:   { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute hidden lg:block rounded-2xl px-4 py-3"
      style={{
        left: x, top: y,
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        backdropFilter: "blur(16px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${color}18`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: color + "18" }}>
          <IndianRupee size={13} style={{ color }} />
        </div>
        <div>
          <p className="text-[11px] font-semibold" style={{ color: t.textPrimary }}>{name}</p>
          <p className="text-[10px] font-bold"     style={{ color }}>{amount}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Hero() {
  const { t, dark } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.querySelectorAll(".h-el"),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.75, ease: "power3.out", delay: 0.15 }
    )
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center
                 pt-20 pb-16 px-5 overflow-hidden"
      style={{ background: t.bg }}
    >
      {/* Background glow (dark only) */}
      {dark && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: t.glow }} />
      )}

      {/* Floating scholarship cards */}
      {FLOAT_CARDS.map(c => <FloatingCard key={c.name} {...c} />)}

      <div className="relative z-10 text-center max-w-3xl mx-auto">

        {/* Eyebrow */}
        <div className="h-el opacity-0 inline-flex items-center gap-2 px-3 py-1.5
                        rounded-full mb-7 text-[12px] font-bold"
          style={{ background: t.accentDim, border: `1px solid ${t.accentRing}`, color: t.accent }}>
          <Zap size={11} fill="currentColor" />
          500M+ students · One scholarship platform
        </div>

        {/* Headline */}
        <h1 className="h-el opacity-0 text-5xl sm:text-[64px] lg:text-[76px]
                       font-black tracking-tighter leading-[1.02] mb-2"
          style={{ color: t.textPrimary }}>
          Your scholarship.
        </h1>
        <h1 className="h-el opacity-0 text-5xl sm:text-[64px] lg:text-[76px]
                       font-black tracking-tighter leading-[1.02] mb-7"
          style={{ color: t.accent }}>
          Found in minutes.
        </h1>

        {/* Sub */}
        <p className="h-el opacity-0 text-[16px] sm:text-[18px] leading-relaxed
                      max-w-xl mx-auto mb-8"
          style={{ color: t.textSecond }}>
          ScholarPath matches Indian students to scholarships they actually qualify
          for — with smart eligibility filtering, deadline reminders, and a
          step-by-step apply guide.
        </p>

        {/* CTAs */}
        <div className="h-el opacity-0 flex flex-col sm:flex-row items-center
                        justify-center gap-3 mb-6">
          <Link href="/register"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl
                       text-[15px] font-black shadow-xl transition-all
                       hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: t.accent,
              color: t.bg,
              boxShadow: `0 10px 40px ${t.accentRing}`,
            }}>
            Find my scholarship <ArrowRight size={16} />
          </Link>
          <Link href="/scholarships"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl
                       text-[15px] font-semibold transition-all hover:opacity-80"
            style={{
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              color: t.textSecond,
            }}>
            Browse all
          </Link>
        </div>

        {/* Trust */}
        <p className="h-el opacity-0 text-[12px]" style={{ color: t.textMuted }}>
          Free to use · No card required · Updated every week
        </p>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ color: t.textMuted }}
      >
        <ChevronDown size={20} />
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────
function StatCell({ value, suffix, label, delay }: {
  value: number; suffix: string; label: string; delay: number
}) {
  const { t } = useTheme()
  const ref      = useRef<HTMLDivElement>(null)
  const inView   = useInView(ref, { once: true, margin: "-60px" })
  const numRef   = useRef<HTMLSpanElement>(null)
  const proxy    = useRef({ n: 0 })

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
    <div ref={ref} className="text-center py-6 px-4">
      <div className="text-[38px] sm:text-[48px] font-black tabular-nums tracking-tight leading-none"
        style={{ color: t.accent }}>
        <span ref={numRef}>0{suffix}</span>
      </div>
      <p className="text-[13px] mt-2 font-medium" style={{ color: t.textSecond }}>{label}</p>
    </div>
  )
}

function StatsBar() {
  const { t, dark } = useTheme()
  const STATS = [
    { value: 500,   suffix: "+",  label: "Scholarships listed"        },
    { value: 2500,  suffix: "Cr", label: "Total funding available"     },
    { value: 12000, suffix: "+",  label: "Students helped this year"   },
    { value: 98,    suffix: "%",  label: "Features free forever"       },
  ]
  return (
    <section style={{
      background: dark ? "rgba(52,211,153,0.035)" : "#ecfdf5",
      borderTop:    `1px solid ${t.border}`,
      borderBottom: `1px solid ${t.border}`,
    }}>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
        style={{ borderColor: t.border }}>
        {STATS.map((s, i) => <StatCell key={s.label} {...s} delay={i * 0.08} />)}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const { t } = useTheme()
  const STEPS = [
    { num: "01", icon: Search,  title: "Tell us about you",       desc: "Set your category, education, state and income in 2 minutes.", color: "#60a5fa" },
    { num: "02", icon: Zap,     title: "Get matched instantly",   desc: "We show only the scholarships you actually qualify for.",       color: "#34d399" },
    { num: "03", icon: Bell,    title: "Never miss a deadline",   desc: "Email or WhatsApp reminder 7 days before each deadline.",       color: "#f59e0b" },
  ]
  return (
    <section id="how-it-works" className="py-24 px-5" style={{ background: t.bg }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
            style={{ color: t.accent }}>How it works</p>
          <h2 className="text-[36px] sm:text-[46px] font-black tracking-tight"
            style={{ color: t.textPrimary }}>
            Three steps to your scholarship
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16,1,0.3,1] }}
                className="relative rounded-2xl p-6"
                style={{ background: t.bgCard, border: `1px solid ${t.border}` }}
              >
                <span className="absolute top-4 right-5 text-[56px] font-black
                                 leading-none select-none pointer-events-none"
                  style={{ color: s.color, opacity: 0.06 }}>
                  {s.num}
                </span>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: s.color + "16", border: `1px solid ${s.color}28` }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: t.textPrimary }}>
                  {s.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: t.textSecond }}>
                  {s.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FEATURED SCHOLARSHIPS
// ─────────────────────────────────────────────────────────────
const FEATURED = [
  { id: "1", title: "PM Scholarship Scheme",       provider: "Ministry of Home Affairs",  amount: 25000, cats: ["Ex-Servicemen"], days: 47  },
  { id: "2", title: "AICTE Pragati Scholarship",   provider: "AICTE",                     amount: 50000, cats: ["Female","SC/ST"], days: 12 },
  { id: "3", title: "NSP Pre-Matric Scholarship",  provider: "Natl. Scholarship Portal",  amount: 12000, cats: ["SC","ST"],         days: 6  },
]

function FeaturedSection() {
  const { t, dark } = useTheme()
  return (
    <section style={{
      background: dark ? t.bgAlt : "#f1f5f9",
      borderTop: `1px solid ${t.border}`,
    }} className="py-24 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
              style={{ color: t.accent }}>Featured</p>
            <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight"
              style={{ color: t.textPrimary }}>
              Scholarships closing soon
            </h2>
          </div>
          <Link href="/scholarships"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-bold group"
            style={{ color: t.accent }}>
            View all <ArrowRight size={14}
              className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURED.map((s, i) => {
            const urgColor = s.days <= 7 ? "#f87171" : s.days <= 30 ? "#fbbf24" : t.accent
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Link href={`/scholarships/${s.id}`}
                  className="block rounded-2xl p-5 h-full group"
                  style={{ background: t.bgCard, border: `1px solid ${t.border}` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{ background: t.accentDim, color: t.accent, border: `1px solid ${t.accentRing}` }}>
                      Open
                    </span>
                    <span className="text-[11px] font-semibold"
                      style={{ color: urgColor }}>
                      {s.days}d left
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold leading-snug mb-1 line-clamp-2"
                    style={{ color: t.textPrimary }}>{s.title}</h3>
                  <p className="text-[12px] mb-4" style={{ color: t.textMuted }}>{s.provider}</p>
                  <div className="flex items-baseline gap-0.5">
                    <IndianRupee size={14} style={{ color: t.accent }} />
                    <span className="text-[26px] font-black tabular-nums leading-none"
                      style={{ color: t.accent }}>
                      {(s.amount / 1000).toFixed(0)}K
                    </span>
                    <span className="text-[11px] ml-1" style={{ color: t.textMuted }}>/year</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {s.cats.map(c => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                        style={{ background: t.bgAlt, border: `1px solid ${t.border}`, color: t.textMuted }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS — GSAP marquee
// ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Priya S.",  state: "Maharashtra", text: "Found the PM Scholarship in 5 minutes. Got ₹25K!",                          stars: 5 },
  { name: "Rahul K.",  state: "Bihar",       text: "Deadline reminders saved me — I almost missed the NSP application.",        stars: 5 },
  { name: "Ananya M.", state: "Karnataka",   text: "Showed me 12 scholarships I never knew existed. Life-changing.",            stars: 5 },
  { name: "Suresh P.", state: "Tamil Nadu",  text: "Document checklist made the whole process so much less overwhelming.",      stars: 5 },
  { name: "Meera R.",  state: "Rajasthan",   text: "I was rejected twice before. ScholarPath showed me the right ones for me.", stars: 5 },
  { name: "Arjun D.",  state: "Delhi",       text: "My sister and I both found scholarships through here. Amazing platform.",   stars: 5 },
]

function Testimonials() {
  const { t } = useTheme()
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!trackRef.current) return
    animRef.current = gsap.to(trackRef.current, {
      x: "-50%", duration: 30, repeat: -1, ease: "none",
    })
    const el = trackRef.current
    el.addEventListener("mouseenter", () => animRef.current?.pause())
    el.addEventListener("mouseleave", () => animRef.current?.resume())
    return () => { animRef.current?.kill() }
  }, [])

  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className="py-24 overflow-hidden"
      style={{ background: t.bg, borderTop: `1px solid ${t.border}` }}>
      <div className="max-w-4xl mx-auto px-5 text-center mb-12">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
          style={{ color: t.accent }}>Testimonials</p>
        <h2 className="text-[32px] sm:text-[40px] font-black tracking-tight"
          style={{ color: t.textPrimary }}>
          Students love ScholarPath
        </h2>
      </div>
      <div className="flex overflow-hidden">
        <div ref={trackRef} className="flex" style={{ width: "max-content" }}>
          {doubled.map((item, i) => (
            <div key={i}
              className="flex-shrink-0 w-72 rounded-2xl p-5 mx-2"
              style={{ background: t.bgCard, border: `1px solid ${t.border}` }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.stars }).map((_, si) => (
                  <Star key={si} size={12} fill={t.accent} style={{ color: t.accent }} />
                ))}
              </div>
              <p className="text-[13px] leading-relaxed mb-4"
                style={{ color: t.textSecond }}>
                &ldquo;{item.text}&ldquo;
              </p>
              <p className="text-[12px] font-semibold" style={{ color: t.textPrimary }}>
                {item.name}
              </p>
              <p className="text-[11px]" style={{ color: t.textMuted }}>{item.state}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Is ScholarPath free?",
    a: "Yes — browsing, filtering, and bookmarking are free. Premium adds WhatsApp reminders and eligibility reports." },
  { q: "How often is the database updated?",
    a: "Every week. Closed scholarships are removed and new ones are added so you only see live opportunities." },
  { q: "Do I need an account to browse?",
    a: "No — browse and filter freely without an account. Sign up to bookmark, set reminders, and track applications." },
  { q: "How does eligibility matching work?",
    a: "Fill in your profile (category, education, state, gender, income) and we auto-filter to scholarships you qualify for." },
  { q: "Can I get deadline reminders?",
    a: "Yes — save a scholarship and set a reminder. Email is free; WhatsApp reminders are on the Premium plan." },
]

function FAQ() {
  const { t, dark } = useTheme()
  return (
    <section id="faq" className="py-24 px-5"
      style={{ background: dark ? t.bgAlt : "#f1f5f9", borderTop: `1px solid ${t.border}` }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: t.accent }}>FAQ</p>
          <h2 className="text-[32px] font-black tracking-tight" style={{ color: t.textPrimary }}>
            Common questions
          </h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [open, setOpen] = useState(false)
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: t.bgCard, border: `1px solid ${t.border}` }}
              >
                <button
                  onClick={() => setOpen(o => !o)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-[14px] font-semibold pr-4"
                    style={{ color: t.textPrimary }}>
                    {f.q}
                  </span>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={15} style={{ color: t.textMuted }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{    height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 pt-1 text-[13px] leading-relaxed"
                        style={{ color: t.textSecond, borderTop: `1px solid ${t.border}` }}>
                        <span className="block pt-3">{f.a}</span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────
function FinalCTA() {
  const FEATURES: [LucideIcon, string][] = [
  [CheckCircle, "Free forever"],
  [Users, "12,000+ students"],
  [BookmarkCheck, "500+ scholarships"],
]
  const { t } = useTheme()
  return (
    <section className="py-24 px-5" style={{ background: t.bg, borderTop: `1px solid ${t.border}` }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center rounded-3xl p-10 sm:p-14"
        style={{
          background: t.accentDim,
          border: `1px solid ${t.accentRing}`,
        }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: t.accentDim, border: `1px solid ${t.accentRing}` }}>
          <GraduationCap size={26} style={{ color: t.accent }} />
        </div>
        <h2 className="text-[36px] sm:text-[44px] font-black tracking-tight mb-4"
          style={{ color: t.textPrimary }}>
          Start for free today
        </h2>
        <p className="text-[15px] leading-relaxed mb-8 max-w-md mx-auto"
          style={{ color: t.textSecond }}>
          Join thousands of students using ScholarPath to find, track, and win scholarships.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link href="/register"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[15px]
                       font-black shadow-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: t.accent, color: t.bg,
              boxShadow: `0 10px 40px ${t.accentRing}`,
            }}>
            Create free account <ArrowRight size={16} />
          </Link>
          <Link href="/scholarships"
            className="text-[14px] font-medium transition-colors hover:opacity-70"
            style={{ color: t.textMuted }}>
            Browse without signing up →
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {FEATURES.map(([Icon, label]: [typeof CheckCircle, string]) => (
            <div key={label} className="flex items-center gap-1.5 text-[12px]"
              style={{ color: t.textMuted }}>
              <Icon size={13} style={{ color: t.accent }} />
              {label}
            </div>
          ))} 
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTheme()
  return (
    <footer className="px-5 py-8" style={{ background: t.bg, borderTop: `1px solid ${t.border}` }}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center
                      justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: t.accent }}>
            <GraduationCap size={12} color={t.bg} />
          </div>
          <span className="text-[14px] font-bold" style={{ color: t.textPrimary }}>
            ScholarPath
          </span>
        </div>
        <p className="text-[12px]" style={{ color: t.textMuted }}>
          © {new Date().getFullYear()} ScholarPath · Built for Indian students.
        </p>
        <div className="flex gap-4">
          {["Privacy", "Terms", "Contact"].map(l => (
            <Link key={l} href="#"
              className="text-[12px] hover:underline transition-colors"
              style={{ color: t.textMuted }}>
              {l}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [dark, setDark] = useState(true)
  const theme = dark ? DARK : LIGHT

  return (
    <ThemeCtx.Provider value={{ t: theme, dark, toggle: () => setDark(d => !d) }}>
      <motion.div
        animate={{ backgroundColor: theme.bg }}
        transition={{ duration: 0.35 }}
        style={{ minHeight: "100vh" }}
      >
        <Navbar />
        <Hero />
        <StatsBar />
        <HowItWorks />
        <FeaturedSection />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </motion.div>
    </ThemeCtx.Provider>
  )
}