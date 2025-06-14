"use client";
import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



const basePrices = {
    short: {
        "30s": { standard: 10, studio: 15, pro: 20 },
        "60s": { standard: 15, studio: 20, pro: 25 },
        "3-5min": { standard: 30, studio: 40, pro: 50 },
        "5-10min": { standard: 50, studio: 65, pro: 80 },
        "10-15min": { standard: 70, studio: 90, pro: 110 },
        "15-30min": { standard: 90, studio: 120, pro: 150 }, // new
    },
    long: {
        "30s": { standard: 10, studio: 15, pro: 20 },
        "60s": { standard: 15, studio: 20, pro: 25 },
        "3-5min": { standard: 30, studio: 40, pro: 50 },
        "5-10min": { standard: 50, studio: 65, pro: 80 },
        "10-15min": { standard: 70, studio: 90, pro: 110 },
        "15-30min": { standard: 90, studio: 120, pro: 150 }, // new
    }
};

export default function LandingForm() {
    const paypalRef = useRef(null);
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
        editingTier: "standard", // "standard", "studio", "pro"
        aspectRatio: "",
        language: "",
        notes: "",
    });

    const [price, setPrice] = useState(0);

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
        // if (!validateForm()) return;

        const totalPrice = calculatePrice();

        setPrice(totalPrice);
        setShowPayPal(true); // Now show PayPal button

        console.log("Submitted Data:", formData);
        console.log("Total Price:", totalPrice);

        // Proceed to payment or next step
    };

    const calculatePrice = () => {
        setShowPayPal(false);
        const { videoType, videoDuration, editingTier, videosCount } = formData;

        const durationKeyMap = {
            "1": "30s",
            "2": "60s",
            "5": "3-5min",
            "10": "5-10min",
            "15": "10-15min",
            "30": "15-30min", // match new base price key
        };

        const durationKey = durationKeyMap[videoDuration];

        if (!videoType || !durationKey) return 0;

        const tierPriceMap = basePrices[videoType]?.[durationKey];
        if (!tierPriceMap) return 0;

        const unitPrice = tierPriceMap[editingTier] || 0;

        return unitPrice * parseInt(videosCount, 10);
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

        // Prevent double render
        paypalRef.current.innerHTML = "";

        window.paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{ amount: { value: price.toString() } }],
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
    }, [showPayPal]);

    return (
        <Card className="px-2 sm:px-4 py-4 md:p-5 shadow-xl w-full max-w-[640px]">
            <CardContent className="space-y-4 text-sm px-0 mx-1 sm:px-4 sm:mx-4">


                <h2 className="text-xl font-bold">Submit Your Video for Editing</h2>

                <div className="flex flex-col md:flex-row gap-5">

                    {/* Left - 60% */}
                    <div className="w-full md:w-[60%]">
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm font-semibold px-2 text-neutral-300">
                                Edit this footage
                            </legend>

                            <Input
                                className="text-sm"
                                type="url"
                                value={formData.rawFootage}
                                onChange={(e) => handleChange("rawFootage", e.target.value)}
                                placeholder="Raw Footage URL/Link*"
                            />

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Select onValueChange={(val) => handleChange("videosCount", val)} defaultValue="1">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 video</SelectItem>
                                        <SelectItem value="2">2 videos</SelectItem>
                                        <SelectItem value="3">3 videos</SelectItem>
                                        <SelectItem value="4">4 videos</SelectItem>
                                        <SelectItem value="5">5 videos</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(val) => handleChange("language", val)} defaultValue="en">
                                    <SelectTrigger className="text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Select onValueChange={(val) => handleChange("videoType", val)} defaultValue="short">
                                    <SelectTrigger className="text-sm"><SelectValue placeholder="Select Format" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="short">Shorts / Reels</SelectItem>
                                        <SelectItem value="long">Long Video</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={(val) => handleChange("videoDuration", val)} defaultValue="1">
                                    <SelectTrigger className="text-sm"><SelectValue placeholder="Select Duration" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">30 sec</SelectItem>
                                        <SelectItem value="2">60 sec</SelectItem>
                                        <SelectItem value="5">3–5 min</SelectItem>
                                        <SelectItem value="10">5–10 min</SelectItem>
                                        <SelectItem value="15">10–15 min</SelectItem>
                                        <SelectItem value="30">15–30 min</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Input
                                className="text-sm"
                                type="url"
                                value={formData.inspirationVideo}
                                onChange={(e) => handleChange("inspirationVideo", e.target.value)}
                                placeholder="Inspiration Video URL/Link"
                            />

                            <Textarea
                                className="resize-none text-sm"
                                value={formData.notes}
                                onChange={(e) => {
                                    if (e.target.value.length <= 4000) {
                                        handleChange("notes", e.target.value);
                                    }
                                }}
                                placeholder="Creative Notes - Describe the vibe or direction you want"
                                rows={4}
                                maxLength={4000}
                            />
                            <div className="text-xs text-muted-foreground text-right">
                                {formData.notes.length}/4000
                            </div>
                        </fieldset>
                    </div>

                    {/* Right - 40% */}
                    <div className="w-full md:w-[40%] flex flex-col space-y-3">
                        {/* Customer Details */}
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm font-semibold px-2 text-neutral-300">Customer Details</legend>

                            <Input
                                className="text-sm"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Your Name"
                            />
                            <Input
                                className="text-sm"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="you@example.com"
                            />
                            <Select onValueChange={(val) => handleChange("country", val)}>
                                <SelectTrigger className="text-sm"><SelectValue placeholder="Select your country" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="EU">Europe</SelectItem>
                                    <SelectItem value="AS">Asia</SelectItem>
                                </SelectContent>
                            </Select>
                        </fieldset>

                        {/* Editing & Delivery */}
                        <fieldset className="flex flex-col gap-3 border border-neutral-800 rounded-lg px-3 py-4 sm:p-5">
                            <legend className="text-sm font-semibold px-2 text-neutral-300">Editing & Delivery</legend>

                            <Select onValueChange={(val) => handleChange("editingTier", val)} defaultValue="standard">
                                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="pro">Studio Pro</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select onValueChange={(val) => handleChange("deliverySpeed", val)} defaultValue="standard">
                                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard (5 days)</SelectItem>
                                    <SelectItem value="express">Express (2 days)</SelectItem>
                                </SelectContent>
                            </Select>
                        </fieldset>
                    </div>
                </div>

                {/* Price + Submit */}
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Left - 60% */}
                    <div className="w-full sm:w-[60%]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-neutral-800">
                            <div className="text-xl font-bold text-white flex items-baseline gap-1">
                                <span className="text-sm font-medium text-zinc-400">Amount:</span>
                                <span className="text-emerald-500">${price}</span>
                            </div>

                            <Button className="w-full sm:w-auto text-sm px-4 py-2" onClick={handleSubmit}>
                                Continue
                            </Button>
                        </div>
                    </div>

                    {/* Right - 40% */}
                    {showPayPal && (
                        <div ref={paypalRef} className="w-full sm:w-[40%]" />
                    )}
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
