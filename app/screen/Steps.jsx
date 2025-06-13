import React from "react";
import { CheckCircle } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            title: "Step 1",
            heading: "Submit Details & Footage",
            description:
                "Fill out the form with your video links from Google Drive, YouTube, or Dropbox — we’ll handle the rest.",
            icon: "/icons/next.png",
        },
        {
            title: "Step 2",
            heading: "Choose a Package & Pay",
            description:
                "Pick the editing package that fits your needs — whether it's a single video or a monthly bundle.",
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
        <section className="bg-zinc-900 bg-black-900 py-16 px-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
                How It Works
            </h2>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="relative text-center p-6 bg-zinc-800 rounded-2xl border border-zinc-700 shadow-md"
                    >
                        {/* Step Number */}
                        {/* <div className="absolute -top-5 left-5 text-zinc-500 text-sm font-semibold">
                            STEP {index + 1}
                        </div> */}

                        {/* Icon */}

                        {index === 2 ? (
                            <div className="flex justify-center items-center space-x-[-10px] mb-4">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-700 border border-zinc-600 z-30">
                                    <img
                                        src="/icons/youtube.png"
                                        alt="YouTube"
                                        className="w-10 h-10"
                                    />
                                </div>
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-700 border border-zinc-600 z-20">
                                    <img
                                        src="/icons/instagram.png"
                                        alt="Instagram"
                                        className="w-10 h-10"
                                    />
                                </div>
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-700 border border-zinc-600 z-10">
                                    <img
                                        src="/icons/tik-tok.png"
                                        alt="TikTok"
                                        className="w-10 h-10"
                                    />
                                </div>
                            </div>

                        ) : (
                            <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-zinc-700 relative">
                                <img
                                    src={step.icon}
                                    alt={step.heading}
                                        className="w-8 h-8"
                                />
                            </div>
                        )}


                        {/* Step Content */}
                        <p className="text-sm uppercase text-zinc-400 tracking-wide mb-1">
                            {step.title}
                        </p>
                        <h3 className="text-lg font-semibold mb-2 mt-4">{step.heading}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );

}
