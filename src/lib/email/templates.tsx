// ══════════════════════════════════════════════════════════════
// FILE 2: src/lib/email/templates.tsx
//
// Responsive HTML email template for deadline reminders.
// Works in Gmail, Apple Mail, Outlook.
// ══════════════════════════════════════════════════════════════

interface ReminderEmailProps {
  name:             string
  scholarshipTitle: string
  provider:         string
  amount:           number
  deadline:         string
  deadlineDays:     number
  applyUrl:         string
  scholarshipUrl:   string
}

export function reminderEmailHtml(p: ReminderEmailProps): string {
  const urgColor  = p.deadlineDays <= 7  ? "#f87171"
                  : p.deadlineDays <= 30 ? "#f59e0b"
                  :                        "#34d399"
  const urgLabel  = p.deadlineDays <= 0  ? "TODAY is the deadline!"
                  : p.deadlineDays === 1 ? "Tomorrow is the deadline!"
                  :                        `${p.deadlineDays} days left to apply`

  const fmtAmt = p.amount >= 100000
    ? `₹${(p.amount / 100000).toFixed(1)} lakh`
    : p.amount >= 1000
    ? `₹${(p.amount / 1000).toFixed(0)},000`
    : `₹${p.amount}`

  const fmtDeadline = new Date(p.deadline).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scholarship Deadline Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#020817;padding:28px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#34d399;border-radius:10px;width:32px;height:32px;text-align:center;vertical-align:middle;font-size:18px;">🎓</td>
                <td style="padding-left:10px;color:#f8fafc;font-size:16px;font-weight:700;letter-spacing:-0.3px;">ScholarPath</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Urgency banner -->
        <tr>
          <td style="background:${urgColor}18;border-bottom:2px solid ${urgColor}30;padding:12px 32px;">
            <p style="margin:0;color:${urgColor};font-size:13px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">
              ⏰ ${urgLabel}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 6px;color:#64748b;font-size:14px;">Hi ${p.name},</p>
            <p style="margin:0 0 24px;color:#0f172a;font-size:16px;line-height:1.6;">
              You saved <strong>${p.scholarshipTitle}</strong> — and the deadline is approaching.
              Don't miss your chance to apply!
            </p>

            <!-- Scholarship card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
                    ${p.provider}
                  </p>
                  <p style="margin:0 0 12px;color:#0f172a;font-size:17px;font-weight:800;line-height:1.3;">
                    ${p.scholarshipTitle}
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:24px;">
                        <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">Amount</p>
                        <p style="margin:0;color:#34d399;font-size:22px;font-weight:900;">${fmtAmt}</p>
                        <p style="margin:0;color:#94a3b8;font-size:11px;">/year</p>
                      </td>
                      <td>
                        <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">Deadline</p>
                        <p style="margin:0;color:${urgColor};font-size:15px;font-weight:700;">${fmtDeadline}</p>
                        <p style="margin:0;color:${urgColor};font-size:11px;font-weight:600;">${p.deadlineDays} days left</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td align="center">
                  <a href="${p.applyUrl}"
                    style="display:inline-block;background:#34d399;color:#020817;font-size:15px;
                           font-weight:800;text-decoration:none;padding:14px 36px;
                           border-radius:14px;letter-spacing:-0.2px;">
                    Apply Now →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Secondary link -->
            <p style="margin:0 0 24px;text-align:center;font-size:13px;color:#94a3b8;">
              Or <a href="${p.scholarshipUrl}" style="color:#34d399;text-decoration:underline;">
                view full details on ScholarPath
              </a>
            </p>

            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.7;">
              Good luck with your application! 🤞<br />
              — The ScholarPath team
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;">
            <p style="margin:0;color:#94a3b8;font-size:11px;text-align:center;line-height:1.6;">
              You received this because you set a reminder on ScholarPath.<br />
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/reminders"
                style="color:#34d399;text-decoration:underline;">
                Manage your reminders
              </a>
              &nbsp;·&nbsp;
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy"
                style="color:#94a3b8;text-decoration:underline;">
                Privacy Policy
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}