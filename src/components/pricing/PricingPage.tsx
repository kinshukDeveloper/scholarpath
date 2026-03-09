"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/pricing/PricingPage.tsx
//
// Sections:
//   ✦ Hero + monthly/yearly toggle (yearly = 2 months free)
//   ✦ Free vs Premium plan cards
//   ✦ Feature comparison table
//   ✦ FAQ accordion
//   ✦ Final CTA
// ─────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import AppLayout from "@/components/layout/AppLayout"
import {
  Check, X as XIcon, Zap, ChevronDown,
  ArrowRight, Star, Shield, BookmarkCheck,
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
  gold:       "#f59e0b",
  goldDim:    "rgba(245,158,11,0.10)",
  goldRing:   "rgba(245,158,11,0.28)",
}

// ── Plan data ─────────────────────────────────────────────────
const PLANS = [
  {
    id:       "free",
    name:     "Free",
    desc:     "Everything you need to discover scholarships.",
    monthly:  0,
    yearly:   0,
    color:    T.accent,
    popular:  false,
    cta:      "Get started free",
    ctaHref:  "/register",
    features: [
      "Browse all 500+ scholarships",
      "Filter by category, state & education",
      "Eligibility matching",
      "Unlimited bookmarks",
      "Email deadline reminders",
      "Document checklist",
      "Application tracker",
      "Blog & guides",
    ],
    missing: [
      "WhatsApp reminders",
      "SMS reminders",
      "Eligibility report PDF",
      "Priority email support",
    ],
  },
  {
    id:       "premium",
    name:     "Premium",
    desc:     "Never miss a deadline. Apply with confidence.",
    monthly:  99,
    yearly:   79,            // per month when billed yearly
    color:    T.gold,
    popular:  true,
    cta:      "Upgrade to Premium",
    ctaHref:  "/checkout",   // Razorpay checkout route
    features: [
      "Everything in Free",
      "WhatsApp deadline reminders",
      "SMS deadline reminders",
      "Eligibility report PDF (shareable)",
      "Priority email support",
      "Early access to new scholarships",
      "No ads (when/if added)",
    ],
    missing: [],
  },
]

// ── Feature comparison rows ───────────────────────────────────
const COMPARE = [
  { category: "Discovery",    features: [
    { label: "Browse all scholarships",         free: true,  premium: true  },
    { label: "Filter by category / state",      free: true,  premium: true  },
    { label: "Eligibility matching",            free: true,  premium: true  },
    { label: "New scholarship alerts",          free: false, premium: true  },
  ]},
  { category: "Reminders",    features: [
    { label: "Email reminders",                 free: true,  premium: true  },
    { label: "WhatsApp reminders",              free: false, premium: true  },
    { label: "SMS reminders",                   free: false, premium: true  },
    { label: "Custom reminder timing",          free: false, premium: true  },
  ]},
  { category: "Application",  features: [
    { label: "Unlimited bookmarks",             free: true,  premium: true  },
    { label: "Document checklist",              free: true,  premium: true  },
    { label: "Application tracker",             free: true,  premium: true  },
    { label: "Eligibility report PDF",          free: false, premium: true  },
  ]},
  { category: "Support",      features: [
    { label: "Community blog & guides",         free: true,  premium: true  },
    { label: "Standard support",                free: true,  premium: true  },
    { label: "Priority email support",          free: false, premium: true  },
  ]},
]

const FAQS = [
  { q: "Can I cancel Premium at any time?",
    a: "Yes — cancel any time from your account settings. You keep Premium access until the end of your current billing period. No cancellation fees." },
  { q: "Is there a free trial?",
    a: "The Free plan is free forever — no credit card needed. There is no time-limited trial for Premium; upgrade when you're ready." },
  { q: "What payment methods are accepted?",
    a: "We accept all major Indian debit/credit cards, UPI (PhonePe, GPay, Paytm), and net banking via Razorpay." },
  { q: "What's the difference between email and WhatsApp reminders?",
    a: "Email reminders are sent to your registered email. WhatsApp reminders (Premium) are sent directly to your WhatsApp number — much harder to miss." },
  { q: "Will you add more features to Premium?",
    a: "Yes. Premium members get early access to new features including AI eligibility checker (coming soon) and multilingual support." },
  { q: "Is the yearly plan auto-renewed?",
    a: "Yes — yearly plans auto-renew unless you cancel before the renewal date. We email a reminder 7 days before renewal." },
]

// ── Billing toggle ────────────────────────────────────────────
function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(false)}
        className="text-[13px] font-semibold transition-colors"
        style={{ color: !yearly ? T.text : T.textMuted }}>
        Monthly
      </button>
      <motion.button
        onClick={() => onChange(!yearly)}
        className="relative w-12 h-6 rounded-full"
        style={{ background: yearly ? T.accent : "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.93 }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 rounded-full shadow"
          animate={{ x: yearly ? 26 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          style={{ background: "#fff" }}
        />
      </motion.button>
      <button onClick={() => onChange(true)}
        className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
        style={{ color: yearly ? T.text : T.textMuted }}>
        Yearly
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: T.accentDim, color: T.accent, border: `1px solid ${T.accentRing}` }}>
          Save 20%
        </span>
      </button>
    </div>
  )
}

// ── Plan card ─────────────────────────────────────────────────
function PlanCard({ plan, yearly, i }: { plan: typeof PLANS[0]; yearly: boolean; i: number }) {
  const price = yearly ? plan.yearly : plan.monthly
  const isPremium = plan.id === "premium"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.45 }}
      className="relative rounded-2xl p-7 flex flex-col"
      style={{
        background: isPremium
          ? `linear-gradient(135deg, rgba(245,158,11,0.07), rgba(245,158,11,0.03))`
          : T.bgCard,
        border: `1px solid ${isPremium ? T.goldRing : T.border}`,
        flex: 1,
      }}
    >
      {isPremium && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5
                        px-3 py-1 rounded-full text-[11px] font-bold"
          style={{ background: T.gold, color: "#020817" }}>
          <Star size={10} fill="currentColor" /> Most popular
        </div>
      )}

      <div className="mb-5">
        <p className="text-[12px] font-bold uppercase tracking-widest mb-1"
          style={{ color: plan.color }}>
          {plan.name}
        </p>
        <p className="text-[13px]" style={{ color: T.textDim }}>{plan.desc}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <AnimatePresence mode="wait">
          <motion.div key={price}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-baseline gap-1">
            <span className="text-[48px] font-black tracking-tight leading-none"
              style={{ color: plan.color }}>
              {price === 0 ? "Free" : `₹${price}`}
            </span>
            {price > 0 && (
              <span className="text-[13px]" style={{ color: T.textMuted }}>
                /mo{yearly ? " · billed yearly" : ""}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
        {yearly && price > 0 && (
          <p className="text-[12px] mt-1" style={{ color: T.textMuted }}>
            ₹{price * 12}/year · saves ₹{(plan.monthly - plan.yearly) * 12}/year
          </p>
        )}
      </div>

      {/* CTA */}
      <Link href={plan.ctaHref}
        className="flex items-center justify-center gap-2 py-3 rounded-xl
                   text-[14px] font-bold mb-6 transition-all hover:opacity-90"
        style={isPremium
          ? { background: T.gold, color: "#020817" }
          : { background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }
        }>
        {plan.cta} <ArrowRight size={14} />
      </Link>

      {/* Features */}
      <ul className="space-y-2.5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]"
            style={{ color: T.textDim }}>
            <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
            {f}
          </li>
        ))}
        {plan.missing.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]"
            style={{ color: T.textMuted }}>
            <XIcon size={14} className="flex-shrink-0 mt-0.5" style={{ color: T.textMuted }} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ── FAQ ───────────────────────────────────────────────────────
function FAQItem({ faq, i }: { faq: typeof FAQS[0]; i: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-[14px] font-semibold pr-4" style={{ color: T.text }}>
          {faq.q}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} style={{ color: T.textMuted }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
            className="overflow-hidden">
            <p className="px-5 pb-4 text-[13px] leading-relaxed pt-1"
              style={{ color: T.textDim, borderTop: `1px solid ${T.border}` }}>
              <span className="block pt-3">{faq.a}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <AppLayout noPad>
      <div style={{ background: T.bg, minHeight: "100vh" }}>

        {/* Hero */}
        <section className="pt-28 pb-16 px-5 text-center"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
              style={{ color: T.accent }}>Pricing</p>
            <h1 className="text-[44px] sm:text-[56px] font-black tracking-tighter mb-4"
              style={{ color: T.text }}>
              Simple, honest pricing
            </h1>
            <p className="text-[16px] max-w-md mx-auto mb-8" style={{ color: T.textDim }}>
              Start free. Upgrade only when you need WhatsApp reminders and advanced features.
            </p>
            <div className="flex justify-center">
              <BillingToggle yearly={yearly} onChange={setYearly} />
            </div>
          </motion.div>
        </section>

        {/* Plan cards */}
        <section className="py-16 px-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-5">
              {PLANS.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} yearly={yearly} i={i} />
              ))}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-5 mt-8">
              {[
                { icon: Shield,       label: "Secured by Razorpay"       },
                { icon: Zap,          label: "Instant activation"         },
                { icon: BookmarkCheck,label: "Cancel anytime"             },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[12px]"
                  style={{ color: T.textMuted }}>
                  <Icon size={13} style={{ color: T.accent }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 px-5"
          style={{ background: T.bgAlt, borderTop: `1px solid ${T.border}` }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[28px] font-black tracking-tight text-center mb-10"
              style={{ color: T.text }}>
              Full feature comparison
            </h2>

            <div className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${T.border}` }}>
              {/* Header */}
              <div className="grid grid-cols-3 px-5 py-3"
                style={{ background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${T.border}` }}>
                <div />
                <div className="text-center text-[12px] font-bold uppercase tracking-widest"
                  style={{ color: T.accent }}>Free</div>
                <div className="text-center text-[12px] font-bold uppercase tracking-widest"
                  style={{ color: T.gold }}>Premium</div>
              </div>

              {COMPARE.map((group) => (
                <div key={group.category}>
                  <div className="px-5 py-2.5"
                    style={{ background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${T.border}` }}>
                    <p className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: T.textMuted }}>{group.category}</p>
                  </div>
                  {group.features.map((f) => (
                    <div key={f.label}
                      className="grid grid-cols-3 px-5 py-3 items-center"
                      style={{ borderTop: `1px solid ${T.border}` }}>
                      <p className="text-[13px]" style={{ color: T.textDim }}>{f.label}</p>
                      <div className="flex justify-center">
                        {f.free
                          ? <Check size={15} style={{ color: T.accent }} />
                          : <XIcon size={15} style={{ color: T.textMuted }} />
                        }
                      </div>
                      <div className="flex justify-center">
                        {f.premium
                          ? <Check size={15} style={{ color: T.gold }} />
                          : <XIcon size={15} style={{ color: T.textMuted }} />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-5" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-[28px] font-black tracking-tight text-center mb-8"
              style={{ color: T.text }}>
              Questions about pricing
            </h2>
            <div className="space-y-2">
              {FAQS.map((f, i) => <FAQItem key={i} faq={f} i={i} />)}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-5" style={{ borderTop: `1px solid ${T.border}` }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center rounded-3xl p-10"
            style={{ background: T.goldDim, border: `1px solid ${T.goldRing}` }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: T.gold }}>Start today</p>
            <h3 className="text-[30px] font-black tracking-tight mb-3" style={{ color: T.text }}>
              Free forever, upgrade when ready
            </h3>
            <p className="text-[14px] mb-7" style={{ color: T.textDim }}>
              No credit card needed. Most students find their scholarship on the Free plan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold"
                style={{ background: T.accent, color: "#020817" }}>
                Start for free <ArrowRight size={14} />
              </Link>
              <Link href="/checkout"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold"
                style={{ background: T.goldDim, border: `1px solid ${T.goldRing}`, color: T.gold }}>
                Upgrade to Premium <Zap size={14} />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </AppLayout>
  )
}