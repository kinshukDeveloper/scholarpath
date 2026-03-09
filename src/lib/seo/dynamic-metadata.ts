// ─────────────────────────────────────────────────────────────
// FILE: src/lib/seo/dynamic-metadata.ts
//
// generateMetadata() for dynamic routes:
//   /scholarships/[id]    → ScholarshipMetadata
//   /blog/[slug]          → BlogPostMetadata
//
// USAGE — paste into the route file as a named export:
//
//   // src/app/scholarships/[id]/page.tsx
//   export { generateScholarshipMetadata as generateMetadata }
//     from "@/lib/seo/dynamic-metadata"
//
//   // src/app/blog/[slug]/page.tsx
//   export { generateBlogMetadata as generateMetadata }
//     from "@/lib/seo/dynamic-metadata"
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { createClient }  from "@/lib/supabase/server"
import { SITE_NAME, SITE_URL } from "../config"

// ── Helpers ───────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} lakh`
  if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}k`
  return `₹${n}`
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 864e5)
}

// ─────────────────────────────────────────────────────────────
// SCHOLARSHIP DETAIL — /scholarships/[id]
// ─────────────────────────────────────────────────────────────
export async function generateScholarshipMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = await createClient()
  const { data: s } = await supabase
    .from("scholarships")
    .select("id, title, provider, amount, deadline, description, category, state, education_level")
    .eq("id", params.id)
    .single()

  if (!s) {
    return {
      title:       "Scholarship Not Found",
      description: "This scholarship could not be found on ScholarPath.",
      robots:      { index: false, follow: false },
    }
  }

  const days     = daysUntil(s.deadline)
  const amount   = fmt(s.amount)
  const cats     = (s.category ?? []).join(", ")
  const eduLevels= (s.education_level ?? []).join(", ")

  const title = `${s.title} — ${amount}/year | ScholarPath`
  const desc  = [
    `${s.title} by ${s.provider}.`,
    `Award: ${amount} per year.`,
    cats     ? `For: ${cats} students.`       : "",
    eduLevels? `Education: ${eduLevels}.`      : "",
    s.state && s.state !== "All India" ? `State: ${s.state}.` : "Available across India.",
    days > 0 ? `Deadline in ${days} days.`   : "Deadline has passed.",
    s.description ? s.description.slice(0, 100) + "…" : "",
  ].filter(Boolean).join(" ").slice(0, 160)

  // Dynamic OG image URL (handled by /api/og route below)
  const ogImg = `${SITE_URL}/api/og?title=${encodeURIComponent(s.title)}&amount=${encodeURIComponent(amount)}&provider=${encodeURIComponent(s.provider)}&days=${days}`

  return {
    title,
    description: desc,

    alternates: {
      canonical: `${SITE_URL}/scholarships/${s.id}`,
    },

    openGraph: {
      title,
      description: desc,
      url:         `${SITE_URL}/scholarships/${s.id}`,
      siteName:    SITE_NAME,
      locale:      "en_IN",
      type:        "article",
      images:      [{ url: ogImg, width: 1200, height: 630, alt: s.title }],
    },

    twitter: {
      card:        "summary_large_image",
      title,
      description: desc,
      images:      [ogImg],
    },
  }
}

// ─────────────────────────────────────────────────────────────
// BLOG POST — /blog/[slug]
// ─────────────────────────────────────────────────────────────
export async function generateBlogMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_url, category, published_at, author_name")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single()

  if (!post) {
    return {
      title:  "Post Not Found",
      robots: { index: false, follow: false },
    }
  }

  const title    = `${post.title} | ScholarPath Blog`
  const desc     = post.excerpt?.slice(0, 160) ?? ""
  const ogImg    = post.cover_url ?? `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&type=blog`
  const pubDate  = post.published_at ? new Date(post.published_at).toISOString() : new Date().toISOString()

  return {
    title,
    description: desc,

    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },

    openGraph: {
      title,
      description: desc,
      url:         `${SITE_URL}/blog/${post.slug}`,
      siteName:    SITE_NAME,
      locale:      "en_IN",
      type:        "article",
      publishedTime: pubDate,
      authors:     [post.author_name ?? SITE_NAME],
      images:      [{ url: ogImg, width: 1200, height: 630, alt: post.title }],
    },

    twitter: {
      card:        "summary_large_image",
      title,
      description: desc,
      images:      [ogImg],
    },
  }
}