// ─────────────────────────────────────────────────────────────
// FILE: src/app/sitemap.ts
//
// Next.js 14 dynamic sitemap — auto-submitted to Google.
// Covers:
//   ✦ Static pages (/, /scholarships, /about, /blog)
//   ✦ All active scholarship detail pages
//   ✦ All published blog posts
//
// Google reads this at: https://scholarpath-woad.vercel.app/sitemap.xml
// Submit it at: https://search.google.com/search-console/sitemaps
// ─────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { SITE_URL } from "@/lib/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // ── Fetch all active scholarship IDs ──────────────────────
  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("id, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })

  // ── Fetch all published blog slugs ────────────────────────
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  const now = new Date().toISOString()

  // ── Static pages ──────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              `${SITE_URL}/`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:         1.0,
    },
    {
      url:              `${SITE_URL}/scholarships`,
      lastModified:     now,
      changeFrequency:  "daily",    // scholarships update frequently
      priority:         0.95,
    },
    {
      url:              `${SITE_URL}/about`,
      lastModified:     now,
      changeFrequency:  "monthly",
      priority:         0.6,
    },
    {
      url:              `${SITE_URL}/blog`,
      lastModified:     now,
      changeFrequency:  "weekly",
      priority:         0.8,
    },
  ]

  // ── Scholarship detail pages ───────────────────────────────
  const scholarshipPages: MetadataRoute.Sitemap = (scholarships ?? []).map((s) => ({
    url:             `${SITE_URL}/scholarships/${s.id}`,
    lastModified:    s.updated_at ?? now,
    changeFrequency: "weekly" as const,
    priority:        0.85,
  }))

  // ── Blog post pages ────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url:             `${SITE_URL}/blog/${p.slug}`,
    lastModified:    p.updated_at ?? now,
    changeFrequency: "monthly" as const,
    priority:        0.7,
  }))

  return [...staticPages, ...scholarshipPages, ...blogPages]
}