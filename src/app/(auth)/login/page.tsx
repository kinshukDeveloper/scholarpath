
// ═══════════════════════════════════════════════════════════════
// FILE: src/app/(auth)/login/page.tsx
// Drop this in — it just composes the auth components.
// All logic lives inside LoginForm + GoogleButton.
// ═══════════════════════════════════════════════════════════════

import AuthCard    from "@/components/auth/AuthCard"
import GoogleButton from "@/components/auth/GoogleButton"
import AuthDivider  from "@/components/auth/AuthDivider"
import LoginForm    from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthCard
      heading="Welcome back"
      sub="Sign in to continue your scholarship journey"
    >
      <GoogleButton redirectTo="/dashboard" />
      <AuthDivider />
      <LoginForm redirectTo="/dashboard" />
    </AuthCard>
  )
}