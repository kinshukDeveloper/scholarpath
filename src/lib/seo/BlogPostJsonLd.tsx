import { SITE_URL } from "../config"
// ─────────────────────────────────────────────────────────────
// FILE: src/components/seo/BlogPostJsonLd.tsx
//
// JSON-LD for blog posts — enables Google Article rich results.
//
// USAGE (in blog post page):
//   import { BlogPostJsonLd } from "@/components/seo/BlogPostJsonLd"
//   <BlogPostJsonLd post={post} />
// ─────────────────────────────────────────────────────────────

interface BlogPost {
  title:        string
  slug:         string
  excerpt:      string
  cover_url:    string | null
  author_name:  string
  published_at: string
}

export function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const schema = {
    "@context":          "https://schema.org",
    "@type":             "Article",
    "headline":          post.title,
    "description":       post.excerpt,
    "url":               `${SITE_URL}/blog/${post.slug}`,
    "datePublished":     new Date(post.published_at).toISOString(),
    "dateModified":      new Date(post.published_at).toISOString(),
    "author": {
      "@type": "Person",
      "name":  post.author_name,
    },
    "publisher": {
      "@type": "Organization",
      "name":  "ScholarPath",
      "logo": {
        "@type": "ImageObject",
        "url":   `${SITE_URL}/icon.png`,
      },
    },
    "image": post.cover_url ?? `${SITE_URL}/og-default.png`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id":   `${SITE_URL}/blog/${post.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}


