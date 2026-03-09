import { SITE_URL } from "../config"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/seo/ScholarshipJsonLd.tsx
//
// JSON-LD structured data for scholarship detail pages.
// Renders as a <script type="application/ld+json"> tag.
// Google uses this to understand scholarship content and may
// display rich results in search.
//
// USAGE (in scholarship detail page):
//   import ScholarshipJsonLd from "@/components/seo/ScholarshipJsonLd"
//   ...
//   <ScholarshipJsonLd scholarship={scholarship} />
// ─────────────────────────────────────────────────────────────

import type { Scholarship } from "@/types"

interface Props {
  scholarship: Scholarship
}

export function ScholarshipJsonLd({ scholarship: s }: Props) {
  const schema = {
    "@context":   "https://schema.org",
    "@type":      "EducationalOccupationalCredential",
    "name":       s.title,
    "description": s.description ?? s.eligibility ?? `${s.title} scholarship by ${s.provider}`,
    "url":        `${SITE_URL}/scholarships/${s.id}`,
    "provider": {
      "@type": "Organization",
      "name":  s.provider,
    },
    "offers": {
      "@type":         "Offer",
      "priceCurrency": "INR",
      "price":         s.amount,
      "availability":  new Date(s.deadline) > new Date()
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "validThrough":  new Date(s.deadline).toISOString(),
      "url":           s.apply_url ?? `${SITE_URL}/scholarships/${s.id}`,
    },
    "educationalLevel": (s.education_level ?? []).join(", "),
    "inLanguage":       "en-IN",
    "areaServed":       s.state && s.state !== "All India" ? s.state : "India",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}


