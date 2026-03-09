import { SITE_URL } from "../config"


// ─────────────────────────────────────────────────────────────
// FILE: src/components/seo/WebsiteJsonLd.tsx
//
// Sitewide JSON-LD — add to root layout.
// Enables Google Sitelinks Searchbox in search results.
//
// USAGE (in src/app/layout.tsx <body>):
//   import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd"
//   <WebsiteJsonLd />
// ─────────────────────────────────────────────────────────────

export function WebsiteJsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        // "@id": `${SITE_URL}#website`,
        "name": "ScholarPath",
        "url": SITE_URL,
        "description": "India's scholarship discovery platform",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${SITE_URL}/scholarships?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
        "publisher": {
            "@type": "Organization",
            "name": "ScholarPath",
            "inLanguage": "en-IN",
            "url": SITE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/icon.png`,
                "width": 512,
                "height": 512,
            },
            "sameAs": [
                "https://twitter.com/scholarpath_in",
                "https://github.com/scholarpath",
            ],
        },
    }

    return (
        <script
            key="scholarship-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}