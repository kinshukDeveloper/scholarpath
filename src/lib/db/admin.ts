import { createAdminClient } from "@/lib/supabase/admin"

export async function getAdminStats() {
  const supabase = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalScholarships },
    { count: totalBookmarks },
    { count: totalReminders },
    { data: topViewed },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("scholarships").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("bookmarks").select("*", { count: "exact", head: true }),
    supabase.from("reminders").select("*", { count: "exact", head: true }).eq("sent", false),
    supabase.from("scholarships")
      .select("id, title, view_count, provider")
      .order("view_count", { ascending: false })
      .limit(5),
  ])

  return {
    totalUsers:        totalUsers ?? 0,
    totalScholarships: totalScholarships ?? 0,
    totalBookmarks:    totalBookmarks ?? 0,
    pendingReminders:  totalReminders ?? 0,
    topViewed:         topViewed ?? [],
  }
}

export async function getAllUsersAdmin(page = 1, pageSize = 20) {
  const supabase = createAdminClient()
  const from     = (page - 1) * pageSize
  const to       = from + pageSize - 1

  const { data, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  return { users: data ?? [], total: count ?? 0 }
}