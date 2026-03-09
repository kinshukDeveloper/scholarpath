"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/blog/page.tsx
//
// Blog listing page:
//   ✦ Hero with search
//   ✦ Category / tag filter chips
//   ✦ Responsive post grid (featured large + smaller cards)
//   ✦ Newsletter signup CTA
//
// Posts are fetched from Supabase `blog_posts` table.
// Schema (add to your migration):
//   blog_posts(id, title, slug, excerpt, content, cover_url,
//              category, tags[], reading_time, published_at,
//              is_featured, is_published, author_name, author_avatar)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, ArrowRight, BookOpen, Mail, Check } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"

// ── Tokens ────────────────────────────────────────────────────
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

const CATEGORIES = ["All", "Scholarship Tips", "Guides", "Government Schemes", "Success Stories", "News"]

// ── Types ─────────────────────────────────────────────────────
interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_url: string | null
  category: string
  tags: string[]
  reading_time: number
  published_at: string
  is_featured: boolean
  author_name: string
}

// ── Mock data (replace with Supabase fetch) ───────────────────
const MOCK_POSTS: Post[] = [
  {
    id: "1", slug: "how-to-apply-nsp-scholarship",
    title: "How to Apply for NSP Scholarship 2025 — Complete Guide",
    excerpt: "The National Scholarship Portal can be confusing. Here's a step-by-step walkthrough to apply successfully before the deadline.",
    cover_url: null, category: "Guides", tags: ["NSP", "Central", "How-to"],
    reading_time: 7, published_at: "2025-09-01", is_featured: true, author_name: "ScholarPath Team",
  },
  {
    id: "2", slug: "top-scholarships-sc-students",
    title: "Top 10 Scholarships for SC Students in 2025",
    excerpt: "A curated list of the best central and state-level scholarships available specifically for Scheduled Caste students.",
    cover_url: null, category: "Scholarship Tips", tags: ["SC", "Top 10"],
    reading_time: 5, published_at: "2025-08-22", is_featured: false, author_name: "ScholarPath Team",
  },
  {
    id: "3", slug: "pm-scholarship-success-story",
    title: "How Priya Won the PM Scholarship — Her Full Journey",
    excerpt: "Priya from Maharashtra was about to give up when she found ScholarPath. Three months later, she had ₹25,000 in her account.",
    cover_url: null, category: "Success Stories", tags: ["PM Scholarship", "Story"],
    reading_time: 4, published_at: "2025-08-15", is_featured: false, author_name: "ScholarPath Team",
  },
  {
    id: "4", slug: "aicte-pragati-2025",
    title: "AICTE Pragati Scholarship 2025 — Everything You Need to Know",
    excerpt: "₹50,000 for female engineering students. Deadline, eligibility, required documents, and how to apply — all in one place.",
    cover_url: null, category: "Government Schemes", tags: ["AICTE", "Female", "Engineering"],
    reading_time: 6, published_at: "2025-08-10", is_featured: false, author_name: "ScholarPath Team",
  },
  {
    id: "5", slug: "scholarship-mistakes-to-avoid",
    title: "7 Mistakes That Get Scholarship Applications Rejected",
    excerpt: "Wrong documents, missed fields, and unclear income proofs — here are the most common reasons applications fail.",
    cover_url: null, category: "Scholarship Tips", tags: ["Tips", "Application"],
    reading_time: 5, published_at: "2025-08-05", is_featured: false, author_name: "ScholarPath Team",
  },
  {
    id: "6", slug: "budget-2025-education-schemes",
    title: "Budget 2025 — New Education Schemes for Students",
    excerpt: "The Union Budget announced three new scholarship schemes. Here's what they mean for students and when to apply.",
    cover_url: null, category: "News", tags: ["Budget", "Government", "2025"],
    reading_time: 4, published_at: "2025-07-28", is_featured: false, author_name: "ScholarPath Team",
  },
]

// ── Skeleton ──────────────────────────────────────────────────
function PostSkeleton({ large = false }) {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
      <div style={{ height: large ? 220 : 160, background: "rgba(255,255,255,0.06)" }} />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-5 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="h-3 w-full rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="h-3 w-2/3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  )
}

// ── Post card ─────────────────────────────────────────────────
function PostCard({ post, large = false, index = 0 }: {
  post: Post; large?: boolean; index?: number
}) {
  const catColor = {
    "Guides": "#60a5fa",
    "Scholarship Tips": "#34d399",
    "Government Schemes": "#f59e0b",
    "Success Stories": "#c084fc",
    "News": "#fb7185",
  }[post.category] ?? T.accent

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full rounded-2xl overflow-hidden
                                                    transition-colors"
        style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>

        {/* Cover image placeholder */}
        <div className="relative overflow-hidden"
          style={{ height: large ? 220 : 160 }}>
          {post.cover_url ? (
            <Image src={post.cover_url} alt={post.title} fill className="object-cover
              transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${catColor}12, ${catColor}06)` }}>
              <BookOpen size={large ? 32 : 24} style={{ color: catColor, opacity: 0.4 }} />
            </div>
          )}

          {/* Featured badge */}
          {post.is_featured && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1
                             rounded-full uppercase tracking-wide"
              style={{
                background: T.accentDim, color: T.accent, border: `1px solid ${T.accentRing}`,
                backdropFilter: "blur(8px)"
              }}>
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className={`p-5 ${large ? "p-6" : ""}`}>
          {/* Category + read time */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: catColor + "14", color: catColor }}>
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px]"
              style={{ color: T.textMuted }}>
              <Clock size={10} />{post.reading_time} min read
            </span>
          </div>

          {/* Title */}
          <h2 className={`font-bold leading-snug mb-2 line-clamp-2
                          group-hover:opacity-80 transition-opacity
                          ${large ? "text-[18px]" : "text-[14px]"}`}
            style={{ color: T.text }}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-[13px] leading-relaxed line-clamp-2 mb-4"
            style={{ color: T.textDim }}>
            {post.excerpt}
          </p>

          {/* Tags + date */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  style={{ background: T.bgAlt, border: `1px solid ${T.border}`, color: T.textMuted }}>
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[11px]" style={{ color: T.textMuted }}>
              {new Date(post.published_at).toLocaleDateString("en-IN",
                { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// ── Newsletter CTA ────────────────────────────────────────────
function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    await new Promise(r => setTimeout(r, 1000))
    setStatus("done")
  }

  return (
    <section className="py-16 px-5" style={{ borderTop: `1px solid ${T.border}` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto text-center rounded-3xl p-8 sm:p-10"
        style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: T.accentDim, border: `1px solid ${T.accentRing}` }}>
          <Mail size={20} style={{ color: T.accent }} />
        </div>
        <h3 className="text-[24px] font-black tracking-tight mb-2" style={{ color: T.text }}>
          Get new scholarships in your inbox
        </h3>
        <p className="text-[14px] mb-6" style={{ color: T.textDim }}>
          Weekly digest of new scholarships, guides, and deadline reminders. No spam.
        </p>

        {status === "done" ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold"
            style={{ background: T.accentDim, color: T.accent, border: `1px solid ${T.accentRing}` }}
          >
            <Check size={16} /> You&apos;re subscribed!
          </motion.div>
        ) : (
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl text-[14px] outline-none caret-emerald-400"
              style={{
                background: "rgba(2,8,23,0.6)",
                border: `1px solid ${T.accentRing}`,
                color: T.text,
              }}
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              disabled={status === "loading"}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[14px]
                         font-bold flex-shrink-0 disabled:opacity-60 transition-all"
              style={{ background: T.accent, color: T.bg }}
            >
              {status === "loading" ? (
                <motion.span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
              ) : (
                <>Subscribe <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </section>
  )
}

// ── Main blog listing ─────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const filtered = posts.filter(p => {
    const matchCat = category === "All" || p.category === category
    const matchSrch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrch
  })

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)

      // simulate API call
      await new Promise(r => setTimeout(r, 1200))

      setPosts(MOCK_POSTS)

      setLoading(false)
    }

    fetchPosts()
  }, [])

  const featured = filtered.find(p => p.is_featured)
  const rest = filtered.filter(p => !p.is_featured || filtered.indexOf(p) !== 0)

  return (
    <AppLayout noPad>
      <div style={{ background: T.bg, minHeight: "100vh" }}>

        {/* Header */}
        <div className="pt-24 pb-12 px-5 text-center"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3"
            style={{ color: T.accent }}>
            Blog
          </p>
          <h1 className="text-[40px] sm:text-[52px] font-black tracking-tight mb-4"
            style={{ color: T.text }}>
            Scholarship guides &{" "}
            <span style={{ color: T.accent }}>tips</span>
          </h1>
          <p className="text-[15px] max-w-md mx-auto mb-8" style={{ color: T.textDim }}>
            Practical advice, scholarship walkthroughs, and success stories —
            all written for Indian students.
          </p>

          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: T.textMuted }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-none
                         caret-emerald-400 transition-all"
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                color: T.text,
              }}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 py-10">

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                whileTap={{ scale: 0.94 }}
                className="px-3 py-1.5 rounded-xl text-[12px] font-semibold
                           transition-all duration-150"
                style={category === cat ? {
                  background: T.accentDim,
                  border: `1px solid ${T.accentRing}`,
                  color: T.accent,
                } : {
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  color: T.textMuted,
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* No results */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[15px] font-semibold" style={{ color: T.textDim }}>
                No posts found
              </p>
              <p className="text-[13px] mt-1" style={{ color: T.textMuted }}>
                Try a different search or category
              </p>
            </div>
          )}

          {/* Featured post (large) */}
          {/* Featured post */}
          <div className="mb-6">
            {loading
              ? <PostSkeleton large />
              : featured && <PostCard post={featured} large index={0} />
            }
          </div>
          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {loading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : (
              <AnimatePresence>
                {rest.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i + 1} />
                ))}
              </AnimatePresence>
            )}

          </div>
        </div>

        <NewsletterCTA />
      </div>
    </AppLayout>
  )
}