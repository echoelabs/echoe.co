import type { APIRoute } from 'astro';

// Email HTML template
const getEmailHtml = (email: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
  <div style="margin: 0 auto; padding: 40px 20px; max-width: 560px;">

    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 32px;">
      <p style="font-size: 24px; font-weight: 600; color: #0f172a; letter-spacing: -0.5px; margin: 0;">echoe</p>
    </div>

    <!-- Heading -->
    <h1 style="font-size: 28px; font-weight: 600; color: #0f172a; letter-spacing: -0.5px; line-height: 1.3; margin: 0 0 24px;">You're on the list.</h1>

    <!-- Content -->
    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
      Thanks for signing up for early access to echoe. We're building the future of unified commerce — and you'll be among the first to experience it.
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
      We'll keep you updated on our progress and let you know as soon as we're ready to onboard early users.
    </p>

    <!-- Features Box -->
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0;">
      <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">What's coming:</p>
      <p style="font-size: 14px; line-height: 1.8; color: #64748b; margin: 0;">• Unified inbox for all your channels</p>
      <p style="font-size: 14px; line-height: 1.8; color: #64748b; margin: 0;">• AI-powered customer support</p>
      <p style="font-size: 14px; line-height: 1.8; color: #64748b; margin: 0;">• Seamless inventory management</p>
      <p style="font-size: 14px; line-height: 1.8; color: #64748b; margin: 0;">• Real-time order tracking</p>
    </div>

    <!-- Divider -->
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

    <!-- Footer -->
    <p style="font-size: 12px; line-height: 1.6; color: #94a3b8; margin: 0 0 8px;">
      This email was sent to ${email}. You're receiving this because you signed up for the echoe waitlist.
    </p>

    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      <a href="https://echoe.co" style="color: #64748b; text-decoration: underline;">echoe.co</a>
    </p>
  </div>
</body>
</html>
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = (await request.json()) as { email: string };

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Send welcome email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'echoe <waitlist@echoe.co>',
        to: [email],
        subject: "You're on the echoe waitlist",
        html: getEmailHtml(email),
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully joined waitlist' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: corsHeaders,
  });
};
