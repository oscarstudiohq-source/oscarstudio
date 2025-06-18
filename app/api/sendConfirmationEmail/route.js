// app/api/sendConfirmationEmail/route.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // 👈 Add this to .env.local

const durationKeyMap = {
  "0": "30 sec",
  "1": "60 sec",
  "2": "90 sec",
  "3": "3 min",
  "5": "5 min",
  "7": "7 min",
  "10": "10 min",
  "15": "15 min",
  "20": "20 min",
};


export async function POST(req) {
  const data = await req.json();

  const video_duration = durationKeyMap[data.videoDuration] ?? data.videoDuration;

  // ✅ Basic validation
  if (!data.email) {
    console.log("❌ Email not provided.");
    return new Response(JSON.stringify({ success: false, error: 'Missing email address' }), {
      status: 400,
    });
  }

  const SUPPORT_EMAIL = 'support@tuesdaytrim.com';
  const FROM_EMAIL = 'TuesdayTrim <support@tuesdaytrim.com>';
  const BCC_EMAILS = ['akashbajaj777@gmail.com'];
  
  try {
    const response = await resend.emails.send({
      // from: 'Your Studio <onboarding@resend.dev>', // You can customize this
      from: FROM_EMAIL,
      to: [data.email],
      bcc: BCC_EMAILS,
      subject: '✅ Your Order has been Received!',
      html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
     <div style="background-color: #0d9488; color: white; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h2>

        <p style="margin: 8px 0 0; font-size: 15px;">
          Thank you for your order, ${data.name || 'valued customer'}! Your support means a lot.
        </p>

        <p style="margin-top: 16px;"><strong>This is a test email.</strong> If you received this by mistake, please ignore it.</p>

      </div>


      <div style="padding: 24px;">
        <h3 style="margin-bottom: 16px; color: #0f172a;">📋 Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Customer Name:</td><td>${data.name || '—'}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video For:</td><td>${data.social || '—'}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video Type:</td><td>${data.videoType}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Videos Count:</td><td>${data.videosCount}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video Duration:</td><td>${video_duration}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Editing Tier:</td><td>${data.editingTier}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Included:</td><td>Free Thumbnail Design</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Delivery Speed:</td><td>${data.deliverySpeed}</td></tr>
        </table>

        <h3 style="margin-top: 32px; margin-bottom: 16px; color: #0f172a;">💳 Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Original Price:</td><td>$${data.price_original}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Discounted Price:</td><td><strong>$${data.price_discounted}</strong></td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Coupon Applied:</td><td>${data.is_coupon_applied ? 'Yes' : 'No'}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Discount Rate:</td><td>${data.discount_rate}%</td></tr>
        </table>

        <h3 style="margin-top: 32px; margin-bottom: 16px; color: #0f172a;">📋 Other Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Shared Video Link:</td><td>${data.rawFootage || '—'}</td></tr>
          <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Inspiration Video Link:</td><td>${data.inspirationVideo || '—'}</td></tr>
        </table>

        <p style="margin-top: 32px;">We'll start working on your order shortly. If you have any questions, feel free to reply to this email.</p>
        <p style="margin-top: 16px;">– Your Studio</p>
      </div>

      <div style="background-color: #f1f5f9; text-align: center; padding: 16px; font-size: 13px; color: #64748b;">
      Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #0d9488;">${SUPPORT_EMAIL}</a>
      </div>
    </div>
  </div>
`,

    });

    console.log("✅ Resend API response:", response);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}
