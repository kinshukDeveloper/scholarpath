"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/(dashboard)/dashboard/page.tsx
//
// Composes: DashboardLayout + StatsRow + all 4 widgets
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout    from "@/components/layout/DashboardLayout"
import StatsRow           from "@/components/dashboard/StatsRow"
import {
  UpcomingDeadlines,
  RecentlyViewed,
  ApplicationTracker,
  EligibilityFeed,
} from "@/components/dashboard/widgets"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [name,   setName]   = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      setName(user.user_metadata?.full_name?.split(" ")[0] ?? "")
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hour    = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Your scholarship overview"
    >
      <div className="space-y-8 max-w-5xl">

        {/* Greeting */}
        <div>
          <h2 className="text-[22px] font-bold text-white tracking-tight">
            {greeting}{name ? `, ${name}` : ""} 👋
          </h2>
          <p className="text-[13px] text-white/35 mt-1">
            Here&apos;s what&apos;s happening with your scholarships.
          </p>
        </div>

        {/* Stats */}
        {userId && <StatsRow userId={userId} />}

        {/* Widget grid */}
        {userId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <UpcomingDeadlines  userId={userId} />
            <EligibilityFeed    userId={userId} />
            <ApplicationTracker userId={userId} />
            <RecentlyViewed />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}