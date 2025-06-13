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
        <Card className="p-6 shadow-xl w-full max-w-2xl">
            <CardContent className="space-y-4">
                <h2 className="text-2xl font-bold">Start Your Edit</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Edit3 */}
                    <fieldset className="flex flex-col gap-2 border border-neutral-800 rounded-xl p-6">
                        <legend className="text-md font-semibold px-2 text-neutral-300">Edit this footage</legend>

                        <div className="space-y-1">
                            <Input
                                type="url"
                                value={formData.rawFootage}
                                onChange={(e) => handleChange("rawFootage", e.target.value)}
                                placeholder="Raw Footage URL/Link*"
                            />
                        </div>


                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-1">
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
                            </div>
                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("language", val)}
                                    defaultValue="en">
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English&nbsp;&nbsp;</SelectItem>
                                        <SelectItem value="hi">Hindi&nbsp;&nbsp;&nbsp;&nbsp;</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Duration Category Dropdown */}
                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("videoType", val)} defaultValue="short">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="short">Shorts / Reels</SelectItem>
                                        <SelectItem value="long">Long Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Duration Dropdown */}
                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("videoDuration", val)} defaultValue="1">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Duration" />
                                    </SelectTrigger>
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
                        </div>



                        <div className="space-y-1 pt-6">
                            <Input
                                type="url"
                                value={formData.inspirationVideo}
                                onChange={(e) => handleChange("inspirationVideo", e.target.value)}
                                placeholder="Inspiration Video URL/Link"
                            />
                        </div>
                        {/* Notes Section */}
                        <div className="space-y-1">
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => {
                                    if (e.target.value.length <= 4000) {
                                        handleChange("notes", e.target.value);
                                    }
                                }}
                                placeholder="Creative Notes - Describe the vibe or direction you want"
                                rows={5} // Fixes the height to approximately 5 lines
                                maxLength={4000} // Prevents input beyond 500 characters
                                className="resize-none" // Optional: disables resizing
                            />
                            <div className="text-sm text-muted-foreground text-right">
                                {formData.notes.length}/4000
                            </div>
                        </div>


                    </fieldset>


                    {/* Left Column: Edit1 + Edit2 */}
                    <div className="flex flex-col space-y-4">
                        {/* Edit1 */}
                        <fieldset className="flex flex-col gap-2 border border-neutral-800 rounded-xl p-6">
                            <legend className="text-md font-semibold px-2 text-neutral-300">Customer Details</legend>

                            <div className="space-y-1">
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Your Name"
                                />
                            </div>

                            <div className="space-y-1">
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("country", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="EU">Europe</SelectItem>
                                        <SelectItem value="AS">Asia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </fieldset>

                        {/* Right Column: Edit2 */}
                        <fieldset className="flex flex-col gap-2 border border-neutral-800 rounded-xl p-6">
                            <legend className="text-md font-semibold px-2 text-neutral-300">Editing & Delivery</legend>

                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("editingTier", val)} defaultValue="standard">
                                    <SelectTrigger>
                                        <SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="studio">Studio</SelectItem>
                                        <SelectItem value="pro">Studio Pro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Select onValueChange={(val) => handleChange("deliverySpeed", val)} defaultValue="standard">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard (5 days delivery)</SelectItem>
                                        <SelectItem value="express">Express (2 days delivery)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </fieldset>

                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl  border-neutral-800">
                        {/* <div className="text-xl font-semibold text-muted-foreground">
                            Amount: ${price}
                        </div> */}
                        <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                            <span className="text-base font-medium text-zinc-400">Amount:</span>
                            <span className="text-emerald-500">${price}</span>
                            {/* <span className="text-cyan-400">${price}</span> */}
                        </div>

                        <Button className="w-full md:w-auto" onClick={handleSubmit}>
                            Continue
                        </Button>

                    </div>
                    {showPayPal && (
                        <div ref={paypalRef} className="mt-4 w-full" />
                    )}
                </div>
                {/* Add trust badges below */}
                <div className="mt-4">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600 bg-white px-4 py-3 border-t border-zinc-200">
                        <div className="flex items-center gap-1">
                            <img
                                src="/icons/credit-card.png"
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-4 sm:h-5 sm:w-5 opacity-70"
                            />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img
                                src="/icons/ssl.png"
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-4 sm:h-5 sm:w-5 opacity-70"
                            />
                            <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <img
                                src="/icons/paypal.png"
                                alt=""
                                aria-hidden="true"
                                className="h-4 w-4 sm:h-5 sm:w-5 opacity-70"
                            />
                            <span>Powered by PayPal</span>
                        </div>
                    </div>
                </div>



            </CardContent>

        </Card >
    );
}
