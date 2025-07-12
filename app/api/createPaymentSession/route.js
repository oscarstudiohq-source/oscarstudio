import axios from "axios";

const BASE_URL =
    process.env.CASHFREE_ENV === "sandbox"
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

export async function POST(req) {
    const body = await req.json();
    const {
        order_id,
        order_amount,
        customer_id,
        customer_email,
        customer_phone,
        return_from // 👈 NEW
    } = body;

    // ✅ Get protocol + host from headers
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") || host?.startsWith("192.") ? "http" : "https";
    // const return_url = `${protocol}://${host}/?payment_status=checking&order_id=${order_id}`;
    
    // 👇 Use the right return_url
    const baseOrderId = order_id.replace(/-settlement.*/, "");

    const return_url =
        return_from === "pay_page"
            ? `${protocol}://${host}/pay?payment_status=checking&order_id=${baseOrderId}&settlement_id=${order_id}`
            : `${protocol}://${host}/?payment_status=checking&order_id=${order_id}&settlement_id=${order_id}`;

    try {
        const response = await axios.post(
            BASE_URL,
            {
                order_id,
                order_amount,
                order_currency: "INR",
                customer_details: {
                    customer_id,
                    customer_email,
                    customer_phone,
                },
                order_meta: {
                    return_url, // ✅ use dynamic return URL based on request host
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-version": "2022-09-01",
                    "x-client-id": process.env.CASHFREE_APP_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                },
            }
        );

        console.log("session created");

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Cashfree API Error:", err.response?.data || err.message);
        return new Response(
            JSON.stringify({ error: "Failed to create payment session" }),
            { status: 500 }
        );
    }
}
        