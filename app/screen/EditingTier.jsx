import React from "react";
import { CheckCircle } from "lucide-react"; // Optional, replace or remove
import Heading from '../../components/Heading';

const tiers = [
    {
        name: "studio",
        color: "text-blue-400",
        border: "border-zinc-700",
        suitableFor: (
            <>
                Ideal for creators <strong>who upload frequently</strong> on YouTube, Shorts, TikTok, or Reels <strong>and require clean basic editing</strong>. Get clean editing at a budget-friendly rate — perfect for staying consistent and keeping up with your content calendar without sacrificing quality.
            </>
        ),
        features: [
            "Basic editing (cut, trim, transitions)",
            "Royalty-free music",
            "Color correction",
            "Free Thumbnail Design (Standard)",
            "3 Revision",
            {
                title: "Delivery",
                subitems: ["Short: Typically 1–2 days", "Long: Typically 2–3 days"],
            },
        ],
    },
    {
        name: "studioPro",
        color: "text-yellow-500",
        border: "border-yellow-500",
        suitableFor: (
            <>
                Perfect for experienced or professional creators <strong>who upload multiple times a week</strong> on YouTube, Shorts, TikTok, Reels, or Podcasts <strong>and require polished, professional editing</strong>. Studio Pro offers polished, professional editing with added creative depth — ideal for storytelling, audience engagement, and growing a loyal following.
            </>
        ),
        features: [
            "All Studio features",
            "Motion graphics & animations",
            "Color grading",
            "Sound design",
            "Free Custom-Branded Thumbnail Design",
            "3 Revisions",
            {
                title: "Delivery",
                subitems: ["Short: Typically 1–2 days", "Long: Typically 2–3 days"],
            },
        ],
    },
    {
        name: "studioMax",
        color: "text-emerald-400",
        border: "border-emerald-400",
        suitableFor: (
            <>
                <strong>For Top Creators who require premium editing</strong>
            </>
        ),
        features: [
            "All Studio Pro features",
            "Custom motion graphics",
            "Advanced color grading",
            "Scripting & storyboarding",
            "Free Optimized Thumbnail Strategy",
            "Unlimited revisions",
            {
                title: "Delivery",
                subitems: ["Short: Typically 1–2 days", "Long: Typically 2–3 days"],
            },
        ],
    },
];

export const thumbnailDescriptions = {
    "studio": {
        title: "Standard Thumbnail",
        value: "₹499",
        valueShort: "₹499",
        color: "text-blue-600",
        points: [
            "Clean and clear visuals that get the message across.",
            "Ideal for creators just starting out on YouTube.",
            "Simple layouts with no-frills—YouTube-ready.",
            "🧑‍💼 Inspired by channels like Thomas Frank & Graham Stephan.",
        ],
    },
    "studioPro": {
        title: "Custom-Branded Thumbnail",
        value: "₹799",
        valueShort: "₹799",
        color: "text-yellow-500",
        points: [
            "Visually engaging thumbnails tailored to your brand tone.",
            "Color schemes and fonts aligned with your channel identity.",
            "Great for creators building a recognizable visual style.",
            "🎨 Similar in approach to creators like Dude Perfect and Ali Abdaal.",
        ],
    },
    "studioMax": {
        title: "Optimized Thumbnail",
        value: "₹999",
        valueShort: "₹999",
        color: "text-emerald-500",
        points: [
            "High-converting visuals using proven psychology and layout principles.",
            "Custom compositions designed to boost click-through rates.",
            "Built to compete with the best-performing channels in your niche.",
            "🚀 Inspired by results-driven creators like MrBeast, KSI, and Mark Rober.",
        ],
    },
};


const TierCard = ({ tier }) => (
    <div
        className="rounded-xl p-6 bg-white transition duration-300"
    >

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold ${tier.color}`}>{tier.name}</h3>
            {tier.name === "studioPro" && (
                <span className="inline-block bg-yellow-400 text-black text-xs md:text-sm font-semibold px-3 py-1 pb-1.5 rounded-full shadow-sm">
                    ⭐ Popular for YouTube
                </span>
            )}
            {tier.name === "studioMax" && (
                <span className="inline-block bg-black text-white text-xs md:text-sm font-semibold px-3 py-1 pb-1.5 rounded-full shadow-sm">
                    ⭐⭐ Top Creators
                </span>
            )}
        </div>

        {/* Suitable For */}
        {tier.suitableFor && (
            <p className="text-xs text-gray-500 mb-4 mt-2 italic">{tier.suitableFor}</p>
        )}

        {/* Feature List */}
        <ul className="space-y-2 text-sm text-gray-700">
            {tier.features.map((feature, idx) => {
                if (typeof feature === "string") {
                    return (
                        <li key={idx} className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    );
                }

                // Nested features like Delivery
                return (
                    <li key={idx}>
                        <div className="flex items-start gap-2 mb-1">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                            <span className="font-medium">{feature.title}:</span>
                        </div>
                        <ul className="pl-6 space-y-1 text-gray-500 text-xs">
                            {feature.subitems.map((subitem, subIdx) => (
                                <li key={subIdx}>• {subitem}</li>
                            ))}
                        </ul>
                    </li>
                );
            })}
        </ul>

        {/* Thumbnail Description Block */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="mb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Special Offer
                </p>
                <p className="text-gray-800 text-base font-semibold">
                    <span className="text-emerald-500 font-bold">Plan includes a Free Thumbnail</span> worth{" "}
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {thumbnailDescriptions[tier.name].value}
                    </span>
                    <br />
                    <span className="text-xs text-gray-600">
                        (For Long videos only)
                        {/* <strong>Short Videos</strong>: {thumbnailDescriptions[tier.name].valueShort} */}
                    </span>
                </p>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {thumbnailDescriptions[tier.name].title}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs">
                {thumbnailDescriptions[tier.name].points.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
    </div>
);

const TierComparisonSection = () => {
    return (
        <section
            className="text-gray-900 py-16 px-4 sm:px-10 md:px-20"
            style={{ backgroundColor: "#f3f3f6" }}
        >
            <div className="max-w-6xl mx-auto text-center mb-12">
                {/* <h2 className="text-3xl md:text-4xl font-bold text-[#001c64]">Compare Our Editing Tiers</h2> */}
                <Heading className="text-[#001c64]">
                    Compare Our Editing Tiers
                </Heading>
                
                <p className="text-black mt-2">Choose the plan that best fits your needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {tiers.map((tier, index) => (
                    <TierCard key={index} tier={tier} />
                ))}
            </div>
        </section>
    );
};



export default TierComparisonSection;