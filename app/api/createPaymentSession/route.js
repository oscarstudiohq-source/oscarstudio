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
    } = body;

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
