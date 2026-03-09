import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const {
    razorpay_payment_id, razorpay_order_id,
    razorpay_signature, plan, userId,
  } = await req.json()

  // Verify HMAC signature
  const body       = razorpay_order_id + "|" + razorpay_payment_id
  const expected   = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body).digest("hex")

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Activate Premium in profiles table
  const now         = new Date()
  const expiresAt   = new Date(now)
  if (plan === "yearly")  expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  else                    expiresAt.setMonth(expiresAt.getMonth() + 1)

  await supabase.from("profiles").update({
    plan:               "premium",
    plan_expires_at:    expiresAt.toISOString(),
    razorpay_payment_id,
    razorpay_order_id,
  }).eq("id", userId)

  return NextResponse.json({ ok: true })
}