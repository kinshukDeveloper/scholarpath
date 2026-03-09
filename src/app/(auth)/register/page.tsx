 import AuthCard     from "@/components/auth/AuthCard"
import GoogleButton from "@/components/auth/GoogleButton"
import AuthDivider  from "@/components/auth/AuthDivider"
import RegisterForm from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthCard
      heading="Create your account"
      sub="Takes 60 seconds · Unlock 500+ scholarships"
      wide
    >
      <GoogleButton
        label="Sign up with Google"
        redirectTo="/dashboard?welcome=1"
      />
      <AuthDivider label="or sign up with email" />
      <RegisterForm redirectTo="/dashboard?welcome=1" />
    </AuthCard>
  )
}
