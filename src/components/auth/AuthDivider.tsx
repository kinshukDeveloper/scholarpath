// ─────────────────────────────────────────────────────────────
// FILE: src/components/auth/AuthDivider.tsx
// Simple "or continue with email" divider.
//
// USAGE:
//   <GoogleButton />
//   <AuthDivider />
//   <LoginForm />
// ─────────────────────────────────────────────────────────────

interface AuthDividerProps {
  label?: string
}

export default function AuthDivider({ label = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-white/[0.06]" />
      <span className="text-[11px] text-white/25 font-medium whitespace-nowrap px-1">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  )
}