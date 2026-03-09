"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function usePlan() {
  const [plan,     setPlan]     = useState<"free" | "premium">("free")
  const [loading,  setLoading]  = useState(true)
  const [expiresAt,setExpiresAt] = useState<Date | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("profiles")
        .select("plan, plan_expires_at")
        .eq("id", user.id)
        .single()

      const exp = data?.plan_expires_at ? new Date(data.plan_expires_at) : null
      const active = data?.plan === "premium" && exp && exp > new Date()

      setPlan(active ? "premium" : "free")
      setExpiresAt(exp)
      setLoading(false)
    })
  }, [supabase])

  return {
    plan,
    isPremium:  plan === "premium",
    isFree:     plan === "free",
    expiresAt,
    loading,
  }
}
