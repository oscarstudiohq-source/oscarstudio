import { NextResponse } from "next/server";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { randomUUID } from "crypto";
import { phonepeClient } from "@/lib/phonepeClient";

export async function POST() {
    const merchantOrderId = randomUUID();
    const amount = 10000; // ₹100

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/payment-callback`; // ✅ dynamic redirect

    const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .build();

    try {
        const response = await phonepeClient.pay(request);
        const redirect = response.redirectUrl;

        return NextResponse.json({ redirectUrl: redirect });
    } catch (err) {
        console.error("❌ Payment initiation failed", err);
        return NextResponse.json({ error: "Payment failed" }, { status: 500 });
    }
}
