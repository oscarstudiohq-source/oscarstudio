import React from "react";
import { CheckCircle } from "lucide-react";
import Heading from '../../components/Heading';

export default function HowItWorks() {
    const steps = [
        {
            title: "Step 1",
            heading: "Submit Details & Footage",
            description:
                "Fill out a short form with your name, email, editing instructions, and video links (Google Drive, Dropbox, or YouTube).",
            icon: "/icons/next.png",
        },
        {
            title: "Step 2",
            heading: "Choose a Package & Pay",
            description:
                "Pick the editing package that fits your needs — choose your editing tier and number of videos, whether it’s a single video or a monthly bundle, and place your order.",
            icon: "/icons/atm-card.png",
        },
        {
            title: "Step 3",
            heading: "Get Ready-to-Post Videos",
            description:
                "Receive professionally edited content, fully optimized for YouTube, Shorts, Reels, or TikTok — ready to upload.",
            icon: "/icons/deliver.svg",
        },
    ];
      

    return (
        <section className="bg-[#f3f3f6] text-gray-900 py-16 px-6">
            <div className="max-w-6xl mx-auto text-center mb-12">
                {/* <h2 className="text-3xl md:text-4xl font-bold text-[#001c64]">
                   How It Works
                </h2> */}
                <Heading className="text-[#001c64]">
                    How It Works
                </Heading>
                <p className="text-black mt-2">3-Step Process to Get Your Videos Edited & Ready to Post</p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="relative text-center p-6 bg-white rounded-2xl"
                    >
                        {index === 2 ? (
                            <div className="flex justify-center items-center space-x-[-10px] mb-4">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 z-30">
                                    <img src="/icons/youtube.png" alt="YouTube" className="w-10 h-10" />
                                </div>
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 z-20">
                                    <img src="/icons/instagram.png" alt="Instagram" className="w-10 h-10" />
                                </div>
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 z-10">
                                    <img src="/icons/tik-tok.png" alt="TikTok" className="w-10 h-10" />
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 relative">
                                <img src={step.icon} alt={step.heading} className="w-8 h-8" />
                            </div>
                        )}

                        <p className="text-sm uppercase text-gray-500 tracking-wide mb-1">
                            {step.title}
                        </p>
                        <h3 className="text-lg font-semibold mb-2 mt-4">{step.heading}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    
    );

}
