"use client"
import Link from "next/link"
import { WifiOff, GraduationCap, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div style={{ background: "#020817", minHeight: "100vh" }}
      className="flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <WifiOff size={32} style={{ color: "rgba(248,250,252,0.25)" }} />
        </div>
        <h1 className="text-[28px] font-black tracking-tight mb-3"
          style={{ color: "#f8fafc" }}>
          You&apos;re offline
        </h1>
        <p className="text-[14px] mb-8 leading-relaxed"
          style={{ color: "rgba(248,250,252,0.5)" }}>
          No internet connection. Your saved scholarships and
          reminders are still accessible once you reconnect.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       text-[14px] font-bold"
            style={{ background: "#34d399", color: "#020817" }}>
            <RefreshCw size={14} /> Try again
          </button>
          <Link href="/saved"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       text-[14px] font-semibold"
            style={{ background: "rgba(255,255,255,0.028)",
                     border: "1px solid rgba(255,255,255,0.07)",
                     color: "rgba(248,250,252,0.5)" }}>
            <GraduationCap size={14} /> View saved scholarships
          </Link>
        </div>
      </div>
    </div>
  )
}
