import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from '@/lib/supabaseAdmin';
const supabase = supabaseAdmin;

export async function POST(req) {
    const { order_id } = await req.json();

    if (!order_id) {
        return NextResponse.json({ status: "error", message: "Missing order_id" }, { status: 400 });
    }

    try {
        // ✅ Step 1: Update payment_verified_at to current timestamp
        const { error: updateError } = await supabase
            .from("orders")
            .update({ payment_verified_at: new Date().toISOString() })
            .eq("order_id", order_id);

        if (updateError) {
            console.error("Failed to update payment_verified_at:", updateError);
            return NextResponse.json({ status: "error", message: "Failed to verify payment" }, { status: 500 });
        }

        // ✅ Step 2: Fetch full order row after update
        const { data: orderData, error: fetchError } = await supabase
            .from("orders")
            .select("*")
            .eq("order_id", order_id)
            .single();

        if (fetchError || !orderData) {
            return NextResponse.json({ status: "error", message: "Order not found" }, { status: 404 });
        }

        // ✅ Step 3: Send back data so you can email it
        return NextResponse.json({
            status: "success",
            message: "Order verified and fetched",
            order: orderData,
        });

    } catch (err) {
        console.error("Unexpected error verifying order:", err);
        return NextResponse.json({ status: "error", message: "Unexpected error" }, { status: 500 });
    }
}
