import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body      = await req.text()
  const signature = req.headers.get("x-razorpay-signature") ?? ""
  const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!

  // Verify webhook signature
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex")
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity
    const userId  = payment.notes?.userId
    const plan    = payment.notes?.plan ?? "monthly"

    if (userId) {
      const expiresAt = new Date()
      if (plan === "yearly") expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      else                   expiresAt.setMonth(expiresAt.getMonth() + 1)

      await supabase.from("profiles").update({
        plan:             "premium",
        plan_expires_at:  expiresAt.toISOString(),
      }).eq("id", userId)
    }
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity
    const userId  = payment.notes?.userId
    if (userId) {
      await supabase.from("profiles").update({ plan: "free" }).eq("id", userId)
    }
  }

  return NextResponse.json({ ok: true })
}
