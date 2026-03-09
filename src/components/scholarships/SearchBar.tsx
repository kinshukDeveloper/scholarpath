"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/scholarships/SearchBar.tsx
//
// Debounced search input with clear button + keyboard shortcut.
// Calls onSearch after 300ms idle to avoid hammering Supabase.
//
// USAGE:
//   <SearchBar onSearch={(q) => setFilters(f => ({ ...f, search: q }))} />
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Command } from "lucide-react"

interface SearchBarProps {
  onSearch:     (query: string) => void
  placeholder?: string
  debounceMs?:  number
  className?:   string
}

export default function SearchBar({
  onSearch,
  placeholder = "Search scholarships, providers…",
  debounceMs  = 300,
  className   = "",
}: SearchBarProps) {
  const [value,   setValue]   = useState("")
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => onSearch(value.trim()), debounceMs)
    return () => clearTimeout(t)
  }, [value, debounceMs, onSearch])

  // ⌘K global shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape" && focused) {
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [focused])

  function clear() {
    setValue("")
    onSearch("")
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 1px rgba(16,185,129,0.35), 0 0 0 4px rgba(16,185,129,0.05)"
            : "0 0 0 1px rgba(255,255,255,0.07)",
        }}
        transition={{ duration: 0.18 }}
        className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3"
      >
        {/* Icon */}
        <motion.div
          animate={{ color: focused ? "rgb(52 211 153)" : "rgba(255,255,255,0.2)" }}
          transition={{ duration: 0.18 }}
        >
          <Search size={15} />
        </motion.div>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-white
                     placeholder:text-white/25 outline-none caret-emerald-400"
        />

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1   }}
              exit={{    opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={clear}
              className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center
                         justify-center hover:bg-white/[0.14] transition-colors"
            >
              <X size={11} className="text-white/50" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ⌘K hint — shown when empty + unfocused */}
        <AnimatePresence>
          {!value && !focused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="hidden sm:flex items-center gap-1 flex-shrink-0"
            >
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md
                              bg-white/[0.05] border border-white/[0.08]
                              text-[10px] text-white/20 font-mono">
                <Command size={9} />K
              </kbd>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}