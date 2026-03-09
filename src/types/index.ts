// ─────────────────────────────────────────────────────────────
// FILE: src/types/index.ts
// TypeScript types for every Supabase table.
// ─────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────
export type UserPlan        = "free" | "premium"
export type UserRole        = "user" | "admin"
export type ReminderChannel = "email" | "whatsapp" | "sms"
export type AppStatus       = "saved" | "in_progress" | "submitted" | "accepted" | "rejected"
export type ListingStatus   = "pending" | "active" | "expired"
export type GenderType      = "All" | "Female" | "Male" | "Transgender"
export type AmountType      = "year" | "month" | "one-time" | "semester"

export type EducationLevel =
  | "Class 10" | "Class 12" | "Diploma"
  | "UG (Bachelor's)" | "PG (Master's)" | "PhD" | "Other"

export type Category =
  | "General" | "SC" | "ST" | "OBC" | "EWS"
  | "Minority" | "PwD" | "Female" | "Ex-Servicemen"

export type IncomeRange =
  | "Below ₹1 lakh" | "₹1–2.5 lakh" | "₹2.5–5 lakh"
  | "₹5–8 lakh" | "Above ₹8 lakh"

// ── Notification preferences ─────────────────────────────────
export interface NotificationPrefs {
  email_reminders:    boolean
  whatsapp_reminders: boolean
  sms_reminders:      boolean
  new_scholarships:   boolean
  marketing_emails:   boolean
  digest_frequency:   "daily" | "weekly" | "never"
}

// ── 1. Profile ────────────────────────────────────────────────
export interface Profile {
  id:                  string
  full_name:           string | null
  avatar_emoji:        string | null
  avatar_url:          string | null
  email:               string | null
  phone:               string | null

  state:               string | null
  category:            string | null
  education_level:     string | null
  income_range:        string | null
  income_annual:       number | null
  gender:              string | null
  date_of_birth:       string | null

  // Plan — new schema uses plan/plan_expires_at,
  // old schema used is_premium/premium_until — keep both for compat
  plan:                string | null
  plan_expires_at:     string | null
  is_premium:          boolean | null
  premium_until:       string | null
  onboarded:           boolean | null

  razorpay_payment_id: string | null
  razorpay_order_id:   string | null

  role:                UserRole | null
  notification_prefs:  NotificationPrefs | null

  created_at:          string | null
  updated_at:          string | null
}

// ── 2. Scholarship ────────────────────────────────────────────
export interface Scholarship {
  id:                string
  title:             string
  slug:              string | null
  provider:          string
  description:       string | null
  eligibility:       string | null

  amount:            number
  amount_type:       string

  category:          string[] | null
  education_level:   string[] | null
  state:             string | null
  gender:            string | null
  min_percentage:    number | null
  max_income:        number | null

  deadline:          string
  open_date:         string | null

  apply_url:         string | null
  official_url:      string | null

  is_active:         boolean | null
  is_featured:       boolean | null
  is_verified:       boolean | null
  view_count:        number | null
  application_count: number | null

  tags:              string[] | null
  income_max:        number | null
  documents:         string[] | null

  created_at:        string | null
  updated_at:        string | null
}

// ── 3. Bookmark ───────────────────────────────────────────────
export interface Bookmark {
  id:             string
  user_id:        string
  scholarship_id: string
  created_at:     string | null

  // Joined
  scholarships?:  Scholarship
}

// ── 4. Reminder ───────────────────────────────────────────────
export interface Reminder {
  id:             string
  user_id:        string
  scholarship_id: string

  channel:        string | null
  remind_at:      string
  sent:           boolean | null
  sent_at:        string | null

  created_at:     string | null

  // Joined
  scholarships?:  Pick<Scholarship, "id" | "title" | "provider" | "amount" | "deadline">
  profiles?:      Pick<Profile, "full_name" | "email" | "phone">
}

// ── 5. Application ────────────────────────────────────────────
export interface Application {
  id:             string
  user_id:        string
  scholarship_id: string

  status:         string
  notes:          string | null
  applied_at:     string | null
  result_at:      string | null

  created_at:     string | null
  updated_at:     string | null

  // Joined
  scholarships?:  Scholarship
}

// ── 6. Featured Listing ───────────────────────────────────────
export interface FeaturedListing {
  id:                  string
  scholarship_id:      string

  status:              ListingStatus | null
  amount_paid:         number | null
  plan_type:           string | null

  starts_at:           string
  ends_at:             string

  razorpay_id:         string | null
  contact_name:        string | null
  contact_email:       string | null

  created_at:          string | null

  // Joined
  scholarships?:       Scholarship
}

// ── 7. Blog Post ─────────────────────────────────────────────
export interface BlogPost {
  id:           string
  title:        string
  slug:         string
  excerpt:      string | null
  content:      string | null
  cover_url:    string | null

  category:     string | null
  tags:         string[] | null
  reading_time: number | null

  is_published: boolean | null
  is_featured:  boolean | null
  view_count:   number | null

  author_name:   string | null
  author_avatar: string | null

  published_at:  string | null
  created_at:    string | null
  updated_at:    string | null
}

// ── 8. Contact Message ────────────────────────────────────────
export interface ContactMessage {
  id:         string
  name:       string
  email:      string
  subject:    string | null
  message:    string
  is_read:    boolean | null
  replied_at: string | null
  created_at: string | null
}

// ── 9. Newsletter Subscriber ──────────────────────────────────
export interface NewsletterSub {
  id:               string
  email:            string
  is_confirmed:     boolean | null
  confirm_token:    string | null
  unsubscribed_at:  string | null
  created_at:       string | null
}

// ── ScholarshipFilters ────────────────────────────────────────
export interface ScholarshipFilters {
  search?:          string
  category?:        string[]
  education_level?: string[]
  state?:           string
  gender?:          string
  amount_min?:      number
  amount_max?:      number
  deadline_after?:  string
  is_featured?:     boolean
  sortBy?:          "deadline" | "amount" | "created_at"
  sortOrder?:       "asc" | "desc"
}

// ── ContactForm ───────────────────────────────────────────────
export interface ContactForm {
  name:    string
  email:   string
  message: string
}
