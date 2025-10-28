import { sendEmail } from "../sendEmail.js";

export const sendResetPasswordEmail = async ({ user, url }) => {
  const html = `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4; color:#111;">
    <p style="margin:0 0 12px 0;">Hello <strong>${user.name}</strong>,</p>

    <p style="margin:0 0 18px 0;">
      We received a request to reset the password for your account:
      <br/>
      <strong>${user.email}</strong>
    </p>

    <!-- Reset Password Button -->
    <p style="margin:0 0 18px 0;">
      <a
        href="${url}"
        target="_blank"
        rel="noopener"
        role="button"
        style="display:inline-block; text-decoration:none; padding:12px 22px; border-radius:6px; background:#1a73e8; color:#fff; font-weight:600;"
      >
        Reset Password
      </a>
    </p>

    <p style="margin:18px 0 0 0; color:#777; font-size:12px;">
      If you didn’t request a password reset, you can safely ignore this email.
      This link will expire soon for security reasons.
    </p>
  </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "Reset Your Password",
    html,
  });
};
