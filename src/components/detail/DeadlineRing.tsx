"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/detail/DeadlineRing.tsx
//
// GSAP-animated SVG ring that draws itself on mount.
// Color shifts: green → amber → red based on days remaining.
// Shows day count in center, urgency label below.
//
// USAGE:
//   <DeadlineRing deadline="2025-10-31" />
// ─────────────────────────────────────────────────────────────

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"

// ── Helpers ───────────────────────────────────────────────────
function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 864e5)
}

function formatDeadline(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function getConfig(days: number) {
  if (days < 0)  return { color: "#6b7280", glow: "#6b72804d", label: "Deadline passed",   pct: 0    }
  if (days <= 7) return { color: "#f87171", glow: "#f871714d", label: "Closing very soon!", pct: 0.08 }
  if (days <= 30)return { color: "#fbbf24", glow: "#fbbf244d", label: "Closing this month", pct: Math.min(days / 90, 0.4) }
  return               { color: "#34d399", glow: "#34d3994d", label: "Open",                pct: Math.min(days / 90, 1)   }
}

// ── Component ─────────────────────────────────────────────────
interface DeadlineRingProps {
  deadline:  string
  size?:     number   // px, default 120
  stroke?:   number   // ring thickness, default 6
}

export default function DeadlineRing({
  deadline,
  size   = 120,
  stroke = 6,
}: DeadlineRingProps) {
  const arcRef  = useRef<SVGCircleElement>(null)
  const glowRef = useRef<SVGCircleElement>(null)

  const days   = daysUntil(deadline)
  const cfg    = getConfig(days)
  const cx     = size / 2
  const cy     = size / 2
  const r      = (size - stroke * 2) / 2 - 2
  const circ   = 2 * Math.PI * r
  const target = circ * (1 - cfg.pct)

  // GSAP draw animation
  useEffect(() => {
    const els = [arcRef.current, glowRef.current].filter(Boolean)
    gsap.fromTo(
      els,
      { strokeDashoffset: circ },
      {
        strokeDashoffset: target,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.3,
      }
    )
  }, [circ, target])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1    }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3"
    >
      {/* SVG ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden
        >
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={stroke}
          />

          {/* Glow arc (blurred duplicate) */}
          <circle
            ref={glowRef}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={cfg.glow}
            strokeWidth={stroke + 4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            style={{ filter: "blur(4px)" }}
          />

          {/* Main arc */}
          <circle
            ref={arcRef}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={cfg.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {days < 0 ? (
            <span className="text-[11px] font-semibold text-white/30">Closed</span>
          ) : (
            <>
              <span
                className="text-[28px] font-bold leading-none tabular-nums"
                style={{ color: cfg.color }}
              >
                {days > 999 ? "∞" : days}
              </span>
              <span className="text-[10px] text-white/30 mt-0.5">days</span>
            </>
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="text-center">
        <p
          className="text-[12px] font-semibold"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </p>
        <p className="text-[11px] text-white/30 mt-0.5">
          {formatDeadline(deadline)}
        </p>
      </div>
    </motion.div>
  )
}