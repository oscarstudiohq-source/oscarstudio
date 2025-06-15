"use client";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip";


const basePrices = {
    short: {
        "30s": { standard: 17.99, studio: 24.99, pro: 29.99 },
        "1min": { standard: 24.99, studio: 34.99, pro: 44.99 },
        "1-3min": { standard: 34.99, studio: 49.99, pro: 64.99 },
        "3-5min": { standard: 44.99, studio: 59.99, pro: 79 },
        "5-10min": { standard: 64.99, studio: 89.99, pro: 119 },
        "10-15min": { standard: 84.99, studio: 114.99, pro: 149 },
        "15-30min": { standard: 109, studio: 149, pro: 195 },
    },
    long: {
        "30s": { standard: 19.99, studio: 27.99, pro: 34.99 },
        "1min": { standard: 27.99, studio: 37.99, pro: 49.99 },
        "1-3min": { standard: 37.99, studio: 54.99, pro: 74.99 },
        "3-5min": { standard: 49.99, studio: 69.99, pro: 94.99 },
        "5-10min": { standard: 74.99, studio: 99.99, pro: 134.99 },
        "10-15min": { standard: 94.99, studio: 129.99, pro: 174.99 },
        "15-30min": { standard: 124.99, studio: 169.99, pro: 219 },
    }
};

export default function LandingForm() {
    const paypalRef = useRef(null);
    const [price, setPrice] = useState(0);
    const [showPayPal, setShowPayPal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rawFootage: "",
        inspirationVideo: "",
        country: "",
        videosCount: "1",
        videoType: "short", // "short" or "long"
        videoDuration: "1", // like "1", "2", "5"
        deliverySpeed: "standard",
        editingTier: "", // "standard", "studio", "pro"
        aspectRatio: "",
        language: "",
        notes: "",
    });



    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };



    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.rawFootage) {
            alert("Please fill all required fields.");
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        try {
            const totalPrice = calculatePrice();

            if (!totalPrice || isNaN(totalPrice)) {
                alert("There was an issue calculating the price. Please check your selections.");
                return;
            }

            setShowPayPal(false); // Reset first
            setPrice(totalPrice);
            setTimeout(() => setShowPayPal(true), 50); // Slight delay ensures re-render

            console.log("Submitted Data:", formData);
            console.log("Total Price:", totalPrice);
        } catch (e) {
            console.log(e);
        }
    };


    const calculatePrice = () => {
        setShowPayPal(false);

        const { videoType, videoDuration, editingTier, videosCount } = formData;

        const durationKeyMap = {
            "1": "30s",
            "2": "1min",
            "3": "1-3min",
            "5": "3-5min",
            "10": "5-10min",
            "15": "10-15min",
            "30": "15-30min",
        };

        const durationKey = durationKeyMap[videoDuration];

        if (!videoType || !durationKey || !editingTier) {
            console.warn("Missing data in form:", formData);
            return 0;
        }

        const tierPriceMap = basePrices[videoType]?.[durationKey];

        if (!tierPriceMap) {
            console.warn("No price found for", videoType, durationKey);
            return 0;
        }

        const unitPrice = parseFloat(tierPriceMap[editingTier]) || 0;
        const count = parseInt(videosCount, 10) || 0;

        const total = unitPrice * count;

        console.log(`unitPrice: ${unitPrice}, count: ${count}, total: ${total}`);
        return total;
    };


    useEffect(() => {
        setPrice(calculatePrice());
    }, [
        formData.videoType,
        formData.videoDuration,
        formData.editingTier,
        formData.videosCount,
    ]);



    useEffect(() => {
        if (!showPayPal || !paypalRef.current || !window.paypal) return;

        // Clear old buttons if any (important when price changes)
        paypalRef.current.innerHTML = "";

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: price.toFixed(2), // always format to 2 decimal places
                            },
                        },
                    ],
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    alert(`Payment completed by ${details.payer.name.given_name}`);
                });
            },
            onError: (err) => {
                console.error("PayPal Error:", err);
            },
        }).render(paypalRef.current);
    }, [showPayPal, price]); // <-- include showPayPal here


    return (
        <Card className="px-1 sm:px-2 py-4 shadow-xl w-full max-w-[640px]">
            <CardContent className="space-y-4 text-sm px-2 sm:px-2 md:px-5">
      
                <h2 className="text-xl font-bold">Submit Your Video for Editing</h2>

                <div className="flex flex-col md:flex-row gap-5">

                    {/* Left - 60% */}
                    <div className="w-full md:w-[60%]">
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm text-zinc-500 px-2 mx-2">
                                Edit this footage
                            </legend>

                            <Tooltip>
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
                                <TooltipContent side="top" className="text-xs max-w-xs">
                                    Paste a link to your raw footage (Google Drive, Dropbox, YouTube, etc.)<br />
                                    We’ll download the file and use it to edit your video.
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-grow h-px bg-zinc-300" />
                                <span className="text-xs text-zinc-500 whitespace-nowrap">Your Requirements</span>
                                <div className="flex-grow h-px bg-zinc-300" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("social", val)} defaultValue="yt">
                                        <SelectTrigger className="w-full text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yt">YouTube</SelectItem>
                                            <SelectItem value="tt">TikTok</SelectItem>
                                            <SelectItem value="ig">Instagram</SelectItem>
                                            <SelectItem value="ot">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("videoType", val)} defaultValue="short">
                                        <SelectTrigger className="text-sm w-full"><SelectValue placeholder="Select Format" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short">Shorts / Reels</SelectItem>
                                            <SelectItem value="long">Long Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("videosCount", val)} defaultValue="1">
                                        <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 video</SelectItem>
                                            <SelectItem value="2">2 videos</SelectItem>
                                            <SelectItem value="3">3 videos</SelectItem>
                                            <SelectItem value="4">4 videos</SelectItem>
                                            <SelectItem value="5">5 videos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="text-neutral-400 cursor-help">🛈</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" align="center">
                                                <p>Choose how many videos you'd like us to edit in this order.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider> */}
                                </div>
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("videoDuration", val)} defaultValue="1">
                                        <SelectTrigger className="text-sm w-full"><SelectValue placeholder="Select Duration" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">30 sec</SelectItem>
                                            <SelectItem value="2">1 min</SelectItem>
                                            <SelectItem value="3">1–3 min</SelectItem>
                                            <SelectItem value="5">3–5 min</SelectItem>
                                            <SelectItem value="10">5–10 min</SelectItem>
                                            <SelectItem value="15">10–15 min</SelectItem>
                                            <SelectItem value="30">15–30 min</SelectItem>
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
                                
                                {/* Editing Tier - Full Width */}
                                <div className="w-full  ">
                                    <Select onValueChange={(val) => handleChange("editingTier", val)} defaultValue="">
                                        <SelectTrigger className="w-full text-sm">
                                            <SelectValue placeholder="Select Editing Tier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard</SelectItem>
                                            <SelectItem value="studio">Studio</SelectItem>
                                            <SelectItem value="pro">Studio Pro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Delivery Speed - Full Width */}
                                <div className="w-full">
                                    <Select onValueChange={(val) => handleChange("deliverySpeed", val)} defaultValue="standard">
                                        <SelectTrigger className="w-full text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard (5 days)</SelectItem>
                                            <SelectItem value="express">Express (2 days)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>


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
                                    <TooltipContent side="top" className="text-xs max-w-xs">
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
                            <div className="text-xl font-bold text-white flex items-baseline gap-1">
                                <span className="text-sm font-medium text-zinc-400">Amount:</span>
                                <span className="text-emerald-500">${price}</span>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                className="bg-[#003087] hover:bg-[#0874e4] text-white font-medium text-sm px-5 py-2.5 rounded-md w-full sm:w-auto transition-colors duration-200"
                            >
                                Continue
                            </Button>

                        </div>
                    </div>

                    {/* Right - Reserve 40% space, even if hidden */}
                    <div className="w-full sm:w-[40%] min-h-[56px]">
                        {showPayPal && (
                            <div ref={paypalRef} className="w-full" />
                        )}
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
            </CardContent>
        </Card>


    );
}
