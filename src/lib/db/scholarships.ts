import { createClient } from "@/lib/supabase/server";
import type { Scholarship } from "@/types";

export interface ScholarshipFilters {
  search?: string;
  category?: string[];
  education_level?: string[];
  state?: string;
  gender?: string;
  amount_min?: number;
  amount_max?: number;
  deadline_after?: string;
  is_featured?: boolean;
  sortBy?: "deadline" | "amount" | "created_at";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getScholarships(filters: ScholarshipFilters = {}) {
  const supabase = createClient();
  const pageSize = filters.pageSize ?? 12;
  const page = filters.page ?? 1;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("scholarships")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  // Full-text search
  if (filters.search) {
    query = query.textSearch("title, provider, description", filters.search, {
      type: "websearch",
      config: "english",
    });
  }

  // Category filter (array overlap)
  if (filters.category?.length) {
    query = query.overlaps("category", filters.category ?? []);
  }

  // Education level filter
  if (filters.education_level?.length) {
    query = query.overlaps("education_level", filters.education_level ?? []);
  }

  // State filter
  if (filters.state && filters.state !== "All India") {
    query = query.or(`state.eq.${filters.state},state.eq.All India`);
  }

  // Gender filter
  if (filters.gender && filters.gender !== "All") {
    query = query.or(`gender.eq.${filters.gender},gender.eq.All`);
  }

  // Amount range
  if (filters.amount_min) query = query.gte("amount", filters.amount_min);
  if (filters.amount_max) query = query.lte("amount", filters.amount_max);

  // Only upcoming deadlines by default
  if (filters.deadline_after) {
    query = query.gte("deadline", filters.deadline_after);
  } else {
    query = query.gte("deadline", new Date().toISOString().split("T")[0]);
  }

  // Sort
  const sortCol = filters.sortBy ?? "deadline";
  const sortOrder = filters.sortOrder ?? "asc";
  query = query.order(sortCol, { ascending: sortOrder === "asc" });

  // Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  return {
    scholarships: (data ?? []) as Scholarship[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
    error,
  };
}

export async function getScholarshipById(id: string) {
  const supabase = createClient();
  const scholarshipId = id;

  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();

  // Increment view count (fire and forget)
  if (data) {
    await supabase
      .rpc("increment_view_count", {
        scholarship_uuid: scholarshipId,
      })
      .then(() => {});
  }

  return { scholarship: data as Scholarship | null, error };
}

export async function getRelatedScholarships(
  scholarship: Scholarship,
  limit = 4,
) {
  const supabase = createClient();
  const { data } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .neq("id", scholarship.id)
    .overlaps("category", scholarship.category ?? [])
    .gte("deadline", new Date().toISOString().split("T")[0])
    .order("deadline", { ascending: true })
    .limit(limit);

  return (data ?? []) as Scholarship[];
}

interface FeaturedListingWithScholarship {
  scholarship_id: string;
  scholarships: Scholarship | null;
}

export async function getFeaturedScholarships(
  limit = 3,
): Promise<Scholarship[]> {
  const supabase = createClient();

  const { data } = await supabase
    .from("featured_listings")
    .select("scholarship_id, scholarships(*)")
    .eq("status", "active")
    .gte("ends_at", new Date().toISOString())
    .limit(limit);

  return (data ?? [])
    .map((f: FeaturedListingWithScholarship) => f.scholarships)
    .filter((s): s is Scholarship => Boolean(s));
}
