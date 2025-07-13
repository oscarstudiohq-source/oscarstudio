import { log } from "../lib/logger";

export async function submitOrder({ orderId, formData, price, isCouponApplied, discountRate, paymentGateway }) {
    const enrichedOrderData = {
        ...formData,
        order_id: orderId,
        price_original: Math.round(price.original ?? 0),
        price_discounted: Math.round(price.discounted ?? 0),
        amount_paid: Math.round(price.paying ?? 0),
        is_coupon_applied: isCouponApplied,
        discount_rate: discountRate,
        currency_symbol: formData.country?.currency_symbol || "₹",
        payment_gateway: paymentGateway
    };

    // 🔹 Submit order
    try {
        const orderRes = await fetch("/api/submitOrder", {
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
                message: "Unable to create your order. Please contact support.",
            };
          
        }
        else{
            log.info("order saved!");
            // ✅ Success
            return {
                status: "success",
                step: "complete",
                message: "Order created successfully.",
            };
        }

    } catch (error) {
        log.error("Unexpected error:", error);
        return {
            status: "error",
            step: "unknown",
            message: "Something went wrong. Please try again.",
        };
    }
}
  