// ─────────────────────────────────────────────────────────────
// FILE:  src/components/layout/AppLayout.tsx
// USAGE: Wrap public-facing pages (landing, scholarships, blog)
//
//   // src/app/scholarships/page.tsx
//   import AppLayout from "@/components/layout/AppLayout"
//
//   export default function Page() {
//     return (
//       <AppLayout>
//         <YourPageContent />
//       </AppLayout>
//     )
//   }
//
// Props:
//   children   — page content
//   padTop?    — add pt-16 to clear fixed navbar (default: true)
//   maxWidth?  — inner container max-width class (default: "max-w-7xl")
//   noPad?     — skip horizontal padding (for full-bleed pages)
//   noFooter?  — hide footer
// ─────────────────────────────────────────────────────────────

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

interface AppLayoutProps {
  children:  React.ReactNode
  padTop?:   boolean
  maxWidth?: string
  noPad?:    boolean
  noFooter?: boolean
}

export default function AppLayout({
  children,
  padTop   = true,
  maxWidth = "max-w-7xl",
  noPad    = false,
  noFooter = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <main className={`flex-1 ${padTop ? "pt-16" : ""}`}>
        {noPad ? (
          children
        ) : (
          <div className={`${maxWidth} mx-auto px-4 sm:px-6 py-8`}>
            {children}
          </div>
        )}
      </main>

      {!noFooter && <Footer />}
    </div>
  )
}