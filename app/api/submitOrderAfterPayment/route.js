import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { log } from "../../../lib/logger";

const supabase = supabaseAdmin;

export async function POST(req) {
    const { order_id } = await req.json();

    if (!order_id) {
        return NextResponse.json(
            { success: false, message: "Missing order_id" },
            { status: 400 }
        );
    }

    try {
        // ✅ Step 1: Fetch order's current payment_verified_at value
        const { data: existingOrder, error: fetchError1 } = await supabase
            .from("orders")
            .select("payment_verified_at")
            .eq("order_id", order_id)
            .single();

        if (fetchError1 || !existingOrder) {
            log.error("❌ Failed to fetch order:", fetchError1);
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // 🛑 Step 2: If already verified, exit early
        if (existingOrder.payment_verified_at) {
            log.info("✅ Order already verified. Skipping update & email.");
            return NextResponse.json(
                { success: false, message: "Order already verified." },
                { status: 200 }
            );
        }

        // ✅ Step 3: Update payment_verified_at with IST timestamp & Payment URL -for remaining payment or to check order
        const now = new Date();
        const istNow = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // IST offset
        const istFormatted = istNow.toISOString().slice(0, 19).replace("T", " ");

        const isLocalhost = process.env.NODE_ENV !== 'production';
        const BASE_URL = isLocalhost ? 'http://192.168.29.73:3000' : 'https://tuesdaytrim.com';
        const paymentUrl = `${BASE_URL}/pay?order_id=${order_id}`;

        const { error: updateError } = await supabase
            .from("orders")
            .update({
                payment_verified_at: istFormatted,
                payment_url: paymentUrl, 
            })
            .eq("order_id", order_id);

        if (updateError) {
            log.error("❌ Failed to update payment_verified_at:", updateError);
            return NextResponse.json(
                { success: false, message: "Failed to verify payment" },
                { status: 500 }
            );
        }

        // ✅ Step 4: Fetch updated order data
        const { data: orderData, error: fetchError2 } = await supabase
            .from("orders")
            .select("*")
            .eq("order_id", order_id)
            .single();

        if (fetchError2 || !orderData) {
            return NextResponse.json(
                { success: false, message: "Order not found after update" },
                { status: 404 }
            );
        }

        // ✅ Step 5: Send confirmation email
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const emailRes = await fetch(`${baseUrl}/api/sendConfirmationEmail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        });

        const emailResult = await emailRes.json();

        if (!emailResult.success) {
            log.info("❌ Email not sent");
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Order verified but email failed. Please contact support.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Order verified and email sent" },
            { status: 200 }
        );
    } catch (err) {
        log.error("❌ Unexpected error:", err);
        return NextResponse.json(
            { success: false, message: "Unexpected error" },
            { status: 500 }
        );
    }
}
