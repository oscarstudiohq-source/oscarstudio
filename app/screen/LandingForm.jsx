"use client";
export const dynamic = 'force-dynamic';
import { log } from "../../lib/logger";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { loadScript } from "@paypal/paypal-js";
import { load } from "@cashfreepayments/cashfree-js"; // ✅ Use new SDK
import { getCashfreeMode } from "../../lib/getCashfreeMode";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitOrder } from "../../lib/submitOrder";
import ConfirmationModal from "@/components/ConfirmationModal"; // adjust path if needed
import { toast } from "sonner";
import { nanoid, customAlphabet } from "nanoid";
import { QrCode } from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip";
import {
    Film, Crown, Clock, Video, Smartphone, Monitor,
    ListOrdered,
    VideoIcon,
    Timer,
    Sparkles,
    LinkIcon,
    User,
    Mail,
    Info
} from "lucide-react"; // modern icons
import { thumbnailDescriptions } from "./EditingTier"; // adjust path if needed

const basePrices = {
    international: {
        short: {
            "30 sec": { studio: 39, studioPro: 59, studioMax: 75 },
            "60 sec": { studio: 50, studioPro: 74, studioMax: 99 },
            "90 sec": { studio: 64, studioPro: 95, studioMax: 124 },
        },
        long: {
            "5 min": { studio: 119, studioPro: 169, studioMax: 219 },
            "10 min": { studio: 179, studioPro: 239, studioMax: 329 },
            "20 min": { studio: 269, studioPro: 359, studioMax: 469 },
        }
    },
    //1710
    india: {
        short: {
            "30 sec": { studio: 1320, studioPro: 1980, studioMax: 2520 },
            "60 sec": { studio: 4, studioPro: 2460, studioMax: 3300 }, //test
            "90 sec": { studio: 2100, studioPro: 3120, studioMax: 4080 },
        },
        long: {
            "5 min": { studio: 3960, studioPro: 5640, studioMax: 7320 },
            "10 min": { studio: 6000, studioPro: 7920, studioMax: 10920 },
            "20 min": { studio: 9000, studioPro: 11940, studioMax: 15480 },
        }
    }
};


function LandingForm1() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [status, setStatus] = useState("checking");

    const [newOrderId, setNewOrderId] = useState(null);

    useEffect(() => {
        if (!orderId) return;

        const check = async () => {

            setLoading(true);
            setShowModal(false);
            try {
                const res = await fetch(`/api/checkPaymentStatus?order_id=${orderId}`);
                const data = await res.json();

                if (data.order_status === "PAID") {
                    // Create the order in your DB and send email
                    const submitRes = await fetch("/api/submitOrderAfterPayment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order_id: orderId }),
                    });

                    const rawText = await submitRes.text();
                    log.info("🪵 Response Text:", rawText);

                    let result;
                    try {
                        result = JSON.parse(rawText);
                    } catch (parseErr) {
                        log.error("❌ Failed to parse JSON from /api/submitOrderAfterPayment", parseErr);
                        alert("Something went wrong verifying your order.");
                        return;
                    }

                    if (result.success) {
                        // alert("✅ Payment made successfully & order verified");
                        setShowModal(true);

                    } else {
                        alert(`${result.message || "Unable to verify your order. Please contact support."}`);
                    }


                } else {
                    alert("Payment failed or not completed.");
                }
            } catch (e) {
                log.error(e);
                setStatus("error");
                alert("Payment failed or not completed.");
            }
            finally {
                setLoading(false);

                const baseUrl = process.env.NODE_ENV === "production"
                    ? "https://oscarstudio.in"
                    : "http://192.168.29.73:3000";

                // Generate the remaining payment URL
                const payUrl = `${baseUrl}/pay?order_id=${orderId}`;

                // Try opening in a new tab
                const newTab = window.open(payUrl, "_blank");

                if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                    // If popup was blocked, redirect in current tab instead
                    window.location.href = payUrl;
                }

                // Also clean the current page URL in the background (optional)
                router.replace(window.location.pathname, undefined, { shallow: true });
            }


        };

        check();
    }, [orderId]);

    const paypalRef = useRef(null);
    const [showPayPal, setShowPayPal] = useState(false);

    const [price, setPrice] = useState({ original: 0, discounted: 0, paying: 0 });
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [discountRate, setDiscountRate] = useState(20);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customAmount, setCustomAmount] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rawFootage: "",
        inspirationVideo: "",
        country: { name: "india", currency: "inr", currency_symbol: "₹" },
        social: "youtube",
        videosCount: "1",
        videoType: "short", // "short" or "long"
        videoDuration: "1", // like "1", "2", "5"
        deliverySpeed: "standard",
        editingTier: "studio", // "studio", "studioPro", "studioMax"
        aspectRatio: "",
        language: "en",
        notes: "",
        paymentMode: "full", // 'full','half','after','custom'
    });

    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        if (key === "country") {
            setShowPayPal(false);
        }
    };

    const durationKeyMap = {
        "0": "30 sec",
        "1": "60 sec",
        "2": "90 sec",
        "5": "5 min",
        "10": "10 min",
        "20": "20 min",
    };
    const shortKeys = ["0", "1", "2"];
    const longKeys = ["5", "10", "20"];

    // Price calculation
    const calculatePrice = () => {
        setShowPayPal(false);

        const { videoType, videoDuration, editingTier, videosCount } = formData;
        const durationKey = durationKeyMap[videoDuration];

        if (!videoType || !durationKey || !editingTier) {
            log.warn("Missing data in form:", formData);
            return { original: 0, discounted: 0, paying: 0 };
        }

        const tierPriceMap = basePrices[formData.country?.name]?.[videoType]?.[durationKey];


        if (!tierPriceMap) {
            log.warn(
                "No price found for",
                formData.country?.name,
                videoType,
                durationKey
            );
            return { original: 0, discounted: 0, paying: 0 };
        }

        const unitPrice = parseFloat(tierPriceMap[editingTier]) || 0;
        const count = parseInt(videosCount, 10) || 0;

        const original = Math.round(unitPrice * count);

        const discounted = isCouponApplied
            ? Math.round(original * ((100 - discountRate) / 100))
            : original;

        let paying = 0;

        if (formData.paymentMode === "full") {
            paying = discounted;
        } else if (formData.paymentMode === "half") {
            paying = Math.round(discounted / 2);
        } else if (formData.paymentMode === "after") {
            paying = Math.round(discounted * 0.25);
        } else if (formData.paymentMode === "custom") {
            paying = Math.round(customAmount || 0);
        } else {
            paying = discounted;
        }

        return {
            original,     // rounded integer
            discounted,   // rounded integer
            paying        // rounded integer
        };
    };

    // Update price whenever form data or coupon changes
    useEffect(() => {
        // 🔁 Reset coupon if payment mode is not full or half
        if (!["full", "half"].includes(formData.paymentMode) && isCouponApplied) {
            setIsCouponApplied(false);
        }

        const calculated = calculatePrice();
        setPrice(calculated);
    }, [
        formData.country,
        formData.videoType,
        formData.videoDuration,
        formData.editingTier,
        formData.videosCount,
        formData.paymentMode,
        isCouponApplied,
        discountRate,
        customAmount,
    ]);


    const validateForm = (formData) => {
        if (!formData.videosCount) {
            toast("Please select total videos you want to order.", {
                description: "Choose a quantity to proceed.",
                icon: <ListOrdered className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        if (!formData.videoType) {
            toast("Please select video format.", {
                description: "Pick between short or long format.",
                icon: <VideoIcon className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        if (!formData.videoDuration) {
            toast("Please select video length.", {
                description: "Select the length of your video.",
                icon: <Timer className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        if (!formData.editingTier) {
            toast("Please select an editing tier.", {
                description: "Choose from Studio, Studio Pro, or Studio Max.",
                icon: <Sparkles className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        // if (!formData.rawFootage) {
        //     toast("Please provide a link to your raw footage.", {
        //         description: "We need the footage link to begin editing.",
        //         icon: <LinkIcon className="text-red-500 w-5 h-5" />,
        //         position: "top-right",
        //         duration: 3000,
        //     });
        //     return false;
        // }

        if (!formData.name) {
            toast("Please enter your name.", {
                description: "We’ll use this for your order.",
                icon: <User className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        if (!formData.email) {
            toast("Please enter your email address.", {
                description: "So we can notify you when it’s ready.",
                icon: <Mail className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            toast("Invalid email format.", {
                description: "Please enter a valid email address like john@example.com.",
                icon: <Mail className="text-red-500 w-5 h-5" />,
                position: "top-right",
                duration: 3000,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = () => {

        try {
            // Custom payment not supported yet
            if (formData.paymentMode === "custom") {
                alert("Custom payment not supported yet");
                return; // prevent render
            }

            // Validate form data
            if (!validateForm(formData)) {
                return;
            }

            const { original, discounted, paying } = calculatePrice();

            if (
                !original || isNaN(original) ||
                !discounted || isNaN(discounted) ||
                paying == null || isNaN(paying)
            ) {
                alert("There was an issue calculating the price. Please check your selections.");
                return;
            }

            setPrice({ original, discounted, paying }); // Update price state

            // Decide payment method based on country
            if (formData.country?.name === "india") {

                createOrderAndPay("cashfree");

                // handlePhonePePayment();

            } else {

                createOrderAndPay("paypal");

                // setTimeout(() => setShowPayPal(true), 50); // Show PayPal
            }

            log.info("Submitted Data:", formData);
            log.info("Original Price:", original);
            log.info("Discounted Price:", discounted);
            log.info("Paying Price:", paying);

        } catch (e) {
            log.error("Error during submit:", e);
        }
    };


    const createNewOrderId = () => {
        const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
        const nanoid6 = customAlphabet(alphabet, 6);
        const tempOrderId = "TT-" + nanoid6(); // Example: TT-7X9KPT
        setNewOrderId(tempOrderId);
        return tempOrderId;
    };

    //only for testing emails
    const createOrderAndPay = async (paymentGateway) => {
        setLoading(true);
        try {
            const orderId = createNewOrderId();

            const result = await submitOrder({
                orderId,
                formData,
                price,
                isCouponApplied,
                discountRate,
                paymentGateway
            });

            if (result.status === "success") {

                if (paymentGateway == "cashfree") {
                    handleCashfreePayment(orderId);
                }
                else if (paymentGateway == "paypal") {
                    setTimeout(() => setShowPayPal(true), 50); // Show PayPal
                }
                else { }

            } else {
                alert(result.message); // Friendly message shown to user
            }

        } catch (err) {
            log.error("Unexpected error:", err);
            alert("Something went wrong after payment.");
        } finally {
            setLoading(false);
        }
    };


    const handleCashfreePayment = async (orderId) => {
        const amount = price.paying;
        if (amount <= 0) return alert("Invalid amount.");

        setLoading(true);

        try {
            // Step 1: Create payment session
            const res = await fetch("/api/createPaymentSession", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    order_amount: amount,
                    customer_id: (formData.email || "guest_user").replace(/[^a-zA-Z0-9_-]/g, "_"),
                    customer_email: formData.email || "test@example.com",
                    customer_phone: formData.phone || "9999999999",
                    return_from: "landing_page",
                }),
            });

            const data = await res.json();
            if (!data.payment_session_id) {
                alert("Payment session creation failed.");
                return;
            }

            // Step 2: Load Cashfree SDK
            const mode = getCashfreeMode();
            const cashfree = await load({ mode });

            await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self", // or "modal"
            });


        } catch (err) {
            log.error("❌ Cashfree payment error:", err);
            alert("Payment initiation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Submit handler
    const handleSubmit1 = () => {
        try {
            //validation
            if (!validateForm(formData)) {
                return;
            }

            const { original, discounted, paying } = calculatePrice();
            const finalPrice = parseFloat(discounted);

            if (!finalPrice || isNaN(finalPrice)) {
                alert("There was an issue calculating the price. Please check your selections.");
                return;
            }

            setShowPayPal(false);
            setPrice({ original, discounted, paying }); // Store both for UI reference
            setTimeout(() => setShowPayPal(true), 50);

            log.info("Submitted Data:", formData);
            log.info("Original Price:", original);
            log.info("Discounted Price:", discounted);
            log.info("Paying Price:", paying);
        } catch (e) {
            log.error("Error during submit:", e);
        }
    };

    //only for testing emails
    const testHandleEmailClick = async () => {
        setLoading(true);
        try {
            const result = await submitOrderAndSendEmail1({
                formData,
                price,
                isCouponApplied,
                discountRate,
            });

            if (result.status === "success") {
                setShowModal(true);
            } else {
                alert(result.message); // Friendly message shown to user
            }

        } catch (err) {
            log.error("Unexpected error:", err);
            alert("Something went wrong after payment.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        if (!showPayPal || !paypalRef.current) return;

        // toast("PayPal is not available at the moment. Please try again later.", {
        //     description: "Try a different method or contact support.",
        //   });
        // return;

        const clientId =
            process.env.NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_PROD
                : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;

        paypalRef.current.innerHTML = ""; // Clear previous buttons

        loadScript({
            "client-id": clientId,
            currency: "USD",
            commit: true,
            components: "buttons",
            "data-sdk-integration-source": "button-factory",
        })
            .then((paypal) => {
                if (!paypal) {
                    log.error("PayPal SDK not loaded.");
                    return;
                }
                else {
                    log.info("PayPal SDK loaded successfully");
                }

                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: price.paying,
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        setLoading(true);
                        try {
                            await actions.order.capture();

                            log.info(newOrderId);
                            // Create the order in your DB and send email
                            const submitRes = await fetch("/api/submitOrderAfterPayment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ order_id: newOrderId }),
                            });

                            const rawText = await submitRes.text();
                            log.info("🪵 Response Text:", rawText);

                            let result;
                            try {
                                result = JSON.parse(rawText);
                            } catch (parseErr) {
                                log.error("❌ Failed to parse JSON from /api/submitOrderAfterPayment", parseErr);
                                alert("Something went wrong verifying your order.");
                                return;
                            }

                            if (result.success) {
                                // alert("✅ Payment made successfully & order verified");
                                setShowModal(true);
                            } else {
                                alert(`${result.message || "Unable to verify your order. Please contact support."}`);
                            }

                        } catch (err) {
                            log.error("Unexpected error:", err);
                            alert("Something went wrong after payment.");
                        } finally {
                            setLoading(false);
                            router.replace(window.location.pathname, undefined, { shallow: true });
                        }
                    },
                    onError: (err) => {
                        log.error("PayPal Error:", err);
                    },
                }).render(paypalRef.current);
            })
            .catch((err) => {
                log.error("Failed to load PayPal SDK:", err);
            });
    }, [showPayPal, price]); // <-- include showPayPal here

    const formatPrice = (amount) => {
        return Number(amount).toFixed(0);
    };

    const formatPriceWithSmallDecimals = (amount) => {
        const fixed = Number(amount).toFixed(0); // force no decimal
        return (
            <span className="text-emerald-400 font-bold text-lg">
                {fixed}
            </span>
        );
    };

    const getEffectiveThumbnailValue = () => {
        const tier = formData.editingTier;
        const desc = thumbnailDescriptions[tier];

        if (!tier || !desc) return 0;

        const baseValue = Number(desc.value.replace('₹', ''));

        if (formData.videoType === 'short') {
            if (tier === 'studio') return 15;
            if (tier === 'studioPro') return 25;
            if (tier === 'studioMax') return 35;
        }

        return baseValue;
    };

    const totalThumbValue = formData.editingTier
        ? (getEffectiveThumbnailValue() * Number(formData.videosCount)).toFixed(0)
        : "0";



    const [showTooltip, setShowTooltip] = useState(false);


    const [showUpiModal, setShowUpiModal] = useState(false);


    return (
        <div className="">

            <Card className="px-1 sm:px-2 py-4 shadow-xl w-full ">
                <CardContent className="space-y-4 text-sm px-2 sm:px-2 md:px-5">


                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            {/* Left: Heading */}
                            <div>
                                <h2 className="text-xl font-bold text-[#7D5B39]">
                                    Submit Your Video for Editing
                                </h2>
                            </div>

                            {/* Right: Info section or additional content */}

                        </div>



                    </div>

                    <div className="flex flex-col md:flex-row gap-5">

                        {/* Left - 60% */}
                        <div className="w-full md:w-[60%]">
                            <div className="flex flex-col gap-3 rounded-lg px-3 py-4 sm:p-5 p-6 shadow-md">


                                <div className="font-semibold text-base text-gray-800 mb-2">
                                    Edit this Footage
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-full">
                                        <Input
                                            type="url"
                                            className="w-full text-sm"
                                            value={formData.rawFootage}
                                            onChange={(e) => handleChange("rawFootage", e.target.value)}
                                            placeholder="Google Drive, Dropbox link"
                                        />
                                    </div>

                                    <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                className="p-2 border border-gray-300"
                                                onClick={() => setShowTooltip((prev) => !prev)}
                                            >
                                                <Info className="w-4 h-4 text-gray-700" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="top"
                                            className="text-xs max-w-sm bg-[#7D5B39] text-white rounded px-3 py-2 shadow"
                                        >
                                            <p className="font-semibold mb-1">📤 Upload your raw footage to a folder using one of the platforms below:</p>

                                            <p className="mt-2">
                                                <strong>Google Drive:</strong> Upload all footage into a folder → Right-click the folder → “Get link” → Set access to <em>Anyone with the link</em> → <em>Ensure downloads are not restricted in advanced sharing settings</em> → Paste the folder link here.
                                            </p>

                                            <p className="mt-2">
                                                <strong>Dropbox:</strong> Upload your footage to a folder → Click “Share” on the folder → “Copy link” → Ensure the link allows view/download access → <em>Ensure downloads are not restricted</em> → Paste the folder link here.
                                            </p>

                                            <p className="mt-2">
                                                <strong>YouTube (Unlisted):</strong> Upload your video as <em>Unlisted</em> → Copy the video URL → Paste it here.
                                            </p>

                                            <p className="mt-3 text-amber-300 font-medium">
                                                ✔️ Make sure we can view or download the footage without logging in.
                                            </p>
                                        </TooltipContent>


                                    </Tooltip>
                                </div>
                                {/* <p className="text-xs text-gray-500 mt-0">
                                    📂 Please upload all related video files into a single folder and paste the shared link here.
                                    Make sure access is set to <em>Anyone with the link</em> and downloads are not restricted.
                                </p> */}
                                <div className="flex items-center gap-3 mb-2 mt-1">
                                    <div className="flex-grow h-px bg-zinc-300" />
                                    <span className="text-xs text-zinc-500 whitespace-nowrap">Your Requirements</span>
                                    <div className="flex-grow h-px bg-zinc-300" />
                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* country */}
                                    <div className="w-full">
                                        <Select
                                            value={JSON.stringify(formData.country)}
                                            onValueChange={(val) => handleChange("country", JSON.parse(val))}
                                        >
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={JSON.stringify({ name: "india", currency: "inr", currency_symbol: "₹" })}>
                                                    India (INR)
                                                </SelectItem>
                                                <SelectItem value={JSON.stringify({ name: "international", currency: "usd", currency_symbol: "$" })}>
                                                    Outside India (USD)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>

                                    <div className="w-full">
                                        <Select
                                            onValueChange={(val) => handleChange("editingTier", val)}
                                            value={formData.editingTier}
                                        >
                                            <SelectTrigger className="w-full text-sm">
                                                <div className="flex items-center gap-2 text black">
                                                    {formData.editingTier === "studio" && (
                                                        <>
                                                            <Film className="w-4 h-4 text-blue-600" />
                                                            <span className="text-blue-700 font-medium">Studio</span>
                                                        </>
                                                    )}
                                                    {formData.editingTier === "studioPro" && (
                                                        <>
                                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                                            <span className="text-yellow-600 font-medium">Studio Pro</span>
                                                        </>
                                                    )}
                                                    {formData.editingTier === "studioMax" && (
                                                        <>
                                                            <Crown className="w-4 h-4 text-emerald-500" />
                                                            <span className="text-emerald-600 font-medium">Studio Max</span>
                                                        </>
                                                    )}
                                                    {!formData.editingTier && (
                                                        <SelectValue placeholder="Editing Tier" />
                                                    )}

                                                </div>
                                            </SelectTrigger>

                                            <SelectContent className="bg-white shadow-md rounded-md p-2">
                                                <SelectItem value="studio">
                                                    <div className="flex items-start gap-3">
                                                        <Film className="w-4 h-4 mt-0.5 text-blue-600" />
                                                        <div>
                                                            <span className="text-sm font-medium text-blue-700">Studio</span>
                                                            <p className="text-xs text-blue-500">Standard quality editing</p>
                                                            {formData.videoType !== 'short' && (
                                                                <p className="text-sm text-blue-500 font-semibold">
                                                                    + Free{" "}
                                                                    {thumbnailDescriptions['studio'].value}{" "}
                                                                    {thumbnailDescriptions['studio'].title}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </SelectItem>

                                                <SelectItem value="studioPro">
                                                    <div className="flex items-start gap-3">
                                                        <Sparkles className="w-4 h-4 mt-0.5 text-yellow-500" />
                                                        <div>
                                                            <span className="text-sm font-medium text-yellow-600">Studio Pro</span>
                                                            <p className="text-xs text-yellow-500">Premium transitions & effects</p>
                                                            {formData.videoType !== 'short' && (
                                                                <p className="text-sm text-yellow-500 font-semibold">
                                                                    + Free {thumbnailDescriptions['studioPro'].value}{" "}
                                                                    {thumbnailDescriptions['studioPro'].title}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </SelectItem>

                                                <SelectItem value="studioMax">
                                                    <div className="flex items-start gap-3">
                                                        <Crown className="w-4 h-4 mt-0.5 text-emerald-500" />
                                                        <div>
                                                            <span className="text-sm font-medium text-emerald-600">Studio Max</span>
                                                            <p className="text-xs text-emerald-500">Elite production + speed</p>
                                                            {formData.videoType !== 'short' && (
                                                                <p className="text-sm text-emerald-500 font-semibold">
                                                                    + Free {thumbnailDescriptions['studioMax'].value}{" "}
                                                                    {thumbnailDescriptions['studioMax'].title}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                    </div>

                                    {/* Delivery Speed - Full Width */}
                                    {/* <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("deliverySpeed", val)} defaultValue="standard">
                                        <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard (5 days)</SelectItem>
                                            <SelectItem value="express">Express (2 days)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}

                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="w-full">
                                        <Select onValueChange={(val) => handleChange("social", val)} defaultValue="youtube">
                                            <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="youtube">YouTube</SelectItem>
                                                <SelectItem value="tiktok">TikTok</SelectItem>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full">
                                        <Select
                                            onValueChange={(val) => {
                                                let updatedVideoType = formData.videoType;

                                                // Auto-set video type only for known packs
                                                if (val === "4" || val === "8") {
                                                    updatedVideoType = "long";
                                                } else if (val === "5" || val === "10" || val === "15") {
                                                    updatedVideoType = "short";
                                                }

                                                // Update form data
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    videosCount: val,
                                                    videoType: updatedVideoType,
                                                    videoDuration: updatedVideoType === "short" ? "1" : "5", // optional: adjust default duration
                                                }));
                                            }}
                                            value={formData.videosCount}
                                        >
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent className="bg-white shadow-md rounded-md p-2">
                                                {/* One-Time Orders */}
                                                <div className="px-2 py-1 text-xs text-gray-400 tracking-wide">Single/Custom Orders</div>
                                                <SelectItem value="1">1 Video</SelectItem>
                                                <SelectItem value="2">2 Videos</SelectItem>
                                                <SelectItem value="3">3 Videos</SelectItem>

                                                {/* Long Videos Pack */}
                                                <div className="px-2 py-1 text-xs text-yellow-500 tracking-wide">Long Video Packs</div>
                                                <SelectItem value="4">4 Long Videos</SelectItem>
                                                <SelectItem value="8">8 Long Videos</SelectItem>

                                                {/* Shorts & Reels Pack */}
                                                <div className="px-2 py-1 text-xs text-emerald-500 tracking-wide">Shorts & Reels Packs</div>
                                                <SelectItem value="5">5 Shorts</SelectItem>
                                                <SelectItem value="10">10 Shorts</SelectItem>
                                                <SelectItem value="15">15 Shorts</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="w-full">
                                        <Select
                                            onValueChange={(val) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    videoType: val,
                                                    videoDuration: val === "short" ? "1" : "5", // default duration based on type
                                                }));
                                            }}
                                            value={formData.videoType}
                                        >
                                            <SelectTrigger className="text-sm w-full">
                                                <SelectValue placeholder="Select Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="short">Shorts / Reels</SelectItem>
                                                <SelectItem value="long">Long Video</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Video Duration Dropdown */}
                                    <div className="w-full">
                                        <Select
                                            onValueChange={(val) =>
                                                setFormData((prev) => ({ ...prev, videoDuration: val }))
                                            }
                                            value={formData.videoDuration}
                                        >
                                            <SelectTrigger className="text-sm w-full">
                                                <SelectValue placeholder="Select Duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(formData.videoType === "short" ? shortKeys : longKeys).map((key) => (
                                                    <SelectItem key={key} value={key}>
                                                        {durationKeyMap[key]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>


                                <div className="flex items-center gap-3 mb-2 mt-1">
                                    <div className="flex-grow h-px bg-zinc-300" />
                                    <span className="text-xs text-zinc-500 whitespace-nowrap">Customer Details & Editing Instructions</span>
                                    <div className="flex-grow h-px bg-zinc-300" />
                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="w-full">
                                        <Input
                                            className="w-full text-sm"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            placeholder="Your Name*"
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Input
                                            className="w-full text-sm"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            placeholder="you@example.com*"
                                            autoComplete="email"
                                            required
                                        />

                                    </div>

                                    <div className="w-full">
                                        {/* <Tooltip>
                                            <TooltipTrigger asChild> */}
                                        <Input
                                            className="text-sm"
                                            type="url"
                                            value={formData.inspirationVideo}
                                            onChange={(e) => handleChange("inspirationVideo", e.target.value)}
                                            placeholder="Inspiration video link (YouTube/Instagram, Optional)"
                                        // title="Inspiration video link (YouTube/Instagram, Optional)"
                                        />
                                        {/* </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="text-xs max-w-xs bg-[#7D5B39] text-[#fff] rounded px-3 py-2 shadow"
                                            >
                                                Paste a reference video link (YouTube or Instagram, optional)<br />
                                                This helps us understand the style or format you’re aiming for.
                                            </TooltipContent>
                                        </Tooltip> */}
                                    </div>
                                    <div className="w-full">
                                        <Select onValueChange={(val) => handleChange("language", val)} defaultValue="en">
                                            <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Language" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="hi">Hindi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <Textarea
                                        className="resize-none text-sm"
                                        value={formData.notes}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 4000) {
                                                handleChange("notes", e.target.value);
                                            }
                                        }}
                                        placeholder="Editing Instructions (Optional)"
                                        rows={4}
                                        maxLength={4000}
                                    />
                                    <div className="text-xs text-muted-foreground text-right">
                                        {formData.notes.length}/4000
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right - 40% */}
                        <div className="w-full md:w-[40%] flex flex-col space-y-3">


                            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-md">



                                <div className="font-semibold text-base text-gray-800 mb-4">
                                    Choose Payment Type
                                </div>

                                {/* Radio buttons for payment mode */}
                                <div className="flex flex-col gap-4 mb-4">
                                    {/* Pay Full Amount */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="full"
                                            checked={formData.paymentMode === "full"}
                                            onChange={() => handleChange("paymentMode", "full")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay Full Amount</div>
                                            <div className="text-xs text-gray-600">
                                                Fastest delivery. No dues later.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Pay Half Now */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="half"
                                            checked={formData.paymentMode === "half"}
                                            onChange={() => handleChange("paymentMode", "half")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay Half Now</div>
                                            <div className="text-xs text-gray-600">
                                                Pay 50% now. Settle the rest after delivery.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Pay After Delivery */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="after"
                                            checked={formData.paymentMode === "after"}
                                            onChange={() => handleChange("paymentMode", "after")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay After Delivery</div>
                                            <div className="text-xs text-gray-600">
                                                Pay 25% now. Settle the rest after delivery.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Custom Payment */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="custom"
                                            checked={formData.paymentMode === "custom"}
                                            onChange={() => handleChange("paymentMode", "custom")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Custom Payment</div>
                                            <div className="text-xs text-gray-600">
                                                For balances, settlements, or special pricing. Not for new orders.
                                            </div>
                                        </div>
                                    </label>
                                </div>


                                <div className="text-xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-3">
                                    <span className="text-sm font-medium text-zinc-400 pb-4">Amount:</span>

                                    {isCouponApplied ? (
                                        <>
                                            {/* USD Price with discount */}
                                            <div className="flex items-baseline gap-1">
                                                <span className="line-through text-zinc-400 text-base">
                                                    {formData.country?.currency_symbol}{formatPrice(price.original)}
                                                </span>
                                                <span className="text-emerald-500 text-lg font-semibold">
                                                    {formData.country?.currency_symbol}{formatPriceWithSmallDecimals(price.discounted)}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* USD Price without discount */}
                                            <span className="text-emerald-500 text-lg font-semibold">
                                                {formData.country?.currency_symbol}{formatPriceWithSmallDecimals(price.original)}
                                            </span>
                                        </>
                                    )}

                                </div>
                                <div className="mb-2">
                                    {/* {!isCouponApplied ? (
                                        <p
                                            onClick={() => setIsCouponApplied(true)}
                                            // className="inline-block text-xs font-semibold text-emerald-700 bg-gray-100 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                                            className="inline-block text-xs font-semibold text-[#0f8e5d] bg-[#f1f5f9] px-2 py-1 rounded border border-[#c7e5d6] shadow-sm cursor-pointer hover:bg-[#e6f4ee] transition"
                                        >
                                            Apply Coupon ({discountRate}% OFF)
                                        </p>
                                    ) : (
                                        <p className="inline-block text-xs font-semibold text-green-800 bg-green-100 border border-green-300 px-2 py-1 rounded-md">
                                            ✅ Coupon Applied ({discountRate}% OFF)
                                        </p>
                                    )} */}

                                    {["full", "half"].includes(formData.paymentMode) && (
                                        !isCouponApplied ? (
                                            <p
                                                onClick={() => setIsCouponApplied(true)}
                                                className="inline-block text-xs font-semibold text-[#0f8e5d] bg-[#f1f5f9] px-2 py-1 rounded border border-[#c7e5d6] shadow-sm cursor-pointer hover:bg-[#e6f4ee] transition"
                                            >
                                                Apply Coupon ({discountRate}% OFF)
                                            </p>
                                        ) : (
                                            <p className="inline-block text-xs font-semibold text-green-800 bg-green-100 border border-green-300 px-2 py-1 rounded-md">
                                                ✅ Coupon Applied ({discountRate}% OFF)
                                            </p>
                                        )
                                    )}


                                    <div className="flex flex-col items-start gap-2">
                                        {/* Discount Messaging */}
                                        {!isCouponApplied ? (
                                            <p className="text-sm text-emerald-400 mt-2">
                                                🎁 Special Offer: Ending Soon!
                                            </p>
                                        ) : (
                                            <p className="text-sm text-emerald-400 mt-2">
                                                🎉 Enjoy your savings!
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Custom amount field (if selected) */}
                                {formData.paymentMode === "custom" && (
                                    <div className="mb-4">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Enter custom amount ({formData.country?.currency_symbol || "Amount"})
                                        </label>


                                        <input
                                            type="number"
                                            min={1}
                                            placeholder={
                                                formData.country?.currency_symbol
                                                    ? `e.g. ${formData.country.currency_symbol}100`
                                                    : ""
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#003087] focus:border-[#003087] focus:outline-none"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    {formData.country ? (
                                        formData.country.name === "india" ? (
                                            // 💰 Cashfree for Indian customers
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${loading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "cursor-pointer bg-[#003087] hover:bg-[#0874e4]"
                                                    }`}
                                            >
                                                {loading
                                                    ? "Processing..."
                                                    : `Pay ${formData.country.currency_symbol}${price.paying}`}
                                            </button>
                                        ) : (
                                            // 💳 PayPal for international customers
                                            <Button
                                                onClick={handleSubmit}
                                                className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${loading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "cursor-pointer bg-[#003087] hover:bg-[#0874e4]"
                                                    }`}
                                            >
                                                Continue with PayPal ({formData.country.currency_symbol}{price.paying})
                                            </Button>
                                        )
                                    ) : null}
                                </div>

                                {/* <span className="text-xs text-zinc-400">
                                    All prices include platform fees and taxes.
                                </span> */}
                            </div>

                            {formData.videoType !== 'short' &&
                                formData.editingTier && thumbnailDescriptions[formData.editingTier] && (
                                    <div className="mt-1 mb-5 space-y-1">

                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${thumbnailDescriptions[formData.editingTier].color}`}>
                                                🎁 +{formData.videosCount} Free {formData.country.currency_symbol}{getEffectiveThumbnailValue()} {thumbnailDescriptions[formData.editingTier].title}
                                            </span>
                                            <div
                                                className={`text-sm font-semibold ${thumbnailDescriptions[formData.editingTier].color}`}
                                            >
                                                ({formData.country.currency_symbol}{totalThumbValue})
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* ✅ PayPal buttons container  */}
                            {showPayPal && <div ref={paypalRef} className="w-full" />}

                        </div>
                    </div>


                    {/* ✅ Loading overlay */}
                    <div className="flex flex-col md:flex-row gap-5">

                        {loading && (
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
                                    <p className="text-lg font-medium">Processing your order...</p>
                                    <p className="text-sm text-gray-600 mt-1">Please wait a moment</p>
                                </div>
                            </div>
                        )}

                        {/* ✅ Confirmation modal */}
                        {showModal &&
                            <ConfirmationModal
                                onClose={() => setShowModal(false)}
                                title="Thank you for ordering!"
                                description="Your order has been placed. A confirmation email has been sent to your inbox."
                            />
                        }

                    </div>


                    {/* OR Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-300" />
                        </div>

                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm font-semibold text-zinc-500 uppercase">
                                OR
                            </span>
                        </div>
                    </div>
                    <div className="mb-5 text-center">

                        <button
                            type="button"
                            onClick={() => setShowUpiModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        >
                            <QrCode className="h-5 w-5" />
                            <span>Pay via UPI</span>
                        </button>

                        <p className="mt-2 text-xs text-zinc-500">
                            Having trouble with online checkout? Use UPI instead.
                        </p>

                    </div>

                    {/* UPI M */}
                    {showUpiModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                            onClick={() => setShowUpiModal(false)}
                        >
                            <div
                                className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close */}
                                <button
                                    onClick={() => setShowUpiModal(false)}
                                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                                >
                                    ×
                                </button>

                                <div className="grid items-center gap-8 p-8 md:grid-cols-[1fr_300px]">

                                    {/* Left */}
                                    <div className="rounded-2xl bg-zinc-50 p-6">

                                        <h2 className="text-2xl font-bold text-zinc-900">
                                            Pay via UPI
                                        </h2>

                                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                                            If online checkout isn't working, scan the QR code or pay using the UPI ID.
                                        </p>

                                        <div className="mt-8">

                                            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                                                UPI ID
                                            </p>

                                            <div className="mt-2 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                                                <p className="font-mono text-base font-semibold text-zinc-900 break-all">
                                                    akashbajaj777-1@okicici
                                                </p>
                                            </div>

                                        </div>

                                        <div className="mt-8 flex flex-wrap gap-2">

                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                                                Google Pay
                                            </span>

                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                                                PhonePe
                                            </span>

                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                                                Paytm
                                            </span>

                                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">
                                                BHIM
                                            </span>

                                        </div>

                                    </div>

                                    {/* Right */}
                                    <div className="flex justify-center">

                                        <img
                                            src="/upi-qr.png"
                                            alt="UPI QR Code"
                                            className="max-h-[400px] w-auto object-contain"
                                        />

                                    </div>

                                </div>

                            </div>
                        </div>
                    )}




                    {/* Trust Badges */}
                    <div className="mt-0">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-600 bg-white px-3 py-2 border-t border-zinc-200">
                            <div className="flex items-center gap-1">
                                <img src="/icons/credit-card.png" alt="" className="h-4 w-4 opacity-70" />
                                <span>Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/icons/ssl.png" alt="" className="h-4 w-4 opacity-70" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/icons/paypal.png" alt="" className="h-4 w-4 opacity-70" />
                                <span>Powered by PayPal</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Email and Order confirmation */}
                    {/* <button
                        onClick={testHandleEmailClick}
                        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
                        disabled={loading}
                    >
                        Test Order Submit - New
                    </button> */}

                </CardContent>
            </Card>


        </div >
    );
}


export default function LandingForm() {
    return (
        <Suspense fallback={<div className="p-8 text-center">⏳ Loading...</div>}>
            <LandingForm1 />
        </Suspense>
    );
}
