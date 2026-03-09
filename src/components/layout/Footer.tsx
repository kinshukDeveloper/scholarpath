// ─────────────────────────────────────────────────────────────
// FOOTER LINKS — update src/components/layout/Footer.tsx
// Add these links in your footer columns:
//
// Legal column:
//   /privacy-policy  → "Privacy Policy"
//   /terms           → "Terms of Use"
//   /cookie-policy   → "Cookie Policy"
//
// Company column:
//   /about           → "About"
//   /contact         → "Contact"
//   /advertise       → "Advertise"
//   /blog            → "Blog"
//
// Dashboard sidebar (for logged-in users):
//   /saved           → "Saved Scholarships"   (Bookmark icon)
//   /reminders       → "Reminders"            (Bell icon)
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// UPDATED FOOTER COMPONENT
// Replace your existing Footer.tsx with this version which
// includes all the new page links.
// ─────────────────────────────────────────────────────────────

"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

const T = {
  bg:       "#020817",
  border:   "rgba(255,255,255,0.07)",
  text:     "#f8fafc",
  textDim:  "rgba(248,250,252,0.5)",
  textMuted:"rgba(248,250,252,0.25)",
  accent:   "#34d399",
}

const FOOTER_LINKS = [
  {
    heading: "Platform",
    links: [
      { label: "Browse Scholarships", href: "/scholarships" },
      { label: "Blog",                href: "/blog"         },
      { label: "Advertise",           href: "/advertise"    },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",   href: "/about"   },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use",   href: "/terms"          },
      { label: "Cookie Policy",  href: "/cookie-policy"  },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-10 justify-between mb-12">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: T.accent }}>
                <GraduationCap size={14} color={T.bg} />
              </div>
              <span className="text-[15px] font-bold tracking-tight" style={{ color: T.text }}>
                ScholarPath
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed" style={{ color: T.textMuted }}>
              India&apos;s scholarship discovery platform. Find, track, and apply for
              scholarships you actually qualify for — free, forever.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-10">
            {FOOTER_LINKS.map(col => (
              <div key={col.heading}>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-4"
                  style={{ color: T.textMuted }}>
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href}
                        className="text-[13px] transition-colors hover:opacity-80"
                        style={{ color: T.textDim }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: `1px solid ${T.border}` }}>
          <p className="text-[12px]" style={{ color: T.textMuted }}>
            © {new Date().getFullYear()} ScholarPath. Built for Indian students. 🇮🇳
          </p>
          <p className="text-[12px]" style={{ color: T.textMuted }}>
            Made with ☕ by a solo developer
          </p>
        </div>
      </div>
    </footer>
  )
}