// ─────────────────────────────────────────────────────────────
// THREE FILES in one — split when copying into your project:
//
//   src/components/legal/PrivacyPolicyPage.tsx
//   src/components/legal/TermsPage.tsx
//   src/components/legal/CookiePolicyPage.tsx
//
// Each imports LegalLayout and passes sections as props.
// ─────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════
// FILE 1: src/components/legal/PrivacyPolicyPage.tsx
// ══════════════════════════════════════════════════════════════
"use client"

import LegalLayout from "./LegalLayout"

const SITE = "https://scholarpath-woad.vercel.app"
const EMAIL = "hello@scholarpath.in"

export function PrivacyPolicyPage() {
  const sections = [
    {
      id: "overview",
      heading: "Overview",
      body: (
        <>
          <p>
            ScholarPath (&ldquo;we&ldquo;, &ldquo;us&ldquo;, or &ldquo;our&ldquo;) operates {SITE}. This Privacy Policy explains
            what information we collect, how we use it, and your rights regarding that information.
          </p>
          <p>
            By using ScholarPath, you agree to the collection and use of information in
            accordance with this policy. We will never sell your personal data.
          </p>
        </>
      ),
    },
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: (
        <>
          <p><strong style={{ color: "#f8fafc" }}>Account information</strong> — When you create an account, we collect your name,
          email address, and any profile details you provide (education level, state, category, income range).
          This is used solely to match you with eligible scholarships.</p>
          <p><strong style={{ color: "#f8fafc" }}>Usage data</strong> — We collect anonymous data about
          pages you visit, scholarships you view, and features you use. This helps us improve the platform.</p>
          <p><strong style={{ color: "#f8fafc" }}>Bookmarks and reminders</strong> — Scholarships you save
          and reminders you set are stored and linked to your account.</p>
          <p><strong style={{ color: "#f8fafc" }}>Communications</strong> — If you contact us, we retain
          your messages to provide support.</p>
        </>
      ),
    },
    {
      id: "how-we-use",
      heading: "How we use your data",
      body: (
        <ul className="space-y-2 list-none">
          {[
            "To match your profile with eligible scholarships",
            "To send deadline reminders via email, SMS, or WhatsApp (only if you opt in)",
            "To improve scholarship recommendations and platform features",
            "To respond to support requests",
            "To send product updates (you can unsubscribe at any time)",
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                style={{ background: "#34d399" }} />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "data-storage",
      heading: "Data storage & security",
      body: (
        <>
          <p>
            Your data is stored securely on Supabase (PostgreSQL), hosted in data centres
            that comply with SOC 2 Type II standards. All data is encrypted in transit (TLS)
            and at rest.
          </p>
          <p>
            We implement row-level security (RLS) so that your data is only accessible to you.
            No other user can view your bookmarks, reminders, or profile details.
          </p>
        </>
      ),
    },
    {
      id: "third-parties",
      heading: "Third-party services",
      body: (
        <>
          <p>We use the following third-party services:</p>
          <ul className="space-y-2 mt-2 list-none">
            {[
              ["Supabase",  "Database and authentication"],
              ["Vercel",    "Hosting and edge functions"],
              ["Resend",    "Transactional emails"],
              ["MSG91",     "WhatsApp and SMS reminders"],
              ["Razorpay",  "Payment processing (premium plans)"],
            ].map(([name, role]) => (
              <li key={name} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                  style={{ background: "#34d399" }} />
                <span><strong style={{ color: "#f8fafc" }}>{name}</strong> — {role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Each third party has its own privacy policy. We do not share your data with
            any third party for marketing purposes.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: (
        <>
          <p>You have the right to:</p>
          <ul className="space-y-2 mt-2 list-none">
            {[
              "Access the personal data we hold about you",
              "Correct inaccurate data",
              "Request deletion of your account and all associated data",
              "Withdraw consent for reminder notifications at any time",
              "Export your data in a portable format",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                  style={{ background: "#34d399" }} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at <strong style={{ color: "#f8fafc" }}>{EMAIL}</strong>.
            We will respond within 7 business days.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      heading: "Cookies",
      body: (
        <p>
          We use cookies for authentication and anonymous analytics. See our{" "}
          <a href="/cookie-policy" style={{ color: "#34d399", textDecoration: "underline" }}>
            Cookie Policy
          </a>{" "}
          for full details.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Contact",
      body: (
        <p>
          For privacy-related queries, email <strong style={{ color: "#f8fafc" }}>{EMAIL}</strong> with
          the subject line &ldquo;Privacy Request&ldquo;. We do not have a dedicated DPO but will respond promptly.
        </p>
      ),
    },
  ]

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your data"
      updated="1 September 2025"
      sections={sections}
    />
  )
}


// ══════════════════════════════════════════════════════════════
// FILE 2: src/components/legal/TermsPage.tsx
// ══════════════════════════════════════════════════════════════

export function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      heading: "Acceptance of terms",
      body: (
        <p>
          By accessing or using ScholarPath at {SITE}, you agree to be bound by these Terms of Use
          and our Privacy Policy. If you do not agree, please do not use the platform.
          These terms apply to all visitors, registered users, and anyone who accesses the service.
        </p>
      ),
    },
    {
      id: "service",
      heading: "Description of service",
      body: (
        <>
          <p>
            ScholarPath is a scholarship discovery platform that aggregates information about Indian
            scholarships and provides tools to help students find, track, and apply for them.
          </p>
          <p>
            We are an <strong style={{ color: "#f8fafc" }}>information aggregator only</strong>. We do not
            run, administer, or guarantee any scholarship. All scholarship applications are submitted
            directly to the scholarship provider. Acceptance, rejection, or changes to a scholarship
            are entirely at the discretion of the scholarship provider.
          </p>
        </>
      ),
    },
    {
      id: "accuracy",
      heading: "Accuracy of information",
      body: (
        <>
          <p>
            We make every effort to keep scholarship information accurate and up to date. However,
            scholarship details (amounts, deadlines, eligibility) may change without notice.
          </p>
          <p>
            <strong style={{ color: "#f8fafc" }}>Always verify details directly on the official scholarship website
            before applying.</strong> ScholarPath is not liable for decisions made based on information
            presented on this platform.
          </p>
        </>
      ),
    },
    {
      id: "user-accounts",
      heading: "User accounts",
      body: (
        <>
          <p>You are responsible for maintaining the security of your account credentials.
          Notify us immediately at {EMAIL} if you suspect unauthorised access.</p>
          <p>You must not create accounts for others, use automated tools to create accounts,
          or impersonate any person or organisation.</p>
        </>
      ),
    },
    {
      id: "prohibited",
      heading: "Prohibited conduct",
      body: (
        <ul className="space-y-2 list-none">
          {[
            "Scraping, crawling, or harvesting data from the platform without permission",
            "Attempting to bypass authentication or access other users' data",
            "Submitting false or misleading scholarship listings",
            "Using the platform to send spam or unsolicited messages",
            "Reverse engineering any part of the service",
            "Using the platform for any unlawful purpose",
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                style={{ background: "#f87171" }} />
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      body: (
        <p>
          All content on ScholarPath — including the platform design, code, logo, and original
          written content — is the property of ScholarPath and protected under applicable copyright
          law. You may not reproduce or redistribute any part of the platform without prior
          written permission.
        </p>
      ),
    },
    {
      id: "premium",
      heading: "Premium plans and payments",
      body: (
        <>
          <p>
            Premium subscriptions are billed monthly via Razorpay. You may cancel at any time
            from your account settings. Cancellation takes effect at the end of the current
            billing period. We do not offer refunds for partial months.
          </p>
          <p>
            We reserve the right to change premium pricing with 30 days&apos; notice. Existing
            subscribers will be notified by email before any price change takes effect.
          </p>
        </>
      ),
    },
    {
      id: "disclaimers",
      heading: "Disclaimers & limitation of liability",
      body: (
        <>
          <p>
            ScholarPath is provided &ldquo;as is&ldquo; without warranties of any kind. We do not guarantee
            uninterrupted access, error-free operation, or that any scholarship will be available
            when you apply.
          </p>
          <p>
            To the maximum extent permitted by law, ScholarPath shall not be liable for any
            indirect, incidental, or consequential damages arising from your use of the platform,
            including missed scholarship deadlines or unsuccessful applications.
          </p>
        </>
      ),
    },
    {
      id: "governing-law",
      heading: "Governing law",
      body: (
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts in [Your City], India.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these Terms of Use from time to time. We will notify registered users
          by email of material changes. Continued use of the platform after changes constitutes
          acceptance of the updated terms.
        </p>
      ),
    },
  ]

  return (
    <LegalLayout
      title="Terms of Use"
      subtitle="Rules and guidelines for using ScholarPath"
      updated="1 September 2025"
      sections={sections}
    />
  )
}


// ══════════════════════════════════════════════════════════════
// FILE 3: src/components/legal/CookiePolicyPage.tsx
// ══════════════════════════════════════════════════════════════

export function CookiePolicyPage() {
  const sections = [
    {
      id: "what-are-cookies",
      heading: "What are cookies?",
      body: (
        <p>
          Cookies are small text files stored on your device when you visit a website. They allow
          the site to remember your preferences, keep you logged in, and collect anonymous
          analytics. ScholarPath uses cookies minimally and only for essential functions and
          analytics.
        </p>
      ),
    },
    {
      id: "cookies-we-use",
      heading: "Cookies we use",
      body: (
        <div className="space-y-5">
          {[
            {
              name:     "Authentication cookies",
              type:     "Essential",
              color:    "#34d399",
              provider: "Supabase",
              purpose:  "Keep you logged in across page visits. These are required for the platform to function. They expire when you sign out or after 7 days of inactivity.",
              canOpt:   false,
            },
            {
              name:     "Analytics cookies",
              type:     "Analytics",
              color:    "#60a5fa",
              provider: "Vercel Analytics / self-hosted",
              purpose:  "Anonymous page view counts and performance data. No personally identifiable information is collected. We use this to understand which pages are most useful.",
              canOpt:   true,
            },
            {
              name:     "Preference cookies",
              type:     "Functional",
              color:    "#f59e0b",
              provider: "ScholarPath (localStorage)",
              purpose:  "Remember your theme preference (dark/light) and recently viewed scholarships. Stored locally in your browser, never sent to our servers.",
              canOpt:   true,
            },
          ].map(c => (
            <div key={c.name} className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[14px] font-bold" style={{ color: "#f8fafc" }}>{c.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: c.color + "18", color: c.color }}>
                  {c.type}
                </span>
                {!c.canOpt && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>
                    Required
                  </span>
                )}
              </div>
              <p className="text-[12px] mb-1" style={{ color: "rgba(248,250,252,0.4)" }}>
                Provider: {c.provider}
              </p>
              <p className="text-[13px]">{c.purpose}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "third-party",
      heading: "Third-party cookies",
      body: (
        <p>
          We do not use Google Analytics, Facebook Pixel, or any advertising cookies.
          We do not display third-party ads on ScholarPath. The only third-party cookies
          set are authentication cookies from Supabase, which are essential for login to work.
        </p>
      ),
    },
    {
      id: "managing",
      heading: "Managing cookies",
      body: (
        <>
          <p>
            You can control and delete cookies through your browser settings. Note that disabling
            essential authentication cookies will prevent you from logging in to ScholarPath.
          </p>
          <p>
            To clear cookies in common browsers:
          </p>
          <ul className="space-y-1.5 mt-2 list-none">
            {[
              ["Chrome",  "Settings → Privacy and Security → Clear browsing data"],
              ["Firefox", "Options → Privacy & Security → Cookies and Site Data → Clear Data"],
              ["Safari",  "Preferences → Privacy → Manage Website Data"],
              ["Edge",    "Settings → Privacy → Clear browsing data"],
            ].map(([browser, path]) => (
              <li key={browser} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                  style={{ background: "#34d399" }} />
                <span><strong style={{ color: "#f8fafc" }}>{browser}:</strong> {path}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "consent",
      heading: "Your consent",
      body: (
        <p>
          By continuing to use ScholarPath after seeing our cookie notice, you consent to our
          use of essential cookies. Analytics and preference cookies are only set after you
          acknowledge the cookie banner. You can withdraw consent at any time by clearing
          your browser cookies.
        </p>
      ),
    },
    {
      id: "updates",
      heading: "Updates to this policy",
      body: (
        <p>
          We may update this Cookie Policy as we add or remove features. The &ldquo;Last updated&ldquo;
          date at the top of this page will reflect any changes. We will notify registered users
          of material changes by email.
        </p>
      ),
    },
  ]

  return (
    <LegalLayout
      title="Cookie Policy"
      subtitle="How ScholarPath uses cookies and local storage"
      updated="1 September 2025"
      sections={sections}
    />
  )
}