export const adminSubmissionEmail = (submission) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;">
      <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#111827;color:#ffffff;padding:22px;">
          <h2 style="margin:0;">New Contact Submission</h2>
          <p style="margin:8px 0 0;color:#d1d5db;">SmartSend AI notification</p>
        </div>

        <div style="padding:24px;color:#111827;">
          <p><strong>Name:</strong> ${submission.fullName}</p>
          <p><strong>Email:</strong> ${submission.email}</p>
          <p><strong>Phone:</strong> ${submission.phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>

          <div style="margin-top:20px;">
            <strong>Message:</strong>
            <div style="margin-top:10px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;line-height:1.6;">
              ${submission.message}
            </div>
          </div>

          <p style="margin-top:20px;color:#6b7280;font-size:13px;">
            Submitted from IP: ${submission.ipAddress || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  `;
};

export const userConfirmationEmail = (submission) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#f6f7fb;padding:24px;">
      <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#2563eb;color:#ffffff;padding:22px;">
          <h2 style="margin:0;">Thank you, ${submission.fullName}</h2>
          <p style="margin:8px 0 0;color:#dbeafe;">We received your message successfully.</p>
        </div>

        <div style="padding:24px;color:#111827;">
          <p>Hello ${submission.fullName},</p>
          <p>Thanks for contacting us. Our team will review your message and get back to you soon.</p>

          <div style="margin-top:20px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
            <p><strong>Subject:</strong> ${submission.subject}</p>
            <p><strong>Your Message:</strong></p>
            <p style="line-height:1.6;">${submission.message}</p>
          </div>

          <p style="margin-top:24px;color:#6b7280;font-size:13px;">
            This is an automated confirmation email from SmartSend AI.
          </p>
        </div>
      </div>
    </div>
  `;
};