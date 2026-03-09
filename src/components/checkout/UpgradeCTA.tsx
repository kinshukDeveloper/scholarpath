"use client"
import Link from "next/link"
import { Zap, Lock } from "lucide-react"

export function UpgradeCTA({ feature }: { feature?: string }) {
  return (
    <div className="rounded-2xl p-5 text-center"
      style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)" }}>
      <Lock size={20} style={{ color: "#f59e0b", margin: "0 auto 8px" }} />
      <p style={{ color: "#f8fafc", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
        {feature ?? "This feature"} is Premium
      </p>
      <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 13, marginBottom: 16 }}>
        Upgrade to get WhatsApp reminders, eligibility reports, and more.
      </p>
      <Link href="/pricing"
        style={{ background: "#f59e0b", color: "#020817", padding: "10px 20px",
                 borderRadius: 12, fontSize: 13, fontWeight: 700,
                 display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Zap size={13} /> Upgrade — ₹99/month
      </Link>
    </div>
  )
}