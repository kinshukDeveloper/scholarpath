"use client"

// ─────────────────────────────────────────────────────────────
// FILE:  src/components/layout/DashboardLayout.tsx
// USAGE: Wrap all /dashboard/* pages.
//        Includes collapsible sidebar + top header bar.
//
//   // src/app/(dashboard)/dashboard/page.tsx
//   import DashboardLayout from "@/components/layout/DashboardLayout"
//
//   export default function DashboardPage() {
//     return (
//       <DashboardLayout title="Dashboard">
//         <YourContent />
//       </DashboardLayout>
//     )
//   }
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  Sparkles,
  LayoutDashboard,
  GraduationCap,
  Bookmark,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

// ── Nav items ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/dashboard",      label: "Overview",      icon: LayoutDashboard },
  { href: "/scholarships",   label: "Scholarships",  icon: GraduationCap   },
  { href: "/bookmarks",      label: "Saved",         icon: Bookmark        },
  { href: "/reminders",      label: "Reminders",     icon: Bell            },
  { href: "/applications",   label: "Applications",  icon: FileText        },
]

const BOTTOM_ITEMS = [
  { href: "/settings",  label: "Settings",  icon: Settings },
  { href: "/profile",   label: "Profile",   icon: User     },
]

// ── SidebarItem ───────────────────────────────────────────────
function SidebarItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  badge,
}: {
  href:      string
  label:     string
  icon:      React.ElementType
  active:    boolean
  collapsed: boolean
  badge?:    number
}) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 rounded-xl transition-all duration-200
                  ${collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"}
                  ${active
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
    >
      {/* Active indicator */}
      {active && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-emerald-400"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <Icon size={16} className="flex-shrink-0" />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{    opacity: 0, width: 0     }}
            transition={{ duration: 0.2 }}
            className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {badge && badge > 0 && (
        <span className={`ml-auto min-w-[18px] h-[18px] px-1 rounded-full
                          bg-emerald-500/20 text-emerald-400 text-[10px] font-bold
                          flex items-center justify-center
                          ${collapsed ? "absolute -top-1 -right-1 scale-75" : ""}`}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
                        bg-slate-800 border border-white/10 text-[12px] font-medium
                        text-white whitespace-nowrap pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity z-50
                        shadow-xl">
          {label}
        </div>
      )}
    </Link>
  )
}

// ── DashboardLayout ───────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode
  title?:   string
  subtitle?: string
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user,       setUser]       = useState<SupabaseUser | null>(null)
  const [reminders,  setReminders]  = useState(0)

  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  // Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return }
      setUser(user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) router.push("/login")
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase,router])

  // Reminder count
  useEffect(() => {
    if (!user) return
    supabase
      .from("reminders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("sent", false)
      .lte("remind_at", new Date(Date.now() + 7 * 864e5).toISOString())
      .then(({ count }) => setReminders(count ?? 0))
  }, [user, supabase])

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  const name     = user?.user_metadata?.full_name as string | undefined
  const email    = user?.email ?? ""
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? "U"

  // ── Sidebar content ──────────────────────────────────────
  const sidebarContent = (isMobile = false) => (
    <div className={`flex flex-col h-full ${isMobile ? "w-72" : ""}`}>

      {/* Logo + collapse toggle */}
      <div className={`flex items-center h-16 border-b border-white/[0.06] flex-shrink-0
                       ${collapsed && !isMobile ? "px-3 justify-center" : "px-4 justify-between"}`}>
        {(!collapsed || isMobile) && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600
                            flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">
              Scholar<span className="text-emerald-400">Path</span>
            </span>
          </Link>
        )}

        {/* Desktop collapse button */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07]
                       flex items-center justify-center hover:bg-white/[0.08]
                       transition-colors flex-shrink-0"
          >
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }}>
              <ChevronRight size={13} className="text-white/40" />
            </motion.div>
          </button>
        )}

        {/* Mobile close */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center
                       justify-center hover:bg-white/[0.08] transition-colors"
          >
            <X size={15} className="text-white/50" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <SidebarItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href || (href !== "/dashboard" && pathname.startsWith(href))}
            collapsed={collapsed && !isMobile}
            badge={label === "Reminders" ? reminders : undefined}
          />
        ))}
      </nav>

      {/* Bottom: settings + user */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-white/[0.06] pt-3 flex-shrink-0">
        {BOTTOM_ITEMS.map(({ href, label, icon }) => (
          <SidebarItem
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname.startsWith(href)}
            collapsed={collapsed && !isMobile}
          />
        ))}

        {/* User row */}
        <div
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 mt-1
                      bg-white/[0.02] border border-white/[0.05]
                      ${collapsed && !isMobile ? "justify-center" : ""}`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-700/30
                          border border-emerald-500/20 flex items-center justify-center
                          text-[11px] font-bold text-emerald-300 flex-shrink-0">
            {initials}
          </div>
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white/70 truncate">
                {name ?? "My Account"}
              </p>
              <p className="text-[10px] text-white/25 truncate">{email}</p>
            </div>
          )}
          {(!collapsed || isMobile) && (
            <button onClick={handleSignOut} className="flex-shrink-0 hover:text-red-400 transition-colors">
              <LogOut size={14} className="text-white/25" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col bg-slate-950 border-r border-white/[0.06]
                   flex-shrink-0 overflow-hidden"
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{    x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 left-0 bottom-0 z-40 bg-slate-950
                         border-r border-white/[0.07] md:hidden"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="h-16 flex items-center gap-4 px-4 sm:px-6
                           border-b border-white/[0.06] bg-slate-950
                           flex-shrink-0">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07]
                       flex items-center justify-center hover:bg-white/[0.08] transition-colors"
          >
            <Menu size={16} className="text-white/60" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-[16px] font-bold text-white truncate">{title}</h1>
            )}
            {subtitle && (
              <p className="text-[12px] text-white/35 truncate">{subtitle}</p>
            )}
          </div>

          {/* Header right */}
          <div className="flex items-center gap-2">
            <Link
              href="/reminders"
              className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07]
                         flex items-center justify-center hover:bg-white/[0.08] transition-colors"
            >
              <Bell size={15} className="text-white/45" />
              {reminders > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full
                                 bg-emerald-500 text-[9px] font-bold text-white
                                 flex items-center justify-center ring-2 ring-slate-950">
                  {reminders > 9 ? "9+" : reminders}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {children}
        </main>

      </div>
    </div>
  )
}