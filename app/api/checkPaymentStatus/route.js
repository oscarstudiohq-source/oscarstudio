import axios from "axios";
import { log } from "../../../lib/logger";

const BASE_URL =
    process.env.CASHFREE_ENV === "sandbox"
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
        return new Response(
            JSON.stringify({ error: "Missing order_id" }),
            { status: 400 }
        );
    }

    try {
        const response = await axios.get(`${BASE_URL}/${order_id}`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "2022-09-01",
                "x-client-id": process.env.CASHFREE_APP_ID,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY,
            },
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        log.error("❌ Error fetching payment status:", err.response?.data || err.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch payment status" }),
            { status: 500 }
        );
    }
}
