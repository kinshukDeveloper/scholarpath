"use client"

// ─────────────────────────────────────────────────────────────
// FILE:  src/components/layout/Navbar.tsx
// USAGE: Drop into any page — handles auth state, scroll
//        behaviour, and mobile menu automatically.
//
// DEPS:  npm install framer-motion
//        npm install lucide-react
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  Sparkles,
  Search,
  Bell,
  Bookmark,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Settings,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// ── Types ────────────────────────────────────────────────────
interface NavLink {
  href: string
  label: string
  icon?: React.ElementType
}

// ── Constants ────────────────────────────────────────────────
const PUBLIC_LINKS: NavLink[] = [
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/blog",         label: "Blog" },
  { href: "/about",        label: "About" },
]

const USER_MENU_LINKS: NavLink[] = [
  { href: "/dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { href: "/bookmarks",    label: "Saved",        icon: Bookmark },
  { href: "/reminders",    label: "Reminders",    icon: Bell },
  { href: "/settings",     label: "Settings",     icon: Settings },
]

// ── Logo ─────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                      flex items-center justify-center shadow-lg shadow-emerald-900/40
                      group-hover:shadow-emerald-700/50 transition-shadow duration-300">
        <Sparkles size={14} className="text-white" />
      </div>
      <span className="font-bold text-white text-[15px] tracking-tight leading-none">
        Scholar<span className="text-emerald-400">Path</span>
      </span>
    </Link>
  )
}

// ── NavItem ───────────────────────────────────────────────────
function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className="relative text-[13px] font-medium px-1 py-0.5 transition-colors duration-200
                 text-white/50 hover:text-white/90"
    >
      {label}
      {/* Active underline */}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute -bottom-0.5 left-0 right-0 h-px bg-emerald-400 rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

// ── NotificationDot ───────────────────────────────────────────
function NotificationDot({ count }: { count: number }) {
  if (!count) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full
                     bg-emerald-500 text-[9px] font-bold text-white flex items-center
                     justify-center leading-none ring-2 ring-slate-950">
      {count > 9 ? "9+" : count}
    </span>
  )
}

// ── UserDropdown ──────────────────────────────────────────────
function UserDropdown({
  user,
  onSignOut,
}: {
  user: SupabaseUser
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const name  = user.user_metadata?.full_name as string | undefined
  const email = user.email ?? ""
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? "U"

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors
                   hover:bg-white/5 group"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-700/30
                        border border-emerald-500/20 flex items-center justify-center
                        text-[11px] font-bold text-emerald-300">
          {initials}
        </div>
        <span className="text-[13px] font-medium text-white/60 group-hover:text-white/90
                         transition-colors hidden sm:block max-w-[100px] truncate">
          {name ?? email.split("@")[0]}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} className="text-white/30" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2 w-56 z-50 rounded-2xl overflow-hidden
                         bg-slate-900 border border-white/[0.07] shadow-2xl shadow-black/60"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <p className="text-[13px] font-semibold text-white truncate">
                  {name ?? "My Account"}
                </p>
                <p className="text-[11px] text-white/35 truncate mt-0.5">{email}</p>
              </div>

              {/* Links */}
              <div className="py-1.5">
                {USER_MENU_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-white/55
                               hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    {Icon && <Icon size={14} className="text-white/30" />}
                    {label}
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div className="border-t border-white/[0.06] py-1.5">
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px]
                             text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06]
                             transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── SearchButton ──────────────────────────────────────────────
function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl
                 bg-white/[0.04] border border-white/[0.07] text-white/35
                 text-[12px] hover:bg-white/[0.07] hover:text-white/60
                 transition-all duration-200 group"
    >
      <Search size={13} />
      <span>Search scholarships…</span>
      <kbd className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06]
                      border border-white/[0.08] font-mono text-white/25
                      group-hover:text-white/40">
        ⌘K
      </kbd>
    </button>
  )
}

// ── MobileMenu (imported separately, shown inline here) ───────
function MobileMenuPanel({
  isOpen,
  user,
  pathname,
  onSignOut,
  onClose,
}: {
  isOpen: boolean
  user: SupabaseUser | null
  pathname: string
  onSignOut: () => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{    x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-40 w-72
                       bg-slate-950 border-l border-white/[0.07]
                       flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4
                            border-b border-white/[0.06]">
              <Logo />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center
                           justify-center hover:bg-white/[0.08] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Nav links */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-semibold tracking-widest text-white/25
                            uppercase px-2 mb-2">
                Browse
              </p>
              {PUBLIC_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                              text-[13px] font-medium transition-colors
                              ${pathname.startsWith(href)
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                              }`}
                >
                  {Icon && <Icon size={15} />}
                  {label}
                </Link>
              ))}
            </div>

            {user && (
              <div className="px-4 pt-2 pb-2">
                <p className="text-[10px] font-semibold tracking-widest text-white/25
                              uppercase px-2 mb-2">
                  My Account
                </p>
                {USER_MENU_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                                text-[13px] font-medium transition-colors
                                ${pathname.startsWith(href)
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                                }`}
                  >
                    {Icon && <Icon size={15} />}
                    {label}
                  </Link>
                ))}
              </div>
            )}

            {/* Auth CTA */}
            <div className="mt-auto px-4 pb-6 pt-4 border-t border-white/[0.06]">
              {user ? (
                <button
                  onClick={() => { onSignOut(); onClose() }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-red-500/10 border border-red-500/20 text-red-400
                             text-[13px] font-medium hover:bg-red-500/15 transition-colors"
                >
                  <LogOut size={14} /> Sign out
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="w-full text-center py-3 rounded-xl border border-white/10
                               text-white/60 text-[13px] font-medium
                               hover:bg-white/[0.04] transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="w-full text-center py-3 rounded-xl
                               bg-emerald-500 text-slate-950 text-[13px] font-bold
                               hover:bg-emerald-400 transition-colors"
                  >
                    Get started free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Main Navbar ───────────────────────────────────────────────
export default function Navbar() {
  const [user,        setUser]        = useState<SupabaseUser | null>(null)
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [notifications, setNotifications] = useState(0)

  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const { scrollY } = useScroll()

  // Scroll detection
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20))

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  // Auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  // Notification count (unsent reminders due soon)
  useEffect(() => {
    if (!user) return
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("sent", false)
      .lte("remind_at", new Date(Date.now() + 7 * 864e5).toISOString())
      .then(({ count }) => setNotifications(count ?? 0))
  }, [user, supabase])

  // Keyboard shortcut ⌘K → focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        router.push("/scholarships?focus=search")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  // Hide navbar on auth pages
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname)
  if (isAuthPage) return null

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300
                    ${scrolled
                      ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
                      : "bg-transparent"
                    }`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0,   opacity: 1  }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-6">

            {/* Logo */}
            <Logo />

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-6 ml-2">
              {PUBLIC_LINKS.map(({ href, label }) => (
                <NavItem
                  key={href}
                  href={href}
                  label={label}
                  active={pathname.startsWith(href)}
                />
              ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search */}
            <SearchButton onClick={() => router.push("/scholarships?focus=search")} />

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Reminders bell */}
                  <Link
                    href="/reminders"
                    className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07]
                               flex items-center justify-center hover:bg-white/[0.08]
                               transition-colors hidden sm:flex"
                  >
                    <Bell size={15} className="text-white/45" />
                    <NotificationDot count={notifications} />
                  </Link>

                  {/* User dropdown */}
                  <UserDropdown user={user} onSignOut={handleSignOut} />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:block text-[13px] font-medium text-white/50
                               hover:text-white/90 px-3 py-1.5 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="text-[13px] font-bold px-4 py-2 rounded-xl
                               bg-emerald-500 text-slate-950 hover:bg-emerald-400
                               transition-colors shadow-md shadow-emerald-900/30
                               hidden sm:block"
                  >
                    Get started
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <motion.button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07]
                           flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                whileTap={{ scale: 0.92 }}
              >
                <Menu size={16} className="text-white/60" />
              </motion.button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <MobileMenuPanel
        isOpen={mobileOpen}
        user={user}
        pathname={pathname}
        onSignOut={handleSignOut}
        onClose={() => setMobileOpen(false)}
      />
    </>
  )
}