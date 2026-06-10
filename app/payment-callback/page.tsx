// 'use client';
// export const dynamic = 'force-dynamic';

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";

// function CallbackContent() {
//     const searchParams = useSearchParams();
//     const merchantOrderId = searchParams.get("merchantTransactionId");
//     const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

//     useEffect(() => {
//         const checkStatus = async () => {
//             if (!merchantOrderId) return setStatus("failed");

//             const res = await fetch(`/api/phonepe-check-status?orderId=${merchantOrderId}`);
//             const data = await res.json();

//             if (data.state === "COMPLETED") {
//                 setStatus("success");
//             } else {
//                 setStatus("failed");
//             }
//         };

//         checkStatus();
//     }, [merchantOrderId]);

//     return (
//         <div className="p-8 text-center">
//             {status === "loading" && <p>⏳ Verifying your payment...</p>}
//             {status === "success" && <p>✅ Payment Successful! Thank you.</p>}
//             {status === "failed" && <p>❌ Payment Failed or Cancelled.</p>}
//         </div>
//     );
// }

// export default function PaymentCallbackPage() {
//     return (
//         <Suspense fallback={<div className="p-8 text-center">⏳ Loading...</div>}>
//             <CallbackContent />
//         </Suspense>
//     );
// }
