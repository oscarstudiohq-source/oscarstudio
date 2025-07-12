import { supabase } from '@/lib/supabaseClient';

const durationKeyMap = {
    "0": "30 sec",
    "1": "60 sec",
    "2": "90 sec",
    "5": "5 min",
    "10": "10 min",
    "20": "20 min",
};

function toSnakeCaseOrder(data) {
    return {
        name: data.name,
        email: data.email,
        raw_footage: data.rawFootage,
        inspiration_video: data.inspirationVideo,
        country: data.country.name,
        currency: data.country.currency,
        currency_symbol: data.country.currency_symbol,
        social: data.social,
        videos_count: Number(data.videosCount),
        video_type: data.videoType,

        video_duration: durationKeyMap[data.videoDuration] ?? data.videoDuration,

        delivery_speed: data.deliverySpeed,
        editing_tier: data.editingTier,
        aspect_ratio: data.aspectRatio,
        language: data.language,
        notes: data.notes,

        order_id: data.order_id,
        price_original: Math.round(data.price_original ?? 0),
        price_discounted: Math.round(data.price_discounted ?? 0),
        amount_paid: Math.round(data.amount_paid ?? 0),
        payment_mode: data.paymentMode,
        payment_gateway: data.payment_gateway,
        is_coupon_applied: data.is_coupon_applied ?? false,
        discount_rate: data.discount_rate ?? 0
    };
}

export async function POST(req) {
    const orderData = await req.json();
    const formattedOrder = toSnakeCaseOrder(orderData);

    // ✅ Add amount_pending logic
    const finalPrice = formattedOrder.price_discounted || formattedOrder.price_original || 0;
    const amount_pending = finalPrice - (formattedOrder.amount_paid || 0);
    formattedOrder.amount_pending = amount_pending;

    console.log("formattedOrder:", formattedOrder);

    const { error } = await supabase.from('orders').insert([formattedOrder]);

    if (error) {
        console.error("Supabase insert error:", error);
        return new Response(JSON.stringify({ success: false, error }), {
            status: 500,
        });
    }

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
    });
}
