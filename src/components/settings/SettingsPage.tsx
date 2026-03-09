"use client"

// ─────────────────────────────────────────────────────────────
// FILE: src/components/settings/SettingsPage.tsx
//
// Tabs:
//   1. Profile      — name, avatar emoji, state, education, category, income
//   2. Notifications — email/whatsapp/sms toggles + digest frequency
//   3. Security     — change password, active sessions
//   4. Danger zone  — delete account
// ─────────────────────────────────────────────────────────────
 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Bell, Shield, Trash2, Save, Loader2,
  CheckCircle2, Eye, EyeOff, LogOut, AlertTriangle,
  Mail, MessageCircle, Smartphone, ChevronDown,
} from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { createClient } from "@/lib/supabase/client"
import { NotificationPrefs } from "@/types"
const T = {
  bg:         "#020817",
  bgAlt:      "rgba(255,255,255,0.018)",
  bgCard:     "rgba(255,255,255,0.028)",
  bgInput:    "rgba(255,255,255,0.03)",
  border:     "rgba(255,255,255,0.07)",
  text:       "#f8fafc",
  textDim:    "rgba(248,250,252,0.5)",
  textMuted:  "rgba(248,250,252,0.25)",
  accent:     "#34d399",
  accentDim:  "rgba(52,211,153,0.10)",
  accentRing: "rgba(52,211,153,0.28)",
  danger:     "#f87171",
  dangerDim:  "rgba(248,113,113,0.08)",
  dangerRing: "rgba(248,113,113,0.25)",
}

// ── Shared UI ─────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
      style={{ color: T.textMuted }}>
      {children}
    </label>
  )
}

function Input({ label, error, ...props }: {
  label: string; error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <input {...props}
        className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none caret-emerald-400 transition-all"
        style={{ background: T.bgInput, border: `1px solid ${error ? T.danger : T.border}`, color: T.text }} />
      {error && <p className="text-[11px] mt-1" style={{ color: T.danger }}>{error}</p>}
    </div>
  )
}

function Select({ label, children, ...props }: {
  label: string; children: React.ReactNode
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select {...props}
          className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none appearance-none pr-10"
          style={{ background: T.bgInput, border: `1px solid ${T.border}`, color: T.text }}>
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: T.textMuted }} />
      </div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button onClick={() => onChange(!on)} whileTap={{ scale: 0.92 }}
      className="relative w-11 h-6 rounded-full flex-shrink-0"
      style={{ background: on ? T.accent : "rgba(255,255,255,0.08)",
               border: `1px solid ${on ? T.accentRing : T.border}` }}>
      <motion.div className="absolute top-0.5 w-4 h-4 rounded-full shadow"
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ background: on ? T.bg : "rgba(255,255,255,0.4)" }} />
    </motion.button>
  )
}

function Toast({ msg }: { msg: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5
                     rounded-xl text-[13px] font-semibold shadow-xl"
          style={{ background: T.accentDim, border: `1px solid ${T.accentRing}`, color: T.accent }}>
          <CheckCircle2 size={14} />{msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SaveBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold
                 transition-all disabled:opacity-60"
      style={{ background: T.accent, color: T.bg }}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {loading ? "Saving…" : "Save changes"}
    </motion.button>
  )
}

// ── TABS ──────────────────────────────────────────────────────
const TABS = [
  { id: "profile",       label: "Profile",       icon: User    },
  { id: "notifications", label: "Notifications", icon: Bell    },
  { id: "security",      label: "Security",      icon: Shield  },
  { id: "danger",        label: "Danger zone",   icon: Trash2  },
]

const STATES = ["All India","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
  "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry"]

const CATEGORIES   = ["General","SC","ST","OBC","EWS","Minority","PwD","Female","Ex-Servicemen"]
const EDUCATION    = ["Class 10","Class 12","Diploma","UG (Bachelor's)","PG (Master's)","PhD","Other"]
const INCOME_BANDS = ["Below ₹1 lakh","₹1–2.5 lakh","₹2.5–5 lakh","₹5–8 lakh","Above ₹8 lakh"]
const AVATARS      = ["👨‍🎓","👩‍🎓","🧑‍🎓","👨‍💻","👩‍💻","🧑‍💼","🌟","🎯","📚","🚀"]

// ── TAB 1: PROFILE ────────────────────────────────────────────
function ProfileTab({ userId }: { userId: string }) {
  const supabase = createClient()
  const [form, setForm] = useState({
    full_name: "", state: "All India", education_level: "UG (Bachelor's)",
    category: "General", income_range: "Below ₹1 lakh",
    phone: "", avatar_emoji: "👨‍🎓",
  })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState("")
  const [email,    setEmail]    = useState("")

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(""), 2500) }
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "")
    })
    supabase.from("profiles").select("*").eq("id", userId).single()
      .then(({ data }) => {
        if (data) setForm(f => ({
          ...f,
          full_name:       data.full_name       ?? f.full_name,
          state:           data.state           ?? f.state,
          education_level: data.education_level ?? f.education_level,
          category:        data.category        ?? f.category,
          income_range:    (data as Record<string, unknown>).income_range as string ?? f.income_range,
          phone:           data.phone           ?? f.phone,
          avatar_emoji:    (data as Record<string, unknown>).avatar_emoji as string ?? f.avatar_emoji,
        }))
        setLoading(false)
      })
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setSaving(true)
    await supabase.from("profiles").upsert({ id: userId, ...form, updated_at: new Date().toISOString() })
    setSaving(false)
    showToast("Profile saved!")
  }

  if (loading) return (
    <div className="space-y-4">
      {[0,1,2,3].map(i => (
        <div key={i} className="h-12 rounded-xl animate-pulse"
          style={{ background: T.bgCard }} />
      ))}
    </div>
  )

  return (
    <>
      <Toast msg={toast} />

      {/* Avatar picker */}
      <div className="mb-6">
        <Label>Avatar</Label>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map(a => (
            <motion.button key={a} onClick={() => set("avatar_emoji", a)}
              whileTap={{ scale: 0.88 }}
              className="w-10 h-10 rounded-xl text-[20px] flex items-center justify-center
                         transition-all"
              style={{
                background: form.avatar_emoji === a ? T.accentDim : T.bgCard,
                border:     `1px solid ${form.avatar_emoji === a ? T.accentRing : T.border}`,
              }}>
              {a}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Input label="Full name" value={form.full_name}
          onChange={e => set("full_name", e.target.value)}
          placeholder="Your name" />

        <div>
          <Label>Email address</Label>
          <input value={email} disabled
            className="w-full px-4 py-2.5 rounded-xl text-[14px] opacity-50 cursor-not-allowed"
            style={{ background: T.bgInput, border: `1px solid ${T.border}`, color: T.text }} />
          <p className="text-[11px] mt-1" style={{ color: T.textMuted }}>
            Email cannot be changed here. Contact support.
          </p>
        </div>

        <Input label="Phone (for WhatsApp/SMS reminders)"
          value={form.phone} placeholder="+91 98765 43210"
          onChange={e => set("phone", e.target.value)} />

        <div className="grid grid-cols-2 gap-4">
          <Select label="State" value={form.state}
            onChange={e => set("state", e.target.value)}>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>

          <Select label="Category" value={form.category}
            onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Education level" value={form.education_level}
            onChange={e => set("education_level", e.target.value)}>
            {EDUCATION.map(e => <option key={e} value={e}>{e}</option>)}
          </Select>

          <Select label="Annual family income" value={form.income_range}
            onChange={e => set("income_range", e.target.value)}>
            {INCOME_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn loading={saving} onClick={save} />
        </div>
      </div>
    </>
  )
}

// ── TAB 2: NOTIFICATIONS ─────────────────────────────────────
function NotificationsTab({ userId }: { userId: string }) {
  const supabase = createClient()
  const [prefs, setPrefs] = useState({
    email_reminders:     true,
    whatsapp_reminders:  false,
    sms_reminders:       false,
    new_scholarships:    true,
    digest_frequency:    "weekly",
    marketing_emails:    false,
  })
  const [saving, setSaving] = useState(false)
  const [toast,  setToast]  = useState("")
  const DEFAULT_PREFS: NotificationPrefs = {
  email_reminders: true,
  whatsapp_reminders: false,
  sms_reminders: false,
  new_scholarships: true,
  marketing_emails: false,
  digest_frequency: "weekly"
}

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(""), 2500) }
  function set(k: string, v: boolean | string) { setPrefs(p => ({ ...p, [k]: v })) }

useEffect(() => {
  supabase
    .from("profiles")
    .select("notification_prefs")
    .eq("id", userId)
    .single()
    .then(({ data }) => {
      const prefs = data?.notification_prefs

      if (prefs && typeof prefs === "object" && !Array.isArray(prefs)) {
        setPrefs({
          ...DEFAULT_PREFS,
          ...(prefs as unknown as NotificationPrefs)
        })
      }
    })
}, [userId])// eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    setSaving(true)
    await supabase.from("profiles").update({ notification_prefs: prefs }).eq("id", userId)
    setSaving(false)
    showToast("Notification preferences saved!")
  }

  const CHANNELS = [
    { key: "email_reminders",    icon: Mail,           label: "Email reminders",
      desc: "Deadline reminders sent to your email address" },
    { key: "whatsapp_reminders", icon: MessageCircle,  label: "WhatsApp reminders",
      desc: "Reminders via WhatsApp (Premium)", isPremium: true },
    { key: "sms_reminders",      icon: Smartphone,     label: "SMS reminders",
      desc: "Reminders via SMS (Premium)", isPremium: true },
  ]

  return (
    <>
      <Toast msg={toast} />
      <div className="space-y-3">
        <p className="text-[12px] font-bold uppercase tracking-widest mb-4"
          style={{ color: T.textMuted }}>
          Reminder channels
        </p>

        {CHANNELS.map(ch => {
          const Icon = ch.icon
          return (
            <div key={ch.key}
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: T.accentDim }}>
                  <Icon size={14} style={{ color: T.accent }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold" style={{ color: T.text }}>
                      {ch.label}
                    </p>
                    {ch.isPremium && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase"
                        style={{ background: "rgba(245,158,11,0.14)", color: "#f59e0b" }}>
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-[11px]" style={{ color: T.textMuted }}>{ch.desc}</p>
                </div>
              </div>
              <Toggle on={(prefs as Record<string, boolean | string>)[ch.key] as boolean}
                onChange={v => set(ch.key, v)} />
            </div>
          )
        })}

        <div className="mt-6">
          <p className="text-[12px] font-bold uppercase tracking-widest mb-3"
            style={{ color: T.textMuted }}>
            Newsletter
          </p>

          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: T.text }}>
                New scholarship alerts
              </p>
              <p className="text-[11px]" style={{ color: T.textMuted }}>
                Get notified when new scholarships matching your profile are added
              </p>
            </div>
            <Toggle on={prefs.new_scholarships} onChange={v => set("new_scholarships", v)} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl mt-2"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div>
              <p className="text-[13px] font-semibold" style={{ color: T.text }}>
                Marketing emails
              </p>
              <p className="text-[11px]" style={{ color: T.textMuted }}>
                Tips, guides, and platform updates
              </p>
            </div>
            <Toggle on={prefs.marketing_emails} onChange={v => set("marketing_emails", v)} />
          </div>

          <div className="mt-4">
            <Select label="Digest frequency" value={prefs.digest_frequency}
              onChange={e => set("digest_frequency", e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="never">Never</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <SaveBtn loading={saving} onClick={save} />
        </div>
      </div>
    </>
  )
}

// ── TAB 3: SECURITY ───────────────────────────────────────────
function SecurityTab() {
  const supabase = createClient()
  const [form,    setForm]    = useState({ current: "", next: "", confirm: "" })
  const [show,    setShow]    = useState({ current: false, next: false })
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState("")
  const [error,   setError]   = useState("")

  function showToast(m: string) { setToast(m); setTimeout(() => setToast(""), 2500) }
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); setError("") }

  async function changePassword() {
    if (!form.next) return setError("New password is required")
    if (form.next.length < 8) return setError("Password must be at least 8 characters")
    if (form.next !== form.confirm) return setError("Passwords do not match")
    setSaving(true)
    const { error: err } = await supabase.auth.updateUser({ password: form.next })
    setSaving(false)
    if (err) return setError(err.message)
    setForm({ current: "", next: "", confirm: "" })
    showToast("Password updated!")
  }

  async function signOutAll() {
    await supabase.auth.signOut({ scope: "global" })
    window.location.href = "/login"
  }

  const pwField = (key: "current" | "next" | "confirm", label: string, showKey: "current" | "next") => (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input type={show[showKey] ? "text" : "password"}
          value={form[key]} onChange={e => set(key, e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-2.5 pr-10 rounded-xl text-[14px] outline-none caret-emerald-400"
          style={{ background: T.bgInput, border: `1px solid ${T.border}`, color: T.text }} />
        <button onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: T.textMuted }}>
          {show[showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Toast msg={toast} />
      <div className="space-y-6">

        {/* Change password */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <p className="text-[14px] font-bold" style={{ color: T.text }}>Change password</p>
          {pwField("next",    "New password",     "next"    )}
          {pwField("confirm", "Confirm password", "current" )}
          {error && <p className="text-[12px]" style={{ color: T.danger }}>{error}</p>}
          <SaveBtn loading={saving} onClick={changePassword} />
        </div>

        {/* Sessions */}
        <div className="rounded-2xl p-6"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <p className="text-[14px] font-bold mb-1" style={{ color: T.text }}>Sign out everywhere</p>
          <p className="text-[13px] mb-4" style={{ color: T.textDim }}>
            Signs you out of all devices and browsers. You&apos;ll need to log in again.
          </p>
          <motion.button onClick={signOutAll} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
            style={{ background: "rgba(248,113,113,0.08)",
                     border: `1px solid rgba(248,113,113,0.2)`,
                     color: T.danger }}>
            <LogOut size={14} /> Sign out all devices
          </motion.button>
        </div>
      </div>
    </>
  )
}

// ── TAB 4: DANGER ZONE ───────────────────────────────────────
function DangerTab({ userId }: { userId: string }) {
  const supabase = createClient()
  const router   = useRouter()
  const [confirm,  setConfirm]  = useState("")
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState("")

  const CONFIRM_PHRASE = "delete my account"

  async function deleteAccount() {
    if (confirm.toLowerCase() !== CONFIRM_PHRASE) {
      return setError(`Type "${CONFIRM_PHRASE}" exactly to confirm`)
    }
    setDeleting(true)
    // Delete all user data then the auth user
    await supabase.from("bookmarks").delete().eq("user_id", userId)
    await supabase.from("reminders").delete().eq("user_id", userId)
    await supabase.from("applications").delete().eq("user_id", userId)
    await supabase.from("profiles").delete().eq("id", userId)
    // Use service role via API route for auth.admin.deleteUser
    await fetch("/api/account/delete", { method: "POST" })
    await supabase.auth.signOut()
    router.push("/?deleted=1")
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6"
        style={{ background: T.dangerDim, border: `1px solid ${T.dangerRing}` }}>
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={18} style={{ color: T.danger }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-bold mb-1" style={{ color: T.danger }}>
              Delete account permanently
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: T.textDim }}>
              This will permanently delete your profile, bookmarks, reminders, and application
              history. <strong style={{ color: T.text }}>This cannot be undone.</strong>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <Label>Type <span style={{ color: T.danger }}>&ldquo;{CONFIRM_PHRASE}&ldquo;</span> to confirm</Label>
          <input value={confirm} onChange={e => { setConfirm(e.target.value); setError("") }}
            placeholder={CONFIRM_PHRASE}
            className="w-full px-4 py-2.5 rounded-xl text-[14px] outline-none caret-red-400"
            style={{ background: "rgba(248,113,113,0.06)",
                     border: `1px solid ${error ? T.danger : T.dangerRing}`,
                     color: T.text }} />
          {error && <p className="text-[11px] mt-1" style={{ color: T.danger }}>{error}</p>}
        </div>

        <motion.button onClick={deleteAccount}
          disabled={deleting || confirm.toLowerCase() !== CONFIRM_PHRASE}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold
                     disabled:opacity-40 transition-all"
          style={{ background: T.danger, color: "#fff" }}>
          {deleting
            ? <Loader2 size={14} className="animate-spin" />
            : <Trash2 size={14} />
          }
          {deleting ? "Deleting…" : "Delete my account"}
        </motion.button>
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────
export default function SettingsPage() {
  const supabase = createClient()
  const router   = useRouter()
  const [tab,    setTab]    = useState("profile")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return }
      setUserId(user.id)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!userId) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: T.bg }}>
      <Loader2 size={24} className="animate-spin" style={{ color: T.accent }} />
    </div>
  )

  return (
    <AppLayout noPad>
      <div style={{ background: T.bg, minHeight: "100vh" }}>
        <div className="max-w-3xl mx-auto px-5 pt-24 pb-16">

          {/* Header */}
          <h1 className="text-[28px] font-black tracking-tight mb-8" style={{ color: T.text }}>
            Settings
          </h1>

          <div className="flex flex-col sm:flex-row gap-6">

            {/* Sidebar tabs */}
            <nav className="sm:w-44 flex sm:flex-col gap-1 flex-shrink-0">
              {TABS.map(t => {
                const Icon    = t.icon
                const active  = tab === t.id
                const isDanger= t.id === "danger"
                return (
                  <motion.button key={t.id} onClick={() => setTab(t.id)}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                               text-[13px] font-semibold text-left transition-all"
                    style={active ? {
                      background: isDanger ? T.dangerDim : T.accentDim,
                      border:     `1px solid ${isDanger ? T.dangerRing : T.accentRing}`,
                      color:      isDanger ? T.danger : T.accent,
                    } : {
                      color: isDanger ? T.danger : T.textMuted,
                    }}>
                    <Icon size={14} />
                    {t.label}
                  </motion.button>
                )
              })}
            </nav>

            {/* Tab content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}>
                  {tab === "profile"       && <ProfileTab       userId={userId} />}
                  {tab === "notifications" && <NotificationsTab userId={userId} />}
                  {tab === "security"      && <SecurityTab />}
                  {tab === "danger"        && <DangerTab        userId={userId} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}