export async function submitOrderAndSendEmail({ formData, price, isCouponApplied, discountRate }) {
    const enrichedOrderData = {
        ...formData,
        price_original: Number((price.original ?? 0).toFixed(2)),
        price_discounted: Number((price.discounted ?? 0).toFixed(2)),
        is_coupon_applied: isCouponApplied,
        discount_rate: discountRate,
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
            console.log("order not saved");
            return {
                status: "error",
                step: "order",
                message: "We were unable to confirm your order. Please contact support.",
            };
          
        }
        else{
            console.log("order saved!")
        }

        // 🔹 Send confirmation email
        const emailRes = await fetch("/api/sendConfirmationEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrichedOrderData),
        });

        const emailResult = await emailRes.json();

        if (!emailResult.success) {
            console.log("email not sent");
            return {
                status: "error",
                step: "email",
                message: "Order confirmed but We were unable to send your order receipt. Please contact support.",
            };
        }
        else {
            console.log("email sent");
        }
        // ✅ Success
        return {
            status: "success",
            step: "complete",
            message: "Order and email sent successfully.",
        };

    } catch (error) {
        console.error("Unexpected error:", error);
        return {
            status: "error",
            step: "unknown",
            message: "Something went wrong. Please try again.",
        };
    }
}
  