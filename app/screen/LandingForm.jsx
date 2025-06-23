"use client";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { loadScript } from "@paypal/paypal-js";
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
};

export default function LandingForm() {
    const paypalRef = useRef(null);
    const [showPayPal, setShowPayPal] = useState(false);

    const [price, setPrice] = useState({ original: 0, discounted: 0 });
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [discountRate, setDiscountRate] = useState(20);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rawFootage: "",
        inspirationVideo: "",
        country: "US",
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
            return { original: 0, discounted: 0 };
        }

        const tierPriceMap = basePrices[videoType]?.[durationKey];
        if (!tierPriceMap) {
            console.warn("No price found for", videoType, durationKey);
            return { original: 0, discounted: 0 };
        }

        const unitPrice = parseFloat(tierPriceMap[editingTier]) || 0;
        const count = parseInt(videosCount, 10) || 0;

        const original = unitPrice * count;
        const discounted = isCouponApplied
            ? original * ((100 - discountRate) / 100)
            : original;

        return {
            original,    // number
            discounted,  // number
        };
    };

    // Update price whenever form data or coupon changes
    useEffect(() => {
        const calculated = calculatePrice();
        setPrice(calculated); // ✅ Set full object, not just number
    }, [
        formData.videoType,
        formData.videoDuration,
        formData.editingTier,
        formData.videosCount,
        isCouponApplied,
        discountRate,
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

            const { original, discounted } = calculatePrice();
            const finalPrice = parseFloat(discounted);

            if (!finalPrice || isNaN(finalPrice)) {
                alert("There was an issue calculating the price. Please check your selections.");
                return;
            }

            setShowPayPal(false);
            setPrice({ original, discounted }); // Store both for UI reference
            setTimeout(() => setShowPayPal(true), 50);

            console.log("Submitted Data:", formData);
            console.log("Original Price:", original);
            console.log("Discounted Price:", discounted);
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
                                        value: price.discounted.toFixed(2),
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
        return Number(amount).toFixed(2);
    };

    const formatPriceWithSmallDecimals = (amount) => {
        const [main, decimal] = Number(amount).toFixed(2).split(".");
        return (
            <span className="text-emerald-400 font-bold text-lg">
                ${main}
                <span className="text-sm font-bold align-top ml-0.5">.{decimal}</span>
            </span>
        );
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
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
        ? (getEffectiveThumbnailValue() * Number(formData.videosCount)).toFixed(2)
        : "0.00";



    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Card className="px-1 sm:px-2 py-4 shadow-xl w-full max-w-[640px]">
            <CardContent className="space-y-4 text-sm px-2 sm:px-2 md:px-5">

                <h2 className="text-xl font-bold text-[#001c64]">Submit Your Video for Editing</h2>

                <div className="flex flex-col md:flex-row gap-5">

                    {/* Left - 60% */}
                    <div className="w-full md:w-[60%]">
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm text-zinc-500 px-2 mx-2">
                                Edit this footage
                            </legend>

                            {/* <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input
                                        className="text-sm"
                                        type="url"
                                        value={formData.rawFootage}
                                        onChange={(e) => handleChange("rawFootage", e.target.value)}
                                        placeholder="Link to your raw footage (YouTube, Drive, Dropbox, etc.)"
                                    // title="Link to your raw footage (YouTube, Drive, Dropbox, etc.)"
                                    />
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="text-xs max-w-xs bg-[#001c64] text-[#fff] rounded px-3 py-2 shadow"
                                >
                                    Paste a link to your raw footage (Google Drive, Dropbox, YouTube, etc.)<br />
                                    We’ll download the file and use it to edit your video.
                                </TooltipContent>
                            </Tooltip> */}

                            <div className="flex items-center gap-2">
                                <Textarea
                                    className="text-sm flex-1 placeholder:text-xs placeholder:text-gray-400"
                                    rows={3}
                                    value={formData.rawFootage}
                                    onChange={(e) => handleChange("rawFootage", e.target.value)}
                                    placeholder="Paste the shared folder link (Google Drive, Dropbox, etc.) with all your footage"
                                />


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
                            <p className="text-xs text-gray-500 mt-0">
                                📂 Please upload all related video files into a single folder and paste the shared link here.
                                Make sure access is set to <em>Anyone with the link</em> and downloads are not restricted.
                            </p>
                            <div className="flex items-center gap-3 mb-2 mt-1">
                                <div className="flex-grow h-px bg-zinc-300" />
                                <span className="text-xs text-zinc-500 whitespace-nowrap">Your Requirements</span>
                                <div className="flex-grow h-px bg-zinc-300" />
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


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Language */}
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("language", val)} defaultValue="en">
                                        <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="hi">Hindi</SelectItem>
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
                                {/* Editing Tier - Full Width */}

                            </div>
                        </fieldset>

                    </div>

                    {/* Right - 40% */}
                    <div className="w-full md:w-[40%] flex flex-col space-y-3">
                        {/* Customer Details */}
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm text-zinc-500 px-2 mx-2">Customer Details</legend>

                            <Input
                                className="w-full text-sm"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Your Name"
                            />

                            <Input
                                className="w-full text-sm"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@example.com"
                            />

                            {/* Country */}
                            <div className="w-full">
                                <Select onValueChange={(val) => handleChange("country", val)} defaultValue="US">
                                    <SelectTrigger className="w-full text-sm">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="EU">Europe</SelectItem>
                                        <SelectItem value="AS">Asia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <Select onValueChange={(val) => handleChange("country", val)}>
                                <SelectTrigger className="w-full text-sm">
                                    <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="EU">Europe</SelectItem>
                                    <SelectItem value="AS">Asia</SelectItem>
                                </SelectContent>
                            </Select> */}
                        </fieldset>


                        {/* Editing & Delivery */}
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm text-zinc-500 px-2 mx-2">Editing Instructions</legend>

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
                        </fieldset>

                    </div>
                </div>

                {/* Price + Submit */}
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Left - 60% */}
                    <div className="w-full md:w-[60%]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-neutral-800">
                            <div className="text-xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-3">
                                <span className="text-sm font-medium text-zinc-400">Amount:</span>

                                {isCouponApplied ? (
                                    <>
                                        {/* USD Price with discount */}
                                        <div className="flex items-baseline gap-1">
                                            <span className="line-through text-zinc-400 text-base">
                                                ${formatPrice(price.original)}
                                            </span>
                                            <span className="text-emerald-500 text-lg font-semibold">
                                                {formatPriceWithSmallDecimals(price.discounted)}
                                            </span>
                                        </div>

                                        {/* INR Price with discount (unchanged) */}
                                        {/* <div className="flex items-baseline gap-1">
                                            <span className="line-through text-zinc-400 text-sm">
                                                {formatINR(price.original * 83)}
                                            </span>
                                            <span className="text-emerald-400 text-sm font-semibold">
                                                {formatINR(price.discounted * 83)}
                                            </span>
                                        </div> */}
                                    </>
                                ) : (
                                    <>
                                        {/* USD Price without discount */}
                                        <span className="text-emerald-500 text-lg font-semibold">
                                            {formatPriceWithSmallDecimals(price.original)}
                                        </span>

                                        {/* INR Price without discount (unchanged) */}
                                        {/* <span className="text-emerald-500 text-sm font-semibold">
                                            {formatINR(price.original * 83)}
                                        </span> */}
                                    </>
                                )}

                            </div>


                            <Button
                                onClick={handleSubmit}
                                className="cursor-pointer bg-[#003087] hover:bg-[#0874e4] text-white font-medium text-sm px-5 py-2.5 rounded-md w-full sm:w-auto transition-colors duration-200"
                            >
                                Continue
                            </Button>
                        </div>

                        {formData.videoType !== 'short' &&
                            formData.editingTier && thumbnailDescriptions[formData.editingTier] && (
                                <div className="mt-3 space-y-1">
                                    {/* Free Bonus Row */}
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


                        {/* ✅ Info line inside border */}
                        <div className="flex flex-col items-start gap-2 mt-2">
                            <span className="text-xs text-zinc-400">
                                All prices include platform fees and taxes.
                            </span>

                            <button
                                onClick={() => {
                                    if (!isCouponApplied) setIsCouponApplied(true);
                                }}
                                disabled={isCouponApplied}
                                aria-disabled={isCouponApplied}
                                aria-label={
                                    isCouponApplied
                                        ? `Coupon already applied: ${discountRate}% off`
                                        : `Apply ${discountRate}% coupon`
                                }
                                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200
      ${isCouponApplied
                                        ? "bg-zinc-600 text-white cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"}
    `}
                            >
                                {isCouponApplied ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2 text-white/70"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Coupon Applied ({discountRate}% OFF)
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 mr-2 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Apply {discountRate}% Off Coupon
                                    </>
                                )}
                            </button>
                        </div>


                        {/* Discount Messaging */}
                        {!isCouponApplied ? (
                            <p className="text-sm text-emerald-400 mt-2">
                                🎁 Special Offer: Get {discountRate}% OFF – Ending Soon!
                            </p>
                        ) : (
                            <p className="text-sm text-emerald-400 mt-2">
                                🎉 {discountRate}% discount applied! Enjoy your savings.
                            </p>
                        )}

                        {/* {isCouponApplied && (
                            <p className="text-sm text-emerald-400 mt-2">
                                🎉 {discountRate}% discount applied!
                            </p>
                        )} */}

                    </div>


                    {/* Right - Reserve 40% space, even if hidden */}
                    <div className="relative w-full sm:w-[40%] min-h-[56px]">
                        {/* ✅ Loading overlay */}
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

                        {/* ✅ PayPal buttons container */}
                        {showPayPal && <div ref={paypalRef} className="w-full" />}
                    </div>
                </div>



                {/* Trust Badges */}
                <div className="mt-5">
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

                {/* <button
                    onClick={testHandleEmailClick}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                >
                    Test Order Submit - New
                </button> */}

            </CardContent>
        </Card>


    );
}

