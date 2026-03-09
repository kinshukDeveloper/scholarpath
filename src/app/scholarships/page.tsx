"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/app/scholarships/page.tsx  (UPDATED)
//
// Now fully wired:
//   SearchBar + FilterSidebar + ActiveFilterBar + ScholarshipGrid
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { SlidersHorizontal } from "lucide-react"
import AppLayout        from "@/components/layout/AppLayout"
import SearchBar        from "@/components/scholarships/SearchBar"
import ScholarshipGrid  from "@/components/scholarships/ScholarshipGrid"
import FilterSidebar from "@/components/filters/FilterSidebar"
import ActiveFilterBar from "@/components/filters/ActiveFilterbar"

import type { ScholarshipFilters } from "@/types"

export default function ScholarshipsPage() {
  const [filters,     setFilters]     = useState<ScholarshipFilters>({})
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const handleSearch = useCallback((q: string) => {
    setFilters(f => ({ ...f, search: q || undefined }))
  }, [])

  // Count non-search active filters for mobile badge
  const {...nonSearch } = filters
  const mobileCount = Object.values(nonSearch as Record<string, unknown>).filter((v) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v)
  ).length

  return (
    <AppLayout noPad>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-widest uppercase
                        text-emerald-400/70 mb-2">
            Scholarships
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white
                         tracking-tight mb-2">
            Find your{" "}
            <span className="text-emerald-400">scholarship</span>
          </h1>
          <p className="text-[14px] text-white/35">
            Updated weekly · Smart eligibility filters · Never miss a deadline
          </p>
        </div>

        {/* Search + mobile filter button */}
        <div className="flex items-center gap-3 mb-3">
          <SearchBar
            onSearch={handleSearch}
            className="flex-1 max-w-xl"
          />

          {/* Mobile filter toggle */}
          <motion.button
            onClick={() => setMobileOpen(true)}
            whileTap={{ scale: 0.95 }}
            className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl
                        text-[13px] font-medium ring-1 flex-shrink-0
                        transition-colors
                        ${mobileCount > 0
                          ? "bg-emerald-500/10 ring-emerald-500/30 text-emerald-400"
                          : "bg-white/[0.04] ring-white/[0.08] text-white/50"
                        }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {mobileCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full
                               bg-emerald-500 text-slate-950 text-[10px]
                               font-bold flex items-center justify-center">
                {mobileCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Active filter pills */}
        <ActiveFilterBar
          filters={filters}
          onChange={setFilters}
          className="mb-2"
        />

        {/* Body: sidebar + grid */}
        <div className="flex gap-6 mt-4">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Grid */}
          <ScholarshipGrid filters={filters} className="flex-1 min-w-0" />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterSidebar
        filters={filters}
        onChange={setFilters}
        mobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </AppLayout>
  )
}