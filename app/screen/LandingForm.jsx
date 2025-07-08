"use client";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { loadScript } from "@paypal/paypal-js";
import { loadCashfreeSdk } from "@/lib/loadCashfreeSdk"; // correct path
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitOrderAndSendEmail } from "@/lib/submitOrderAndEmail";
import { submitOrder } from '@/lib/submitOrder'; // adjust path as needed
import OrderConfirmationModal from "@/components/OrderConfirmationModal"; // adjust path if needed
import { toast } from "sonner";
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
    india: {
        short: {
            "30 sec": { studio: 499, studioPro: 799, studioMax: 999 },
            "60 sec": { studio: 649, studioPro: 999, studioMax: 1299 },
            "90 sec": { studio: 849, studioPro: 1249, studioMax: 1599 },
        },
        long: {
            "5 min": { studio: 1699, studioPro: 2499, studioMax: 3199 },
            "10 min": { studio: 2499, studioPro: 3399, studioMax: 4699 },
            "20 min": { studio: 3799, studioPro: 4899, studioMax: 6299 },
        }
    }
};


export default function LandingForm() {
    const paypalRef = useRef(null);
    const [showPayPal, setShowPayPal] = useState(false);

    const [price, setPrice] = useState({ original: 0, discounted: 0, paying:0 });
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [discountRate, setDiscountRate] = useState(20);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customAmount, setCustomAmount] = useState("");

    const [paymentMode, setPaymentMode] = useState("full"); // 'full','half','after','custom'
    const [currency, setCurrency] = useState("₹");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rawFootage: "",
        inspirationVideo: "",
        country: "india",
        social: "youtube",
        videosCount: "1",
        videoType: "short", // "short" or "long"
        videoDuration: "1", // like "1", "2", "5"
        deliverySpeed: "standard",
        editingTier: "", // "studio", "studioPro", "studioMax"
        aspectRatio: "",
        language: "en",
        notes: "",
    });
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        if (key === "country") {
            setShowPayPal(false);
            setCurrency(value === "india" ? "₹" : value === "international" ? "$" : "");
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
            console.warn("Missing data in form:", formData);
            return { original: 0, discounted: 0, paying: 0 };
        }

        const tierPriceMap = basePrices[formData.country]?.[videoType]?.[durationKey];

        if (!tierPriceMap) {
            console.warn("No price found for", formData.country, videoType, durationKey);
            return { original: 0, discounted: 0, paying: 0 };
        }

        const unitPrice = parseFloat(tierPriceMap[editingTier]) || 0;
        const count = parseInt(videosCount, 10) || 0;

        const original = Math.round(unitPrice * count);

        const discounted = isCouponApplied
            ? Math.round(original * ((100 - discountRate) / 100))
            : original;

        let paying = 0;

        if (paymentMode === "full") {
            paying = discounted;
        } else if (paymentMode === "half") {
            paying = Math.round(discounted / 2);
        } else if (paymentMode === "after") {
            paying = 0;
        } else if (paymentMode === "custom") {
            paying = Math.round(customAmount);
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
        const calculated = calculatePrice();
        setPrice(calculated); // ✅ Set full object, not just number
    }, [
        formData.country,
        formData.videoType,
        formData.videoDuration,
        formData.editingTier,
        formData.videosCount,
        isCouponApplied,
        discountRate,
        paymentMode,
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

    // Submit handler
    const handleSubmit = () => {
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

            console.log("Submitted Data:", formData);
            console.log("Original Price:", original);
            console.log("Discounted Price:", discounted);
            console.log("Paying Price:", paying);
        } catch (e) {
            console.error("Error during submit:", e);
        }
    };

    //only for testing emails
    const testHandleEmailClick = async () => {
        setLoading(true);
        try {
            const result = await submitOrderAndSendEmail({
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
            console.error("Unexpected error:", err);
            alert("Something went wrong after payment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!showPayPal || !paypalRef.current) return;

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
                    console.error("PayPal SDK not loaded.");
                    return;
                }
                else {
                    console.log("PayPal SDK loaded successfully");
                }

                paypal.Buttons({
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: price.discounted.toFixed(0),
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        setLoading(true);
                        try {
                            await actions.order.capture();

                            const result = await submitOrderAndSendEmail({
                                formData: formDataRef.current, // ✅ Use latest form data here
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
                            console.error("Unexpected error:", err);
                            alert("Something went wrong after payment.");
                        } finally {
                            setLoading(false);
                        }
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err);
                    },
                }).render(paypalRef.current);
            })
            .catch((err) => {
                console.error("Failed to load PayPal SDK:", err);
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

        const baseValue = Number(desc.value.replace('$', ''));

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

    const handleCashfreePayment = async () => {

        alert("Payment Gateway not integrated.");
        return;

        const amount =
            paymentMode === "default"
                ? price.discounted
                : parseFloat(customAmount || "0");

        if (amount <= 0) {
            alert("Invalid amount.");
            return;
        }

        setLoading(true);

        const order_id = `order_${Date.now()}`;

        const res = await fetch("/api/createPaymentSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order_id,
                order_amount: price.discounted,
                customer_id: formData.email || "guest_user",
                customer_email: formData.email || "test@example.com",
                customer_phone: formData.phone || "9876543210",
            }),
        });

        const data = await res.json();
        setLoading(false);

        console.log("Cashfree session response:", data);

        if (!data.payment_session_id) {
            alert("Payment session creation failed.");
            return;
        }

        try {
            const Cashfree = await loadCashfreeSdk();
            console.log("Cashfree type:", typeof Cashfree);

            if (typeof Cashfree !== "function") {
                throw new Error("Cashfree SDK not available");
            }

            const cf = new Cashfree();
            cf.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_blank",
            });
            // Fallback if iframe didn't open
            setTimeout(() => {
                const iframeOpened = document.querySelector("iframe[src*='cashfree']");
                if (!iframeOpened && data?.payments?.url) {
                    console.warn("SDK modal did not open. Redirecting manually...");
                    window.open(data.payments.url, "_blank");
                }
            }, 3000);

        } catch (err) {
            console.error("Cashfree error:", err);
            alert("Cashfree payment failed. Opening direct payment link...");

            if (data?.payments?.url) {
                window.open(data.payments.url, "_blank");
            }
        }
    };


    return (
        <div className="">

            <Card className="px-1 sm:px-2 py-4 shadow-xl w-full ">
                <CardContent className="space-y-4 text-sm px-2 sm:px-2 md:px-5">


                    <div className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            {/* Left: Heading */}
                            <div>
                                <h2 className="text-xl font-bold text-[#001c64]">
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
                                            className="text-xs max-w-sm bg-[#001c64] text-white rounded px-3 py-2 shadow"
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
                                            value={formData.country}
                                            onValueChange={(val) => handleChange("country", val)}
                                        >
                                            <SelectTrigger className="w-full text-sm">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="india">India (INR)</SelectItem>
                                                <SelectItem value="international">Outside India (USD)</SelectItem>
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
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <Input
                                            className="w-full text-sm"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            placeholder="you@example.com"
                                        />

                                    </div>

                                    <div className="w-full">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Input
                                                    className="text-sm"
                                                    type="url"
                                                    value={formData.inspirationVideo}
                                                    onChange={(e) => handleChange("inspirationVideo", e.target.value)}
                                                    placeholder="Inspiration video link (YouTube/Instagram, Optional)"
                                                // title="Inspiration video link (YouTube/Instagram, Optional)"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="text-xs max-w-xs bg-[#001c64] text-[#fff] rounded px-3 py-2 shadow"
                                            >
                                                Paste a reference video link (YouTube or Instagram, optional)<br />
                                                This helps us understand the style or format you’re aiming for.
                                            </TooltipContent>
                                        </Tooltip>
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
                                            checked={paymentMode === "full"}
                                            onChange={() => setPaymentMode("full")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay Full Amount</div>
                                            <div className="text-xs text-gray-600">
                                                Fastest delivery. No delays, no worries.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Pay Half Now */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="half"
                                            checked={paymentMode === "half"}
                                            onChange={() => setPaymentMode("half")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay Half Now, Book Your Slot</div>
                                            <div className="text-xs text-gray-600">
                                                Secure your edit with just 50%.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Pay After Delivery */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="after"
                                            checked={paymentMode === "after"}
                                            onChange={() => setPaymentMode("after")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Pay After Delivery</div>
                                            <div className="text-xs text-gray-600">
                                                Get your video, pay only if you're happy.
                                            </div>
                                        </div>
                                    </label>

                                    {/* Custom Payment */}
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="custom"
                                            checked={paymentMode === "custom"}
                                            onChange={() => setPaymentMode("custom")}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-800">Custom Payment</div>
                                            <div className="text-xs text-gray-600">
                                                Only for balances, settlements, or custom pricing. Not for new orders.
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
                                                    {currency}{formatPrice(price.original)}
                                                </span>
                                                <span className="text-emerald-500 text-lg font-semibold">
                                                    {currency}{formatPriceWithSmallDecimals(price.discounted)}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* USD Price without discount */}
                                            <span className="text-emerald-500 text-lg font-semibold">
                                                {currency}{formatPriceWithSmallDecimals(price.original)}
                                            </span>
                                        </>
                                    )}

                                </div>
                                <div className="mb-2">
                                    {!isCouponApplied ? (
                                        <p
                                            onClick={() => setIsCouponApplied(true)}
                                            className="inline-block text-xs font-semibold text-emerald-700 bg-gray-100 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                                        >
                                            Apply Coupon ({discountRate}% OFF)
                                        </p>
                                    ) : (
                                        <p className="inline-block text-xs font-semibold text-green-800 bg-green-100 border border-green-300 px-2 py-1 rounded-md">
                                            ✅ Coupon Applied ({discountRate}% OFF)
                                        </p>
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
                                {paymentMode === "custom" && (
                                    <div className="mb-4">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Enter custom amount ({currency === "₹" ? "INR" : currency === "$" ? "USD" : "Amount"})
                                        </label>

                                        <input
                                            type="number"
                                            min={1}
                                            placeholder={currency ? `e.g. ${currency}100` : ""}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#003087] focus:border-[#003087] focus:outline-none"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    {formData.country ? (
                                        formData.country === "india" ? (
                                            // 💰 Cashfree for Indian customers
                                            <button
                                                onClick={handleCashfreePayment}
                                                disabled={loading}
                                                className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "cursor-pointer bg-[#003087] hover:bg-[#0874e4]"
                                                    }`}
                                            >
                                                {loading
                                                    ? "Processing..."
                                                    : `Pay ₹${price.paying}`}
                                            </button>
                                        ) : (
                                            // 💳 PayPal for international customers
                                            <Button
                                                onClick={handleSubmit}
                                                className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "cursor-pointer bg-[#003087] hover:bg-[#0874e4]"
                                                    }`}
                                            >
                                                Continue with PayPal
                                            </Button>
                                        )
                                    ) : null}
                                </div>
                                <span className="text-xs text-zinc-400">
                                    All prices include platform fees and taxes.
                                </span>
                            </div>

                            {formData.videoType !== 'short' &&
                                formData.editingTier && thumbnailDescriptions[formData.editingTier] && (
                                    <div className="mt-1 mb-5 space-y-1">

                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold ${thumbnailDescriptions[formData.editingTier].color}`}>
                                                🎁 +{formData.videosCount} Free ${getEffectiveThumbnailValue()} {thumbnailDescriptions[formData.editingTier].title}
                                            </span>
                                            <div
                                                className={`text-sm font-semibold ${thumbnailDescriptions[formData.editingTier].color}`}
                                            >
                                                (${totalThumbValue})
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
                        {showModal && <OrderConfirmationModal onClose={() => setShowModal(false)} />}

                    </div>





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
        </div>
    );
}

