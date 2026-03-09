// ─────────────────────────────────────────────────────────────
// FILE: src/app/robots.ts
//
// robots.txt — tells Google what to crawl and where the sitemap is.
// ─────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",    // private user pages
          "/api/",          // API routes
          "/admin/",        // admin panel
          "/settings/",
          "/saved/",
          "/applications/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host:    SITE_URL,
  }
}


