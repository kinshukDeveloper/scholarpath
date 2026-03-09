// ─────────────────────────────────────────────────────────────
// FILE: src/lib/seo/page-metadata.ts
//
// Centralised metadata exports for every static page.
// Import and re-export from each page:
//
//   // src/app/scholarships/page.tsx
//   export { scholarshipsMetadata as metadata } from "@/lib/seo/page-metadata"
//
// Dynamic pages (detail, blog post) use generateMetadata() instead.
// See: src/lib/seo/dynamic-metadata.ts
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { SITE_NAME,SITE_URL } from "../config"

const OG_BASE = `${SITE_URL}/og-default.png`

function og(title: string, desc: string, img = OG_BASE): Metadata["openGraph"] {
  return {
    title, description: desc,
    url:      SITE_URL,
    siteName: SITE_NAME,
    locale:   "en_IN",
    type:     "website",
    images:   [{ url: img, width: 1200, height: 630, alt: title }],
  }
}

// ── /scholarships ─────────────────────────────────────────────
export const scholarshipsMetadata: Metadata = {
  title:       "Browse Scholarships in India 2025",
  description: "Filter 500+ Indian scholarships by category (SC, ST, OBC, EWS), education level, state, and income. Updated weekly. Never miss a deadline.",
  alternates:  { canonical: `${SITE_URL}/scholarships` },
  openGraph:   og(
    "Browse Scholarships in India 2025 | ScholarPath",
    "500+ scholarships for SC, ST, OBC, EWS, and General students. Filter by state, education level, and income.",
  ),
  twitter: {
    card:  "summary_large_image",
    title: "Browse Scholarships in India 2025 | ScholarPath",
    description: "500+ scholarships filtered by eligibility. Free.",
    images: [OG_BASE],
  },
}

// ── /about ────────────────────────────────────────────────────
export const aboutMetadata: Metadata = {
  title:       "About ScholarPath",
  description: "ScholarPath is India's scholarship discovery platform built by a solo developer to help students find and apply for scholarships they actually qualify for.",
  alternates:  { canonical: `${SITE_URL}/about` },
  openGraph:   og(
    "About ScholarPath | Built for Indian Students",
    "The story behind ScholarPath — why it was built and who built it.",
  ),
}

// ── /blog ─────────────────────────────────────────────────────
export const blogMetadata: Metadata = {
  title:       "Scholarship Guides & Tips",
  description: "Step-by-step scholarship application guides, eligibility tips, government scheme explainers, and student success stories — all for Indian students.",
  alternates:  { canonical: `${SITE_URL}/blog` },
  openGraph:   og(
    "Scholarship Guides & Tips | ScholarPath Blog",
    "How-to guides, tips, and success stories for Indian scholarship applicants.",
  ),
}

// ── /login ────────────────────────────────────────────────────
export const loginMetadata: Metadata = {
  title:       "Sign In",
  description: "Sign in to ScholarPath to save scholarships, set deadline reminders, and track your applications.",
  alternates:  { canonical: `${SITE_URL}/login` },
  robots:      { index: false, follow: false },  // don't index auth pages
}

// ── /register ────────────────────────────────────────────────
export const registerMetadata: Metadata = {
  title:       "Create Free Account",
  description: "Create your free ScholarPath account to get matched to scholarships you qualify for and never miss a deadline.",
  alternates:  { canonical: `${SITE_URL}/register` },
  robots:      { index: false, follow: false },
}

// ── /dashboard ───────────────────────────────────────────────
export const dashboardMetadata: Metadata = {
  title:       "Dashboard",
  description: "Your ScholarPath dashboard — saved scholarships, upcoming deadlines, and application tracking.",
  robots:      { index: false, follow: false },
}

// ── /bookmarks ───────────────────────────────────────────────
export const bookmarksMetadata: Metadata = {
  title:       "Saved Scholarships",
  description: "Your saved scholarships on ScholarPath.",
  robots:      { index: false, follow: false },
}