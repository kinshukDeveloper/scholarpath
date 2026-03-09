// ─────────────────────────────────────────────────────────────
// FILE: src/app/api/og/route.tsx
//
// Dynamic Open Graph image generator using Next.js ImageResponse.
// Generates a custom 1200×630 PNG for each scholarship and blog post.
//
// URL patterns:
//   /api/og?title=PM+Scholarship&amount=₹25K&provider=MHA&days=47
//   /api/og?title=Blog+Post+Title&type=blog
//
// This auto-generates the image Whatsapp/Twitter/LinkedIn show
// when someone shares a scholarship link.
// ─────────────────────────────────────────────────────────────

import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const title    = searchParams.get("title")    ?? "ScholarPath"
  const amount   = searchParams.get("amount")   ?? ""
  const provider = searchParams.get("provider") ?? ""
  const days     = parseInt(searchParams.get("days") ?? "-1")
  const type     = searchParams.get("type")     ?? "scholarship"

  const isBlog    = type === "blog"
  const urgColor  = days >= 0 && days <= 7  ? "#f87171"
                  : days >= 0 && days <= 30 ? "#fbbf24"
                  :                           "#34d399"
  const urgLabel  = days < 0  ? "Closed"
                  : days === 0 ? "Closing today!"
                  :              `${days} days left`

  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          display:         "flex",
          flexDirection:   "column",
          justifyContent:  "space-between",
          background:      "#020817",
          padding:         "56px 64px",
          fontFamily:      "system-ui, sans-serif",
          position:        "relative",
          overflow:        "hidden",
        }}
      >
        {/* Background glow */}
        <div style={{
          position:     "absolute",
          top:          "-100px",
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        "800px",
          height:       "500px",
          borderRadius: "50%",
          background:   "radial-gradient(ellipse, rgba(52,211,153,0.12) 0%, transparent 70%)",
        }} />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width:        "36px",
            height:       "36px",
            borderRadius: "10px",
            background:   "#34d399",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontSize:     "20px",
          }}>
            🎓
          </div>
          <span style={{ color: "#f8fafc", fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            ScholarPath
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
          {/* Category chip */}
          <div style={{
            display:      "inline-flex",
            alignItems:   "center",
            gap:          "8px",
            padding:      "6px 14px",
            borderRadius: "100px",
            background:   "rgba(52,211,153,0.12)",
            border:       "1px solid rgba(52,211,153,0.3)",
            width:        "fit-content",
          }}>
            <span style={{ color: "#34d399", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              {isBlog ? "Blog" : "Scholarship"}
            </span>
          </div>

          {/* Title */}
          <div style={{
            color:       "#f8fafc",
            fontSize:    title.length > 60 ? "36px" : "44px",
            fontWeight:  900,
            lineHeight:  1.1,
            letterSpacing: "-0.5px",
            maxWidth:    "800px",
          }}>
            {title}
          </div>

          {/* Amount + provider row (scholarship only) */}
          {!isBlog && (amount || provider) && (
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "8px" }}>
              {amount && (
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ color: "#34d399", fontSize: "40px", fontWeight: 900, letterSpacing: "-1px" }}>
                    {amount}
                  </span>
                  <span style={{ color: "rgba(248,250,252,0.4)", fontSize: "16px" }}>/year</span>
                </div>
              )}
              {provider && (
                <span style={{ color: "rgba(248,250,252,0.45)", fontSize: "18px" }}>
                  by {provider}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(248,250,252,0.3)", fontSize: "15px" }}>
            scholarpath-woad.vercel.app
          </span>

          {/* Urgency badge (scholarship only) */}
          {!isBlog && days >= 0 && (
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "8px",
              padding:      "8px 18px",
              borderRadius: "100px",
              background:   urgColor + "18",
              border:       `1px solid ${urgColor}40`,
            }}>
              <div style={{
                width:        "8px",
                height:       "8px",
                borderRadius: "50%",
                background:   urgColor,
              }} />
              <span style={{ color: urgColor, fontSize: "15px", fontWeight: 700 }}>
                {urgLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  )
}