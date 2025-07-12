import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const supabase = supabaseAdmin;

export async function POST(req) {
    const { cashfree_order_id, amount } = await req.json();

    if (!cashfree_order_id || !amount) {
        return NextResponse.json(
            { success: false, message: "Missing cashfree_order_id or amount" },
            { status: 400 }
        );
    }

    const baseOrderId = cashfree_order_id.replace(/-settlement-\d+$/, "");

    try {
        // Step 1: Fetch current order
        const { data: existingOrder, error: fetchError } = await supabase
            .from("orders")
            .select("settlement_verified_at")
            .eq("order_id", baseOrderId)
            .single();

        if (fetchError || !existingOrder) {
            console.error("❌ Order not found:", fetchError);
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // Step 2: Skip if already settled
        if (existingOrder.settlement_verified_at) {
            console.log("✅ Settlement already verified. Skipping update.");
            return NextResponse.json(
                { success: false, message: "Payment already made" },
                { status: 200 }
            );
        }

        // Step 3: Create IST timestamp
        const now = new Date();
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        // Step 4: Update settlement info
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                settlement_paid: amount,
                settlement_verified_at: istTime,
                amount_pending: 0,
                settlement_order_id: cashfree_order_id, // ✅ Save the full settlement ID
            })
            .eq("order_id", baseOrderId);


        if (updateError) {
            console.error("❌ Failed to update settlement:", updateError);
            return NextResponse.json(
                { success: false, message: "Failed to update settlement" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Settlement confirmed successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error("❌ Unexpected error:", err);
        return NextResponse.json(
            { success: false, message: "Unexpected error" },
            { status: 500 }
        );
    }
}
