import { Resend } from 'resend';

// Only initialize if the key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'hello@omnithread.ai';

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) return;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to OmniThread AI 🎉',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>Welcome to OmniThread AI, ${name}!</h2>
          <p>We're thrilled to have you on board.</p>
          <p>You have <strong>3 free credits</strong> to start turning your single pieces of content into 10 platform-ready posts instantly.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">Go to Dashboard</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendCreditWarningEmail(email: string) {
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You have 1 credit left this month ⚠️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>Heads up! You're almost out of credits.</h2>
          <p>You have just <strong>1 free credit left</strong> for this month.</p>
          <p>Our Pro plan is coming soon. In the meantime, join our waitlist to get early access!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px;">Join Pro Waitlist</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send credit warning email:', error);
  }
}
