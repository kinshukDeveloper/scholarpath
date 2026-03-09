// ─────────────────────────────────────────────────────────────
// FILE: src/app/layout.tsx
//
// Root layout with:
//   ✦ Global default metadata (title template, OG, Twitter)
//   ✦ Canonical base URL
//   ✦ Google Search Console verification placeholder
//   ✦ Outfit font (already in your project)
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import {WebsiteJsonLd} from "@/lib/seo/WebsiteJsonLd"
import CookieBanner from "@/components/CookieBanner"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

// ── Site constants (centralised — change once) ────────────────
import { SITE_NAME, SITE_URL } from "@/lib/config"
export const SITE_DESC =
  "India's smartest scholarship discovery platform. Filter 500+ scholarships by eligibility, get deadline reminders, and apply with confidence."

// ── Default metadata (every page inherits + can override) ────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Title template: child pages render "PM Scholarship | ScholarPath"
  title: {
    default:  `${SITE_NAME} — Find Scholarships in India`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESC,

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Open Graph defaults (overridden per page)
  openGraph: {
    type:        "website",
    siteName:    SITE_NAME,
    locale:      "en_IN",
    url:         SITE_URL,
    title:       `${SITE_NAME} — Find Scholarships in India`,
    description: SITE_DESC,
    images: [
      {
        url:    "/og-default.png",   // 1200×630 — create in /public
        width:  1200,
        height: 630,
        alt:    "ScholarPath — Find Scholarships in India",
      },
    ],
  },

  // Twitter card
  twitter: {
    card:        "summary_large_image",
    site:        "@scholarpath_in",
    creator:     "@scholarpath_in",
    title:       `${SITE_NAME} — Find Scholarships in India`,
    description: SITE_DESC,
    images:      ["/og-default.png"],
  },

  // Search engine directives
  robots: {
    index:                    true,
    follow:                   true,
    googleBot: {
      index:                  true,
      follow:                 true,
      "max-image-preview":    "large",
      "max-snippet":          -1,
      "max-video-preview":    -1,
    },
  },

  // Google Search Console verification
  // Replace with your actual token from https://search.google.com/search-console
  verification: {
    google: "REPLACE_WITH_GSC_TOKEN",
  },

  // App manifest
  manifest: "/manifest.json",

  // Icons
  icons: {
    icon:        [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple:       [{ url: "/apple-touch-icon.png" }],
    shortcut:    "/favicon.ico",
  },

  // Keywords (less important for Google but useful for Bing/DuckDuckGo)
  keywords: [
    "scholarship India", "scholarship 2025", "NSP scholarship",
    "PM scholarship", "AICTE scholarship", "SC ST scholarship",
    "scholarship for students India", "free scholarship search",
    "scholarship deadline reminder", "ScholarPath",
  ],

  // Author
  authors: [{ name: "ScholarPath", url: SITE_URL }],
  creator: "ScholarPath",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.variable} font-sans antialiased`}>
          <WebsiteJsonLd />
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}