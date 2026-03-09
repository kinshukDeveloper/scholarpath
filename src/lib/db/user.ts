import { createClient } from "@/lib/supabase/server"
import type { Profile, Bookmark, Reminder, Application } from "@/types"

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data as Profile | null
}

export async function getUserBookmarks(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*, scholarships(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return { bookmarks: (data ?? []) as Bookmark[], error }
}

export async function isBookmarked(userId: string, scholarshipId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from("bookmarks")
    .select("id")
    .match({ user_id: userId, scholarship_id: scholarshipId })
    .single()

  return !!data
}

export async function toggleBookmark(userId: string, scholarshipId: string) {
  const supabase = createClient()
  const already  = await isBookmarked(userId, scholarshipId)

  if (already) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .match({ user_id: userId, scholarship_id: scholarshipId })
    return { bookmarked: false, error }
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .insert([{ user_id: userId, scholarship_id: scholarshipId }])
    return { bookmarked: true, error }
  }
}

export async function getUserReminders(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reminders")
    .select("*, scholarships(id, title, provider, amount, deadline)")
    .eq("user_id", userId)
    .order("remind_at", { ascending: true })

  return { reminders: (data ?? []) as Reminder[], error }
}

export async function getUserApplications(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("applications")
    .select("*, scholarships(*)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  return { applications: (data ?? []) as Application[], error }
}

export function isPremiumActive(profile: Profile): boolean {
  if (profile.plan !== "premium") return false
  if (!profile.plan_expires_at) return false
  return new Date(profile.plan_expires_at) > new Date()
}
