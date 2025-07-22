import React from "react";
import Heading from '../../components/Heading';

const categories = [
    {
        title: "Roast & Reaction",
        description: "Entertaining commentary, roast clips, and reactions.",
        image: "/images/thumbnail/roast.jpg",
    },
    {
        title: "Challenge / Viral",
        description: "Social experiments, MrBeast-style challenges, and viral stunts.",
        image: "/images/thumbnail/challenge.jpg",
    },
    {
        title: "Comedy Skits / Vines",
        description: "Funny, relatable skits and short-form scripted content.",
        image: "/images/thumbnail/skits.jpg",
    },
    {
        title: "Memes & Viral Edits",
        description: "Trending memes, audio sync reels, and short viral edits.",
        image: "/images/thumbnail/memes.jpg",
    },
    {
        title: "Tech & Gadgets",
        description: "Unboxings, gadget reviews, and snappy tech reels.",
        image: "/images/thumbnail/tech.jpg",
    },
    {
        title: "Beauty & Makeup",
        description: "Makeup tutorials, glow-up edits, skincare videos.",
        image: "/images/thumbnail/beauty.jpg",
    },
    {
        title: "Gaming",
        description: "Montages, commentary, game highlights, and shorts.",
        image: "/images/thumbnail/gaming.jpg",
    },
    {
        title: "Podcast",
        description: "Clipped interviews, talking head edits, and full-episode cuts.",
        image: "/images/thumbnail/podcast.jpg",
    },
    {
        title: "Facts & Knowledge",
        description: "Text overlays, voiceovers, and infotainment-style reels.",
        image: "/images/thumbnail/facts.jpg",
    },
    {
        title: "Fitness",
        description: "Workout edits, transformations, and gym content.",
        image: "/images/thumbnail/fitness.jpg",
    },
    {
        title: "Motivational",
        description: "Voiceover-based hustle reels and inspirational edits.",
        image: "/images/thumbnail/motivation.jpg",
    },
    {
        title: "Music",
        description: "Music promos, concert cuts, and artist reels.",
        image: "/images/thumbnail/music.jpg",
    },
    {
        title: "Travel & Vlogs",
        description: "Cinematic travel videos, lifestyle vlogs, and montages.",
        image: "/images/thumbnail/travel.jpg",
    },
    {
        title: "Cooking",
        description: "Food prep, recipe reels, and fast-paced kitchen edits.",
        image: "/images/thumbnail/cooking.jpg",
    },
    {
        title: "Other Categories",
        description: "Podcasts, testimonials, screen recordings, case studies & more.",
        image: null, // No image or use a placeholder
        isOther: true,
    },
];

const VideoCategoryGridSection = () => {
    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-8 md:px-20 rounded-2xl">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <Heading className="text-[#001c64]">One Process. Every Video Type.</Heading>
                <p className="text-black mt-2">
                    Reels, YouTube, Podcasts, Business Promos — we edit everything.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">

                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out"
                    >
                        {category.isOther ? (
                            <div className="w-32 h-20 flex items-center justify-center rounded-md bg-gray-100 border text-sm text-gray-500 font-medium">
                                + More
                            </div>
                        ) : (
                            <img
                                src={category.image}
                                alt={category.title}
                                className="w-32 h-20 rounded-md object-cover border"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900">{category.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoCategoryGridSection;
