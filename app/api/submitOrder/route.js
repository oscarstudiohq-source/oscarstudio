import { supabase } from '@/lib/supabaseClient';

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

function toSnakeCaseOrder(data) {
    return {
        name: data.name,
        email: data.email,
        raw_footage: data.rawFootage,
        inspiration_video: data.inspirationVideo,
        country: data.country,
        social: data.social,
        videos_count: Number(data.videosCount),
        video_type: data.videoType,
        
        video_duration: durationKeyMap[data.videoDuration] ?? data.videoDuration,

        delivery_speed: data.deliverySpeed,
        editing_tier: data.editingTier,
        aspect_ratio: data.aspectRatio,
        language: data.language,
        notes: data.notes,

        // ✅ Directly use the flattened fields
        price_original: Number((data.price_original ?? 0).toFixed(2)),
        price_discounted: Number((data.price_discounted ?? 0).toFixed(2)),
        is_coupon_applied: data.is_coupon_applied ?? false,
        discount_rate: data.discount_rate ?? 0
    };
}


export async function POST(req) {
    const orderData = await req.json();
    // console.log("Submitting order data:", orderData);

    const formattedOrder = toSnakeCaseOrder(orderData);

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
