// app/api/phonepe-check-status/route.ts
import { NextResponse } from "next/server";
import { phonepeClient } from "@/lib/phonepeClient";
import { log } from "../../../lib/logger";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    try {
        const response = await phonepeClient.getOrderStatus(orderId);
        return NextResponse.json(response);
    } catch (err) {
        log.error("❌ Error checking payment status", err);
        return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
    }
}
