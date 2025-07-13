'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from 'react';
import Header from "../../components/Header";
import { loadCashfreeSdk } from "../../lib/loadCashfreeSdk";
import ConfirmationModal from "@/components/ConfirmationModal"; // adjust path if needed
import { nanoid } from 'nanoid';
import { log } from "../../lib/logger";

function PayPage1() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const refetch = searchParams.get("refetch"); // force re-run

    const orderId = searchParams.get('order_id'); // base order ID
    const settlementId = searchParams.get('settlement_id') ?? orderId; // fallback to base if missing
    const urlStatus = searchParams.get("payment_status");

    const [order, setOrder] = useState<any>(null);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (orderId) {
            fetch(`/api/get-order?order_id=${orderId}`)
                .then((res) => res.json())
                .then((data) => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch((err) => {
                    log.error("Error loading order:", err);
                    setLoading(false);
                });
        }
    }, [orderId, refetch]);

    // Verify payment status
    useEffect(() => {
        if (urlStatus === "checking" && settlementId) {
            const verifyPayment = async () => {
                setProcessing(true);
                setShowModal(false);
                try {
                    const res = await fetch(`/api/checkPaymentStatus?order_id=${settlementId}`);
                    const result = await res.json();

                    if (result.order_status === "PAID") {

                        // Step 1: Call confirm-settlement API
                        const confirmRes = await fetch("/api/confirm-settlement", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                cashfree_order_id: settlementId,
                                amount: Number(result.order_amount),
                            }),
                        });

                        const confirmResult = await confirmRes.json();

                        // Step 2: Handle confirm-settlement response
                        const baseOrderId = settlementId.replace(/-settlement-\d+$/, "");

                        if (confirmResult.success) {
                            setShowModal(true);

                        } else {
                            alert(confirmResult.message);
                        }


                    } else {
                        alert('Payment not successful ');

                        log.warn("Payment not successful:", result.order_status);
                        // Optionally set a status like `setError()` here
                    }
                } catch (err) {
                    log.error("Error checking payment status:", err);
                } finally {
                    setProcessing(false);
                    router.replace(`/pay?order_id=${orderId}&refetch=${Date.now()}`);
                }
            };

            verifyPayment();
        }
    }, [urlStatus, settlementId, router]);


    if (loading) {
        return <div className="p-6">Loading...</div>;
    }
    if (!order || !order.payment_verified_at) {
        return <div className="p-6 text-red-500">Order not found.</div>;
    }

    const orderDate = new Date(order.payment_verified_at);
    const formattedOrderDate = orderDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const expiryDate = new Date(
        new Date(order.payment_verified_at).setDate(
            new Date(order.payment_verified_at).getDate() + 30
        )
    ).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    function formatDate(dateString: string | null | undefined): string {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    const paid = Number(order.amount_paid || 0);
    const settled = Number(order.settlement_paid || 0);
    const discounted = Number(order.price_discounted || 0);
    const pendingFromDB = Number(order.amount_pending || 0);

    // 1. Recalculate pending amount
    const calculatedPending = Math.max(discounted - (paid + settled), 0);

    // 2. Use the higher of DB or calculated (safe fallback)
    const actualPendingAmount = Math.max(calculatedPending, pendingFromDB);

    // 3. Optional: warn if DB value is outdated
    if (calculatedPending !== pendingFromDB) {
        log.warn("Mismatch: amount_pending in DB is outdated or incorrect");
    }

    // 4. Final validation checks
    const isAmountPaidValid = paid === 0 || !!order.payment_verified_at;
    const isSettlementPaidValid = settled === 0 || !!order.settlement_verified_at;
    const isPaymentAccurate = paid + settled >= discounted;
    const isPendingCorrect = calculatedPending === 0;

    const isFullyPaid =
        isAmountPaidValid &&
        isSettlementPaidValid &&
        isPaymentAccurate &&
        isPendingCorrect;

    const isPending = !isFullyPaid;


    const handleCashfreeSettlement = async (order: any, actualPendingAmount: number) => {
        if (!order || actualPendingAmount <= 0) {
            alert("No pending amount to pay.");
            return;
        }

        setProcessing(true);

        const uniqueSettlementOrderId = `${order.order_id}-settlement-${Date.now()}`;

        try {
            const res = await fetch("/api/createPaymentSession", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: uniqueSettlementOrderId,
                    order_amount: actualPendingAmount,
                    customer_id: (order.name || "guest_user").replace(/[^a-zA-Z0-9_-]/g, "_"),
                    customer_email: order.email || "test@example.com",
                    customer_phone: order.phone || "9999999999",
                    return_from: "pay_page", // ✅ Important
                }),
            });

            const data = await res.json();

            if (!data.payment_session_id) {
                alert("Payment session creation failed.");
                return;
            }

            const Cashfree = await loadCashfreeSdk();
            const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
            const cf = new Cashfree({ mode });

            cf.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "modal",
            });

        } catch (err) {
            log.error("Cashfree error:", err);
            alert("Settlement payment failed. Please try again.");
        }
        finally {
            setProcessing(false);
        }
    };


    return (
        <div>
            <Header />

            <div className="bg-gray-100 py-10 px-4 flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 overflow-hidden">

                    {/* Sidebar */}
                    <div className="bg-white border-r p-6 md:col-span-1 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h2>
                            <p className="text-sm text-gray-500">Placed on {formattedOrderDate}</p>
                        </div>

                        <div className="text-sm space-y-2">
                            <Detail label="Order ID" value={order.order_id} />
                            <Detail label="Customer" value={order.name} />
                            <Detail label="Platform" value={order.social} />
                            <Detail label="Video Type" value={order.video_type} />
                            <Detail label="Videos Count" value={order.videos_count} />
                            <Detail label="Duration" value={order.video_duration} />
                            <Detail label="Editing Tier" value={order.editing_tier} />
                            <Detail label="Delivery Speed" value={order.delivery_speed} />
                        </div>
                    </div>

                    {/* Main Section */}
                    <div className="p-6 md:col-span-2 flex flex-col justify-start">

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {isPending ? "Complete Your Payment" : "Payment Summary"}
                                </h1>
                                {isPending ? (
                                    <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                        Pending
                                    </span>
                                ) : (
                                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                        Paid
                                    </span>
                                )}

                            </div>

                            <p className="text-gray-600 text-sm mb-6">
                                Thank you for your order! Below are your payment details.
                            </p>

                            {isPending && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800 font-medium text-sm">
                                        You have <strong>₹{actualPendingAmount}</strong> pending.
                                    </p>
                                </div>
                            )}


                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h2>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <Detail label="Original Price" value={`₹${order.price_original}`} />
                                <Detail label="Discounted Price" value={`₹${order.price_discounted}`} />
                                <Detail label="Initial Payment" value={`₹${order.amount_paid}`} />
                                {settled > 0 && (
                                    <Detail label="Final Payment" value={`₹${settled}`} />
                                )}
                                {isPending && (
                                    <Detail label="Amount Pending" value={`₹${actualPendingAmount}`} />
                                )}
                                <Detail label="Coupon Applied" value={order.is_coupon_applied ? 'Yes' : 'No'} />
                                <Detail label="Discount Rate" value={`${order.discount_rate}%`} />
                                <Detail label="Payment Mode" value={order.payment_mode} />

                                {!isPending && (
                                    <Detail
                                        label="Payment Date"
                                        value={
                                            order.settlement_verified_at
                                                ? formatDate(order.settlement_verified_at) // show final payment
                                                : order.payment_verified_at
                                                    ? formatDate(order.payment_verified_at)  // fallback if only one payment
                                                    : "—"
                                        }
                                    />
                                )}
                            </div>

                            {!isPending && (
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="col-span-2 text-base font-semibold">
                                        <Price
                                            label="Total Payment"
                                            value={`₹${(order.amount_paid || 0) + (settled || 0)}`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 text-xs text-gray-500">
                                ⏳ Order valid until <strong>{expiryDate}</strong>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="py-8">
                            {isPending ? (
                                <button
                                    onClick={() => handleCashfreeSettlement(order, actualPendingAmount)}
                                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-medium transition cursor-pointer"
                                >
                                    {processing
                                        ? "Processing..."
                                        : `Pay ${order.currency_symbol}${actualPendingAmount} Now`}
                                </button>

                            ) : (
                                <div className="mt-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                                    ✅ Payment completed successfully. No pending amount.
                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Loading overlay */}
            <div className="flex flex-col md:flex-row gap-5">

                {processing && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white text-black px-6 py-5 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in">
                            <svg
                                className="w-8 h-8 text-emerald-600 animate-spin mb-3"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                                ></path>
                            </svg>
                            <p className="text-lg font-medium">Processing payment...</p>
                            <p className="text-sm text-gray-600 mt-1">Please wait a moment</p>
                        </div>
                    </div>
                )}

                {/* ✅ Confirmation modal */}
                {showModal &&
                    <ConfirmationModal
                        onClose={() => setShowModal(false)}
                        title="Payment Successful!"
                        description="Your payment has been confirmed. Thank you for your purchase!"
                    />
                }
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex text-sm leading-snug mb-2">
            <span className="w-30 text-gray-600 font-medium">{label}:</span>
            <span className="text-gray-900">{value || '—'}</span>
        </div>
    );
}
function Price({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="w-full border-t pt-3 mt-3">
            <div className="text-2xl font-bold text-gray-900">
                <span className="text-sm text-gray-600 font-medium">{label}:</span>{' '}
                {value || '—'}
            </div>
        </div>
    );
}


export default function PayPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">⏳ Loading...</div>}>
            <PayPage1 />
        </Suspense>
    );
}
