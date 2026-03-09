import Razorpay from "razorpay"
import { NextResponse } from "next/server"
// import crypto from "crypto"

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const AMOUNTS = { monthly: 9900, yearly: 94800 }   // in paise

export async function POST(req: Request) {
  const { plan, userId } = await req.json()
  if (!plan || !userId) return NextResponse.json({ error: "Missing params" }, { status: 400 })

  const order = await razorpay.orders.create({
    amount:   AMOUNTS[plan as keyof typeof AMOUNTS],
    currency: "INR",
    receipt:  `sp_${userId}_${Date.now()}`,
    notes:    { plan, userId },
  })

  return NextResponse.json({
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
  })
}