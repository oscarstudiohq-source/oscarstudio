import React from "react";
import { CheckCircle } from "lucide-react"; // Optional, replace or remove

const tiers = [
    {
        name: "studio",
        color: "text-blue-400",
        border: "border-zinc-700",
        suitableFor: "New YouTubers & beginner content creators",
        features: [
            "Basic editing (cut, trim, transitions)",
            "Royalty-free music",
            "Color correction",
            "Thumbnail Design (Basic)",
            "1 Revision",
            {
                title: "Delivery",
                subitems: ["Short – 2 days", "Long – 3 days"],
            },
        ],
    },
    {
        name: "studioPro",
        color: "text-yellow-500",
        border: "border-yellow-500",
        suitableFor: "Growing creators, vloggers, and professionals",
        features: [
            "All Studio features",
            "Motion graphics & animations",
            "Color grading",
            "Sound design",
            "Custom-Branded Thumbnail Design",
            "2 Revisions",
            {
                title: "Delivery",
                subitems: ["Short – 2 days", "Long – 3 days"],
            },
        ],
    },
    {
        name: "studioMax",
        color: "text-emerald-400",
        border: "border-emerald-400",
        suitableFor: "Brands, agencies, and enterprise creators",
        features: [
            "All Studio Pro features",
            "Custom motion graphics",
            "Advanced color grading",
            "Scripting & storyboarding",
            "Optimized Thumbnail Strategy",
            "Unlimited revisions",
            {
                title: "Delivery",
                subitems: ["Short – 2 days", "Long – 3 days"],
            },
        ],
    },
];

export const thumbnailDescriptions = {
    "studio": {
        title: "Basic Thumbnail",
        value: "$29",
        color:"text-blue-600",
        points: [
            "Clean and clear visuals that get the message across.",
            "Ideal for creators just starting out on YouTube.",
            "Simple layouts with no-frills—YouTube-ready.",
            "🧑‍💼 Inspired by channels like Thomas Frank & Graham Stephan.",
        ],
    },
    "studioPro": {
        title: "Custom-Branded Thumbnail",
        value: "$45",
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
        value: "$59",
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
        className={`rounded-xl p-6 bg-zinc-900 border ${tier.border} shadow-md hover:shadow-lg transition duration-300`}
    >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold ${tier.color}`}>{tier.name}</h3>
            {tier.name === "studioPro" && (
                <span className="inline-block bg-yellow-400 text-black text-xs md:text-sm font-semibold px-3 py-1 pb-1.5 rounded-full shadow-sm">
                    ⭐ Popular for YouTube
                </span>
            )}
        </div>

        {/* Suitable For */}
        {tier.suitableFor && (
            <p className="text-xs text-zinc-400 mb-4 italic">{tier.suitableFor}</p>
        )}

        {/* Feature List */}
        <ul className="space-y-2 text-sm text-zinc-300">
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
                        <ul className="pl-6 space-y-1 text-zinc-400 text-xs">
                            {feature.subitems.map((subitem, subIdx) => (
                                <li key={subIdx}>• {subitem}</li>
                            ))}
                        </ul>
                    </li>
                );
            })}
        </ul>

        {/* Thumbnail Description Block */}
        <div className="mt-6 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            
            <div className="mb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Special Offer
                </p>
                <p className="text-white text-base font-semibold">
                    <span className="text-emerald-400 font-bold">Plan includes a{" "} Free Thumbnail</span> worth{" "}
                    <span className="text-2xl font-extrabold text-white tracking-tight">
                        {thumbnailDescriptions[tier.name].value}
                    </span>
                </p>
            </div>


            <h4 className="text-sm font-semibold text-white mb-1">
                {thumbnailDescriptions[tier.name].title}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
                {thumbnailDescriptions[tier.name].points.map((point, index) => (
                    <li key={index}>{point}</li>
                ))}
            </ul>
        </div>
    </div>
);
  
const TierComparisonSection = () => {
    return (
        <section className="bg-gradient-to-r from-zinc-900 to-black text-white py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Compare Our Editing Tiers</h2>
                <p className="text-zinc-400 mt-2">Choose the plan that best fits your needs.</p>
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