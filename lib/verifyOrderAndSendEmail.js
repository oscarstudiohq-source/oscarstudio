import { log } from "../lib/logger";

export async function verifyOrderAndSendEmail({ order_id }) {
    const enrichedOrderData = {
        ...formData,
        order_id: orderId,
        price_original: Math.round(price.original ?? 0),
        price_discounted: Math.round(price.discounted ?? 0),
        amount_paid: Math.round(price.paying ?? 0),
        is_coupon_applied: isCouponApplied,
        discount_rate: discountRate,
        currency_symbol: formData.country?.currency_symbol || "₹",
    };

    // 🔹 Submit order
    try {
        const orderRes = await fetch("/api/verifyOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrichedOrderData),
        });

        const orderResult = await orderRes.json();

        if (!orderResult.success) {
            log.info("order not saved");
            return {
                status: "error",
                step: "order",
                message: "We were unable to confirm your order. Please contact support.",
            };
          
        }
        else{
            log.info("order saved!");
            // ✅ Success
            return {
                status: "success",
                step: "complete",
                message: "Temp Order created successfully.",
            };
        }


        // 🔹 Send confirmation email
        const emailRes = await fetch("/api/sendConfirmationEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrichedOrderData),
        });

        const emailResult = await emailRes.json();

        if (!emailResult.success) {
            log.info("email not sent");
            return {
                status: "error",
                step: "email",
                message: "Order confirmed but We were unable to send your order receipt. Please contact support.",
            };
        }
        else {
            log.info("email sent");
        }
        // ✅ Success
        return {
            status: "success",
            step: "complete",
            message: "Order and email sent successfully.",
        };

    } catch (error) {
        log.error("Unexpected error:", error);
        return {
            status: "error",
            step: "unknown",
            message: "Something went wrong. Please try again.",
        };
    }
}
  