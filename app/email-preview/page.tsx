import { thumbnailDescriptions } from "../screen/EditingTier";
// pages/email-preview.js (for Next.js with pages router)
export default function EmailPreview() {
    const data = {
        name: "Akash",
        social: "youtube",
        order_id: "TT-123ABC",
        payment_verified_at: new Date().toISOString(),
        video_type: "short",
        videos_count: 3,
        video_duration: "60 sec",
        editing_tier: "studio",
        delivery_speed: "Standard",
        price_original: 1200,
        price_discounted: 1000,
        amount_paid: 500,
        amount_pending: 400,
        currency_symbol: "₹",
        is_coupon_applied: true,
        discount_rate: 20,
        payment_mode: "UPI",
        raw_footage: "https://example.com/raw",
        inspiration_video: "https://example.com/idea"
    };

    const SUPPORT_EMAIL = 'support@tuesdaytrim.com';

    const orderDate = new Date(data.payment_verified_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const expirationDate = new Date(new Date(data.payment_verified_at).setDate(new Date(data.payment_verified_at).getDate() + 30)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const formattedOrderDate = 'July 11, 2025';
    const formattedExpirationDate ='August 10, 2025';

    //pending amount start
    const hasPending = Number(data.amount_pending) > 0;

    const isLocalhost = process.env.NODE_ENV !== 'production';
    const BASE_URL = isLocalhost ? 'http://192.168.29.73:3000' : 'https://tuesdaytrim.com';
    const paymentUrl = `${BASE_URL}/pay?order_id=${data.order_id}`;

  const pendingBanner = hasPending
    ? `
      <div style="background-color: #FFF9D1; padding: 16px 24px; border-left: 4px solid #f59e0b; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px; color: #92400e; font-size: 16px; font-weight: 600;">
          Hi ${data.name || 'there'},
        </h3>
        <p style="margin: 0; color: #92400e; font-size: 16px;">
          You still have <strong>${data.currency_symbol}${data.amount_pending}</strong> pending for this order.
        </p>
        <a href="${paymentUrl}" style="display: inline-block; margin-top: 12px; background-color: #f59e0b; color: white; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 600;">
         Pay Remaining Amount
        </a>
      </div>
      `
    : '';

  const successBanner = !hasPending
    ? `
      <div style="background-color: #DCFCE7; padding: 16px 24px; border-left: 4px solid #22C55E; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px; color: #15803D; font-size: 16px; font-weight: 600;">
          Hi ${data.name || 'there'},
        </h3>
        <p style="margin: 0 0 12px; color: #15803D; font-size: 16px;">
          Your payment of <strong>${data.currency_symbol}${data.amount_paid}</strong> has been received. Your order will be processed shortly.
        </p>
        <a href="${paymentUrl}" style="display: inline-block; background-color: #22C55E; color: white; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: 600;">
          View Order
        </a>
      </div>
  `
    : '';
    //pending amount end

    return (
        <div dangerouslySetInnerHTML={{
            __html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);"> 
            <div style="background-color: #0d9488; color: white; padding: 24px; text-align: center;">
                <h2 style="margin: 0; font-size: 24px;">🎉 Order Confirmed!</h2>
                <p style="margin: 8px 0 0; font-size: 15px;">
                  Thank you for your order, ${data.name || 'valued customer'}! Your support means a lot.
                </p>
        
              </div>
        
              <div style="padding: 24px;">
              ${pendingBanner || successBanner}
                <h3 style="margin-bottom: 16px; color: #0f172a;">📋 Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Order ID:</td><td>${data.order_id}</td></tr>
                 <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Order Date:</td><td>${formattedOrderDate}</td></tr>
                <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Customer Name:</td><td>${data.name || '—'}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video For:</td><td>${data.social || '—'}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video Type:</td><td>${data.video_type}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Videos Count:</td><td>${data.videos_count}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Video Duration:</td><td>${data.video_duration}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Editing Tier:</td><td>${data.editing_tier}</td></tr>
                  ${data.video_type === 'long' && data.editing_tier
                  ? `<tr>
                  <td style="width: 220px; padding: 8px 0; font-weight: 600;">Included:</td>
                  <td>${data.videos_count} Free ${thumbnailDescriptions["studio"].title}</td>
                  </tr>`
                  : ''} 
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Delivery Speed:</td><td>${data.delivery_speed}</td></tr>
                  
                </table>
        
                <h3 style="margin-top: 32px; margin-bottom: 16px; color: #0f172a;">💳 Payment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Original Price:</td><td>${data.currency_symbol}${data.price_original}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Discounted Price:</td><td>${data.currency_symbol}${data.price_discounted}</td></tr>
                   <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Amount Paid:</td><td><strong>${data.currency_symbol}${data.amount_paid}</strong></td></tr>
                    ${Number(data.amount_pending) > 0
                    ? `<tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Amount Pending:</td><td><strong>${data.currency_symbol}${data.amount_pending}</strong></td></tr>`
                    : ''}
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Coupon Applied:</td><td>${data.is_coupon_applied ? 'Yes' : 'No'}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Discount Rate:</td><td>${data.discount_rate}%</td></tr>
                    <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Payment Mode:</td><td>${data.payment_mode}</td></tr>
                </table>
        
                <h3 style="margin-top: 32px; margin-bottom: 16px; color: #0f172a;">📋 Other Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Shared Video Link:</td><td>${data.raw_footage || '—'}</td></tr>
                  <tr><td style="width: 220px; padding: 8px 0; font-weight: 600;">Inspiration Video Link:</td><td>${data.inspiration_video || '—'}</td></tr>
                </table>
        
                <p style="margin-top: 32px;">We'll start working on your order shortly. If you have any questions, feel free to reply to this email.</p>
                <p style="margin-top: 16px;">
                  📅 This order is valid for 30 days and will expire on <strong>${formattedExpirationDate}</strong>.
                </p>
                <p style="margin-top: 16px;">– TuesdayTrim</p>
              </div>
        
              <div style="background-color: #f1f5f9; text-align: center; padding: 16px; font-size: 13px; color: #64748b;">
              Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #0d9488;">${SUPPORT_EMAIL}</a>
              </div>
            </div>
          </div>
      ` }} />
    );
}
  