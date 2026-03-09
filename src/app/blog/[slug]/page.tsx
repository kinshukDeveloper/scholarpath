"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/blog/[slug]/page.tsx
//
// Individual blog post page:
//   ✦ Reading progress bar (top of viewport)
//   ✦ Post header with category, author, date, read time
//   ✦ Rendered Markdown content (markdown-it)
//   ✦ Related posts sidebar
//   ✦ Newsletter CTA at the bottom
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Clock, Calendar, Share2, Check,
  BookOpen, ChevronRight, Tag
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { BlogPostJsonLd } from "@/lib/seo/BlogPostJsonLd"

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

// ── Mock post (replace with Supabase fetch by slug) ───────────
const MOCK_POST = {
  id: "1",
  slug: "how-to-apply-nsp-scholarship",
  title: "How to Apply for NSP Scholarship 2025 — Complete Guide",
  excerpt: "The National Scholarship Portal can be confusing. Here's a step-by-step walkthrough.",
  category: "Guides",
  tags: ["NSP", "Central", "How-to"],
  reading_time: 7,
  published_at: "2025-09-01",
  author_name: "ScholarPath Team",
  cover_url: null as string | null,
  content: `
## What is the NSP Scholarship?

The **National Scholarship Portal (NSP)** is India's centralised platform for central government scholarships. It hosts over 50 schemes covering Pre-Matric, Post-Matric, and Merit-based scholarships for SC, ST, OBC, Minority, and EWS students.

## Who is Eligible?

To apply on NSP, you generally need:
- Indian citizenship
- Family income below the scheme threshold (usually ₹2.5L–₹8L per annum)
- Enrolled in a recognised institution
- Aadhaar card linked to your bank account

Each scheme has its own eligibility — always read the full guidelines.

## Step-by-Step: How to Apply

### Step 1 — Register on NSP

Go to [scholarships.gov.in](https://scholarships.gov.in) and click **"New Registration"**. You'll need your Aadhaar number, bank account details, and mobile number.

### Step 2 — Log in and fill the application

After registration, log in with your application ID and password. Select the scholarship scheme you want to apply for.

### Step 3 — Fill in your details

Complete the academic details, income details, and upload required documents. Double-check everything before saving.

### Step 4 — Submit and track

Submit your application. You'll get an SMS confirmation. Track your application status under "Check Your Status".

## Common Documents Required

- Aadhaar card (mandatory)
- Previous year mark sheet
- Bonafide/enrollment certificate from institution
- Income certificate (State government issued)
- Bank passbook (showing IFSC and account number)
- Caste/category certificate (if applicable)
- Passport size photograph

## Important Tips

- Apply early — NSP closes applications strictly on the deadline.
- Make sure your Aadhaar is linked to your mobile number (OTP is required).
- Income certificates must be from the current financial year.
- Ensure your bank account is in your own name (not parents').

## Deadline

NSP typically opens in July–August and closes in October–November. Always check the official portal for exact dates.
  `.trim(),
}

const RELATED = [
  { slug: "top-scholarships-sc-students", title: "Top 10 Scholarships for SC Students in 2025", reading_time: 5, category: "Scholarship Tips" },
  { slug: "aicte-pragati-2025", title: "AICTE Pragati Scholarship 2025", reading_time: 6, category: "Government Schemes" },
  { slug: "scholarship-mistakes-to-avoid", title: "7 Mistakes That Get Scholarship Applications Rejected", reading_time: 5, category: "Scholarship Tips" },
]

// ── Reading progress bar ──────────────────────────────────────
function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const el = document.documentElement
      const pctV = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setPct(Math.min(pctV, 100))
    }
    window.addEventListener("scroll", update)
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 h-[3px] z-[60]"
      style={{
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${T.accent}, #60a5fa)`,
        transformOrigin: "left",
      }}
    />
  )
}

// ── Share button ──────────────────────────────────────────────
function ShareBtn({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.button
      onClick={share}
      whileTap={{ scale: 0.93 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px]
                 font-medium transition-colors"
      style={copied ? {
        background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent,
      } : {
        background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim,
      }}
    >
      {copied ? <><Check size={12} /> Copied!</> : <><Share2 size={12} /> Share</>}
    </motion.button>
  )
}

// ── Prose renderer (simple markdown-like) ────────────────────
function Prose({ content }: { content: string }) {
  // Very simple renderer — in production use `react-markdown` or `marked`
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-[18px] font-bold mt-8 mb-3"
          style={{ color: T.text }}>
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-[22px] font-black mt-10 mb-4"
          style={{ color: T.text }}>
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("- ")) {
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="space-y-2 my-4 pl-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[15px] leading-relaxed"
              style={{ color: T.textDim }}>
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ background: T.accent }} />
              <span dangerouslySetInnerHTML={{
                __html: item.replace(/\*\*(.*?)\*\*/g,
                  `<strong style="color:${T.text};font-weight:700">$1</strong>`)
              }} />
            </li>
          ))}
        </ul>
      )
      continue
    } else {
      const html = line
        .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${T.text};font-weight:700">$1</strong>`)
        .replace(/\[(.*?)\]\((.*?)\)/g, `<a href="$2" target="_blank" rel="noopener"
          style="color:${T.accent};text-decoration:underline;text-underline-offset:3px">$1</a>`)
      elements.push(
        <p key={i} className="text-[15px] leading-[1.9] my-4"
          style={{ color: T.textDim }}
          dangerouslySetInnerHTML={{ __html: html }} />
      )
    }
    i++
  }

  return <div className="max-w-none">{elements}</div>
}

// ── Main ──────────────────────────────────────────────────────
export default function BlogPostPage() {
  const router = useRouter()
  const post = MOCK_POST   // swap with Supabase fetch by slug

  const catColor = {
    "Guides": "#60a5fa",
    "Scholarship Tips": "#34d399",
    "Government Schemes": "#f59e0b",
    "Success Stories": "#c084fc",
    "News": "#fb7185",
  }[post.category] ?? T.accent

  return (
    <>
      <BlogPostJsonLd post={post} />
      <AppLayout noPad>
        <ReadingProgress />

        <div style={{ background: T.bg, minHeight: "100vh" }}>
          <div className="max-w-5xl mx-auto px-5 pt-24 pb-20">

            {/* Back */}
            <motion.button
              onClick={() => router.back()}
              whileHover={{ x: -2 }}
              className="flex items-center gap-1.5 text-[13px] mb-8 group transition-colors"
              style={{ color: T.textMuted }}
            >
              <ArrowLeft size={14}
                className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Blog
            </motion.button>

            <div className="flex gap-10">

              {/* Main content */}
              <article className="flex-1 min-w-0">

                {/* Category + meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-[12px] font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: catColor + "14", color: catColor }}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[12px]"
                    style={{ color: T.textMuted }}>
                    <Clock size={11} /> {post.reading_time} min read
                  </span>
                  <span className="flex items-center gap-1 text-[12px]"
                    style={{ color: T.textMuted }}>
                    <Calendar size={11} />
                    {new Date(post.published_at).toLocaleDateString("en-IN",
                      { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[28px] sm:text-[36px] font-black tracking-tight
                           leading-snug mb-6"
                  style={{ color: T.text }}
                >
                  {post.title}
                </motion.h1>

                {/* Author + share row */}
                <div className="flex items-center justify-between mb-8 pb-6"
                  style={{ borderBottom: `1px solid ${T.border}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                                  text-[14px]"
                      style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                      📝
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: T.text }}>
                        {post.author_name}
                      </p>
                      <p className="text-[11px]" style={{ color: T.textMuted }}>
                        ScholarPath
                      </p>
                    </div>
                  </div>
                  <ShareBtn title={post.title} />
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Prose content={post.content} />
                </motion.div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-10 pt-8"
                  style={{ borderTop: `1px solid ${T.border}` }}>
                  {post.tags.map(tag => (
                    <span key={tag}
                      className="inline-flex items-center gap-1 text-[12px] font-medium
                               px-3 py-1.5 rounded-xl"
                      style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textDim }}>
                      <Tag size={11} style={{ color: T.accent }} />
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              {/* Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-5">

                  {/* Related posts */}
                  <div className="rounded-2xl p-5"
                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                    <p className="text-[12px] font-bold uppercase tracking-widest mb-4"
                      style={{ color: T.textMuted }}>
                      Related articles
                    </p>
                    <div className="space-y-1">
                      {RELATED.map((r, i) => (
                        <motion.div key={r.slug}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}>
                          <Link href={`/blog/${r.slug}`}
                            className="flex items-start gap-2.5 py-3 group"
                            style={{ borderBottom: i < RELATED.length - 1 ? `1px solid ${T.border}` : "none" }}>
                            <BookOpen size={13} className="flex-shrink-0 mt-0.5"
                              style={{ color: T.accent }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-medium leading-snug line-clamp-2
                                          group-hover:opacity-70 transition-opacity"
                                style={{ color: T.text }}>
                                {r.title}
                              </p>
                              <p className="text-[11px] mt-1 flex items-center gap-1"
                                style={{ color: T.textMuted }}>
                                <Clock size={10} />{r.reading_time} min
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="rounded-2xl p-5"
                    style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
                    <p className="text-[13px] font-bold mb-1" style={{ color: T.accent }}>
                      Find your scholarship
                    </p>
                    <p className="text-[12px] mb-4" style={{ color: T.textDim }}>
                      Use our eligibility matcher to discover scholarships you qualify for.
                    </p>
                    <Link href="/scholarships"
                      className="flex items-center gap-1.5 text-[13px] font-bold
                               group transition-colors"
                      style={{ color: T.accent }}>
                      Browse now
                      <ChevronRight size={13}
                        className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  )
}