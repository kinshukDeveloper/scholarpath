"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/scholarships/ScholarshipGrid.tsx
//
// Features:
//   ✦ Infinite scroll via IntersectionObserver sentinel
//   ✦ GSAP scroll reveal on every card (staggered per row)
//   ✦ Skeleton loaders on first load + next-page fetch
//   ✦ Empty state with illustration
//   ✦ Error state with retry button
//   ✦ Bookmark state managed here, passed down to cards
//
// USAGE:
//   <ScholarshipGrid filters={filters} />
//
// Props:
//   filters   — ScholarshipFilters object from FilterSidebar
//   className — optional wrapper class
// ─────────────────────────────────────────────────────────────

import {
    useState, useEffect, useRef, useCallback,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, RefreshCw, SearchX } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import ScholarshipCard, { SkeletonCard } from "./ScholarshipCard"
import type { Scholarship, ScholarshipFilters } from "@/types"

// ── Constants ─────────────────────────────────────────────────
const PAGE_SIZE = 12

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center
                 py-24 text-center"
        >
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.07]
                      flex items-center justify-center mb-5">
                {hasFilters
                    ? <SearchX size={24} className="text-white/20" />
                    : <GraduationCap size={24} className="text-white/20" />
                }
            </div>
            <p className="text-[15px] font-semibold text-white/50 mb-1.5">
                {hasFilters ? "No scholarships match your filters" : "No scholarships yet"}
            </p>
            <p className="text-[13px] text-white/25 max-w-xs">
                {hasFilters
                    ? "Try removing some filters or broadening your search"
                    : "Check back soon — new scholarships are added weekly"
                }
            </p>
        </motion.div>
    )
}

// ── Error state ───────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-20"
        >
            <p className="text-[14px] text-white/40 mb-4">
                Something went wrong loading scholarships
            </p>
            <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px]
                   font-medium bg-white/[0.04] ring-1 ring-white/[0.08]
                   text-white/50 hover:bg-white/[0.08] hover:text-white/80
                   transition-colors"
            >
                <RefreshCw size={13} /> Try again
            </button>
        </motion.div>
    )
}

// ── End of results indicator ──────────────────────────────────
function EndMarker({ count }: { count: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-full flex flex-col items-center py-10 gap-2"
        >
            <div className="flex items-center gap-3 text-[11px] text-white/20">
                <div className="h-px w-16 bg-white/[0.06]" />
                All {count} scholarships shown
                <div className="h-px w-16 bg-white/[0.06]" />
            </div>
        </motion.div>
    )
}

// ── Loading sentinel row (3 skeletons) ────────────────────────
function SkeletonRow() {
    return (
        <>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                >
                    <SkeletonCard />
                </motion.div>
            ))}
        </>
    )
}

// ── Main ScholarshipGrid ──────────────────────────────────────
interface ScholarshipGridProps {
    filters?: ScholarshipFilters
    className?: string
}

export default function ScholarshipGrid({
    filters = {},
    className = "",
}: ScholarshipGridProps) {
    const [items, setItems] = useState<Scholarship[]>([])
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)       // first page
    const [fetching, setFetching] = useState(false)      // next pages
    const [error, setError] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(0)

    const sentinelRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // ── Build Supabase query from filters ─────────────────────
    const buildQuery = useCallback((pageIndex: number) => {
        let q = supabase
            .from("scholarships")
            .select("*", { count: "exact" })
            .eq("is_active", true)

        if (filters.search)
            q = q.or(`title.ilike.%${filters.search}%,provider.ilike.%${filters.search}%`)
        if (filters.category?.length)
            q = q.overlaps("category", filters.category)
        if (filters.education_level?.length)
            q = q.overlaps("education_level", filters.education_level)
        if (filters.gender && filters.gender !== "All")
            q = q.in("gender", [filters.gender, "All"])
        if (filters.state)
            q = q.in("state", [filters.state, "All India"])
        if (filters.amount_min)
            q = q.gte("amount", filters.amount_min)
        if (filters.is_featured)
            q = q.eq("is_featured", true)

        // Sort: featured first, then by deadline
        q = q.order("is_featured", { ascending: false })
            .order("deadline", { ascending: true })

        q = q.range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1)
        return q
    }, [filters, supabase])

    // ── Fetch a page ───────────────────────────────────────────
    const fetchPage = useCallback(async (pageIndex: number, replace = false) => {
        if (pageIndex === 0) setLoading(true)
        else setFetching(true)
        setError(false)

        const { data, count, error: err } = await buildQuery(pageIndex)

        if (err) {
            setError(true)
        } else {
            const rows = data ?? []
            setItems((prev) => replace ? rows : [...prev, ...rows])
            setTotalCount(count ?? 0)
            setHasMore(rows.length === PAGE_SIZE)
        }

        setLoading(false)
        setFetching(false)
    }, [buildQuery])

    // ── Reset when filters change ──────────────────────────────
    useEffect(() => {
        setPage(0)
        setItems([])
        setHasMore(true)
        fetchPage(0, true)
    }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Load next page ─────────────────────────────────────────
    useEffect(() => {
        if (page === 0) return   // already fetched by filter effect
        fetchPage(page)
    }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── IntersectionObserver — infinite scroll ─────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !fetching && !loading) {
                    setPage((p) => p + 1)
                }
            },
            { rootMargin: "200px" }   // start fetching 200px before sentinel
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, fetching, loading])

    // ── Bookmark state — load once on mount ────────────────────
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return
            supabase
                .from("bookmarks")
                .select("scholarship_id")
                .eq("user_id", user.id)
                .then(({ data }) =>
                    setBookmarks(new Set((data ?? []).map((b) => b.scholarship_id)))
                )
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Bookmark toggle — optimistic ───────────────────────────
    async function handleBookmark(id: string) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = "/login"; return }

        // Optimistic update
        setBookmarks((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });

        if (bookmarks.has(id)) {
            await supabase.from("bookmarks")
                .delete()
                .match({ user_id: user.id, scholarship_id: id })
        } else {
            await supabase.from("bookmarks")
                .insert({ user_id: user.id, scholarship_id: id })
        }
    }

    const hasFilters = Object.values(filters as Record<string, unknown>).some((v) =>
        Array.isArray(v) ? v.length > 0 : Boolean(v)
    )

    // ── Render ─────────────────────────────────────────────────
    return (
        <div className={className}>

            {/* Results count */}
            <AnimatePresence>
                {!loading && totalCount > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[12px] text-white/25 mb-4 tabular-nums"
                    >
                        {totalCount.toLocaleString()} scholarship{totalCount !== 1 ? "s" : ""} found
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                {/* First-load skeletons */}
                {loading && <SkeletonRow />}

                {/* Error state */}
                {!loading && error && (
                    <ErrorState onRetry={() => fetchPage(page, true)} />
                )}

                {/* Empty state */}
                {!loading && !error && items.length === 0 && (
                    <EmptyState hasFilters={hasFilters} />
                )}

                {/* Cards */}
                <AnimatePresence>
                    {items.map((s, i) => (
                        <ScholarshipCard
                            key={s.id}
                            scholarship={s}
                            isBookmarked={bookmarks.has(s.id)}
                            onBookmark={handleBookmark}
                            index={i}
                            reveal={true}
                        />
                    ))}
                </AnimatePresence>

                {/* Next-page skeletons */}
                {fetching && <SkeletonRow />}

                {/* End of results */}
                {!loading && !fetching && !hasMore && items.length > 0 && (
                    <EndMarker count={totalCount} />
                )}
            </div>

            {/* Invisible sentinel — triggers next page fetch */}
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
        </div>
    )
}