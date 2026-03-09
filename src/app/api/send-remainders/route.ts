// ─────────────────────────────────────────────────────────────
// EMAIL REMINDER SYSTEM
// Resend API + Vercel Cron — runs daily at 8am IST
//
// Files:
//   1. src/app/api/send-reminders/route.ts   ← cron target
//   2. src/lib/email/templates.tsx           ← email HTML
//   3. vercel.json                           ← cron schedule
// ─────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// FILE 1: src/app/api/send-reminders/route.ts
//
// Called by Vercel Cron every day at 8am IST (2:30am UTC).
// Finds all reminders where remind_at <= now AND sent = false,
// sends the email via Resend, then marks sent = true.
// ══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { reminderEmailHtml } from "@/lib/email/templates";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role — bypasses RLS
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  // ── Security: verify cron secret ─────────────────────────
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Fetch due reminders ───────────────────────────────────
  const { data: reminders, error } = await supabase
    .from("reminders")
    .select(
      `
      id,
      channel,
      user_id,
      scholarship_id,
      remind_at,
      profiles ( full_name, email ),
      scholarships ( title, provider, amount, deadline, apply_url, id )
    `,
    )
    .lte("remind_at", new Date().toISOString())
    .eq("sent", false)
    .limit(100);

  if (error) {
    console.error("Reminder fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!reminders || reminders.length === 0) {
    return NextResponse.json({ sent: 0, message: "No reminders due" });
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const reminder of reminders) {
    const profile = reminder.profiles as {
      full_name?: string;
      email?: string;
    };
    const scholarship = reminder.scholarships?.[0] as {
      id: string;
      title: string;
      provider: string;
      amount: number;
      deadline: string;
      apply_url?: string;
    };

    if (!profile?.email || !scholarship) {
      failed++;
      continue;
    }

    const deadlineDays = Math.ceil(
      (new Date(scholarship.deadline).getTime() - Date.now()) / 864e5,
    );

    try {
      if (reminder.channel === "email") {
        // ── Send email via Resend ──────────────────────────
        await resend.emails.send({
          from: `ScholarPath <${process.env.RESEND_FROM_EMAIL ?? "reminders@scholarpath.in"}>`,
          to: [profile.email],
          subject: `⏰ ${deadlineDays} days left — ${scholarship.title}`,
          html: reminderEmailHtml({
            name: profile.full_name ?? "there",
            scholarshipTitle: scholarship.title,
            provider: scholarship.provider,
            amount: scholarship.amount,
            deadline: scholarship.deadline,
            deadlineDays,
            applyUrl:
              scholarship.apply_url ??
              `${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${scholarship.id}`,
            scholarshipUrl: `${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${scholarship.id}`,
          }),
        });
      } else if (
        reminder.channel === "whatsapp" ||
        reminder.channel === "sms"
      ) {
        // ── Send WhatsApp/SMS via MSG91 ────────────────────
        // Fetch phone number from profiles (add `phone` column if needed)
        const { data: profileFull } = await supabase
          .from("profiles")
          .select("phone")
          .eq("id", reminder.user_id)
          .single();

        if (profileFull?.phone) {
          await fetch("https://api.msg91.com/api/v5/flow/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authkey: process.env.MSG91_AUTH_KEY!,
            },
            body: JSON.stringify({
              template_id: process.env.MSG91_TEMPLATE_ID,
              short_url: "0",
              mobiles: profileFull.phone.replace(/\D/g, ""),
              var1: profile.full_name ?? "Student",
              var2: scholarship.title,
              var3: String(deadlineDays),
              var4: `${process.env.NEXT_PUBLIC_APP_URL}/scholarships/${scholarship.id}`,
            }),
          });
        }
      }

      // ── Mark as sent ───────────────────────────────────
      await supabase
        .from("reminders")
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq("id", reminder.id);

      sent++;
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Failed to send reminder ${reminder.id}:`, err.message);
      } else {
        console.error(`Failed to send reminder ${reminder.id}:`, err);
      }

      errors.push(reminder.id);
      failed++;
    }
  }

  console.log(`Reminders: ${sent} sent, ${failed} failed`);
  return NextResponse.json({ sent, failed, errors });
}

// ══════════════════════════════════════════════════════════════
// FILE 3: vercel.json  (create at project root)

// Runs the reminder cron every day at 2:30 UTC = 8:00 AM IST
// Also add CRON_SECRET to Vercel env vars (any random string).
// ══════════════════════════════════════════════════════════════

// NOTE: Vercel Cron requires a Pro plan or Hobby plan (1 cron free).
// The cron hits the route with Authorization: Bearer <CRON_SECRET>
// Add CRON_SECRET to Vercel env vars → any random string works:
//   openssl rand -hex 32

// ══════════════════════════════════════════════════════════════
// FILE 4: Supabase DB — add missing columns for reminders
//
// Run in Supabase SQL Editor:
// ══════════════════════════════════════════════════════════════

// ALTER TABLE reminders
//   ADD COLUMN IF NOT EXISTS sent_at timestamptz,
//   ADD COLUMN IF NOT EXISTS channel text DEFAULT 'email'
//     CHECK (channel IN ('email', 'whatsapp', 'sms'));
//
// ALTER TABLE profiles
//   ADD COLUMN IF NOT EXISTS phone text;
//
// -- Index for the cron query (runs fast even with 100k rows)
// CREATE INDEX IF NOT EXISTS reminders_due_idx
//   ON reminders (remind_at, sent)
//   WHERE sent = false;

// ══════════════════════════════════════════════════════════════
// SETUP CHECKLIST
// ══════════════════════════════════════════════════════════════

// [ ] npm install resend
// [ ] Add RESEND_API_KEY to Vercel env vars
// [ ] Add RESEND_FROM_EMAIL (e.g. reminders@scholarpath.in)
// [ ] Verify domain in Resend dashboard (or use onboarding@resend.dev for testing)
// [ ] Add CRON_SECRET to Vercel env vars (any random string)
// [ ] Add MSG91_AUTH_KEY + MSG91_TEMPLATE_ID for WhatsApp/SMS (optional)
// [ ] Add vercel.json to project root
// [ ] Run SQL migrations in Supabase (see File 4 above)
// [ ] Deploy to Vercel — Cron tab appears in Vercel dashboard
// [ ] Test manually: GET /api/send-reminders with Authorization header
//       curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
//            https://scholarpath-woad.vercel.app/api/send-reminders

export {};
