import { createClient } from "@/lib/supabase/server"
import type { BlogPost } from "@/types"

export async function getBlogPosts(options: {
  category?: string
  featured?: boolean
  limit?:    number
  page?:     number
} = {}) {
  const supabase  = createClient()
  const limit     = options.limit ?? 9
  const page      = options.page  ?? 1
  const from      = (page - 1) * limit
  const to        = from + limit - 1

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (options.category && options.category !== "All") {
    query = query.eq("category", options.category)
  }
  if (options.featured) {
    query = query.eq("is_featured", true)
  }

  query = query.range(from, to)

  const { data, count, error } = await query
  return {
    posts:      (data ?? []) as BlogPost[],
    total:      count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    error,
  }
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  return { post: data as BlogPost | null, error }
}
