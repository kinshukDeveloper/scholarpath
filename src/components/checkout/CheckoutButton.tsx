"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

declare global {
  interface Window { Razorpay: any }
}

const PRICES = {
  monthly: { amount: 9900,   label: "₹99/month",  description: "ScholarPath Premium — Monthly" },
  yearly:  { amount: 94800,  label: "₹948/year",   description: "ScholarPath Premium — Yearly (save 20%)" },
}

interface Props {
  plan:      "monthly" | "yearly"
  className?: string
  style?:    React.CSSProperties
  children?: React.ReactNode
}

export default function CheckoutButton({ plan, className, style, children }: Props) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleCheckout() {
    setLoading(true)

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = "/login?redirect=/pricing"; return }

      const { data: profile } = await supabase
        .from("profiles").select("full_name, email, phone").eq("id", user.id).single()

      // 2. Create Razorpay order via API
      const res = await fetch("/api/razorpay/create-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan, userId: user.id }),
      })
      const { orderId, amount, currency } = await res.json()

      // 3. Load Razorpay SDK dynamically
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script")
          s.src = "https://checkout.razorpay.com/v1/checkout.js"
          s.onload  = () => resolve()
          s.onerror = () => reject(new Error("Razorpay SDK load failed"))
          document.head.appendChild(s)
        })
      }

      // 4. Open checkout popup
      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name:        "ScholarPath",
        description: PRICES[plan].description,
        order_id:    orderId,
        prefill: {
          name:    profile?.full_name ?? "",
          email:   profile?.email     ?? user.email ?? "",
          contact: profile?.phone     ?? "",
        },
        theme: { color: "#34d399" },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id:   string
          razorpay_signature:  string
        }) => {
          // 5. Verify + activate via webhook (or direct verify endpoint)
          const verifyRes = await fetch("/api/razorpay/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ ...response, plan, userId: user.id }),
          })
          if (verifyRes.ok) {
            window.location.href = "/dashboard?upgraded=1"
          } else {
            alert("Payment verification failed. Contact support@scholarpath.in")
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.open()
    } catch (err) {
      console.error("Checkout error:", err)
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleCheckout}
      disabled={loading}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={className}
      style={style}
    >
      {loading
        ? <Loader2 size={16} className="animate-spin" />
        : (children ?? <><Zap size={15} /> Upgrade to Premium — {PRICES[plan].label}</>)
      }
    </motion.button>
  )
}
