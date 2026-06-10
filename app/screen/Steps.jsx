import React from "react";
import { CheckCircle } from "lucide-react";
import Heading from '../../components/Heading';

export default function HowItWorks() {
    const steps = [
        {
            title: "Step 1",
            heading: "Submit Video Details & Select Package",
            description:
                "Fill out a brief form with your name, email, video count, editing tier, and video links (Google Drive, Dropbox, or YouTube).",
            icon: "/images/details.png",
        },
        {
            title: "Step 2",
            heading: "Make Payment",
            description:
                "Review your selected package and securely complete the payment to confirm your order and start the editing process.",
            icon: "/images/payment.png",
        },
        {
            title: "Step 3",
            heading: "Get Order Confirmation on Email",
            description:
                "You'll receive a confirmation email with your order summary and timeline. Sit back while our editors get to work.",
            icon: "/images/order.png",
        },
        {
            title: "Step 4",
            heading: "Get Ready-to-Post Videos",
            description:
                "Receive high-quality, professionally edited videos — formatted and optimized for YouTube, Shorts, Reels, and TikTok. Just upload and go!",
            icon: "/images/edited.png",
        },
    ];



    return (
        <section className="bg-[#ffffff] text-gray-900 py-16 px-6 rounded-2xl  border-t-2 border-[#f2efeb]">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <Heading className="text-[#7D5B39]">How to Order</Heading>
                <p className="text-black mt-2">4-Step Process to Get Your Videos Edited & Ready to Post</p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-md h-full"
                    >
                        {/* Image container with separator */}
                        <div className="w-full max-w-[220px] min-h-[120px] mx-auto pb-6">
                            <img
                                src={step.icon}
                                alt={step.heading}
                                className="w-full h-auto object-contain rounded-md"
                            />
                            {/* Separator line with some margin */}
                            <hr className="border-gray-400 mt-8" />
                        </div>

                        {/* Text container with spacing from separator */}
                        <div className="flex flex-col items-center mt-0">
                            <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">{step.title}</p>
                            <h3 className="text-base font-semibold mb-2">{step.heading}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-[280px]">{step.description}</p>
                        </div>
                    </div>

                ))}
            </div>
        </section>


    );

}
