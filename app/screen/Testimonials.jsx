"use client"; // 👈 Must be the first line
import React from "react"; // ← Add this at the top if your setup requires it
import { useEffect, useRef } from "react";

const testimonials = [
    {
        name: "Chris P.",
        text: "I send raw GoPro footage from my travels, and every time they make magic. Big fan.",
        rating: 5,
        image: "/clients/chris.png"
    },
    {
        name: "Emily R.",
        text: "I sent in some shaky clips from my iPhone and got back a super polished promo reel. Already recommended to my startup friends!",
        rating: 5,
        image: "/clients/emily.png"
    },
    {
        name: "James B.",
        text: "English wasn’t fluent, but they understood exactly what I needed for my YouTube video. The cuts, pacing, and polish were spot on. Definitely working with them again.",
        rating: 4.5,
        image: "/clients/james.png"
    },
    {
        name: "Jack M.",
        text: "Honestly? Didn’t expect my vlog to look *this* good. These guys seriously know YouTube — smooth edits, great music timing. Loved it.",
        rating: 5,
        image: "/clients/jack.png"
    },
    {
        name: "Ibrahim Z.",
        text: "I literally gasped when I saw the final edit. Perfect for my YouTube Shorts — crisp, clean, and totally on-brand. Sending more soon!",
        rating: 5,
        image: "/clients/ibrahim.png"
    },
    {
        name: "Laura B.",
        text: "They totally nailed the aesthetic for my beauty channel. Smooth transitions, subtle effects — the reel looks so YouTube-ready now!",
        rating: 5,
        image: "/clients/laura.png"
    },
    {
        name: "Jason B.",
        text: "The editors are based in India and while their English isn’t perfect, they totally nailed the video. Super hardworking team, very responsive, and great value for money.",
        rating: 5,
        image: "/clients/jason.png"
    },
    {
        name: "Sophie M.",
        text: "Not native English speakers, but super kind, patient, and fast. The video editing was on point — clean cuts, nice transitions, and exactly what I wanted. Impressed!",
        rating: 4.5,
        image: "/clients/sophie.png"
    },
    {
        name: "Daniel T.",
        text: "Used them for my channel’s main video — edits were sharp, pacing was tight, and I didn’t even need revisions. Perfect for YouTube uploads.",
        rating: 4.5,
        image: "/clients/daniel.png"
    },
    {
        name: "Luca F.",
        text: "I’m from Milan and was stuck editing podcast Shorts for my YouTube channel. These guys fixed it fast and made it flow way better. Grazie mille!",
        rating: 5,
        image: "/clients/luca.png"
    },
    {
        name: "Hannah G.",
        text: "They just *get* how YouTube content should feel. Every cut, caption, and beat drop was timed perfectly. My Shorts are performing better already.",
        rating: 5,
        image: "/clients/hannah.png"
    },
    {
        name: "Nathan C.",
        text: "Had to get branded reels edited for our company’s YouTube channel. They delivered overnight with clean cuts, great pacing, and no hand-holding.",
        rating: 4,
        image: "/clients/nathan.png"
    },
    {
        name: "Isabelle M.",
        text: "I’ve tried Fiverr, I’ve tried Upwork. Nothing came close to the quality here.",
        rating: 5,
        image: "/clients/isabelle.png"
    },

    {
        name: "Olivia N.",
        text: "From messy behind-the-scenes to slick branded content. Total transformation!",
        rating: 5,
        image: "/clients/olivia.png"
    },
    {
        name: "Thomas R.",
        text: "Used them for my YouTube vlog — the edits were smooth, transitions clean, and they totally got my pacing. Exactly what I needed.",
        rating: 4.5,
        image: "/clients/thomas.png"
    },
    {
        name: "Julia K.",
        text: "I sent raw wedding footage for a family montage on YouTube — and it turned out so touching, my mom cried watching it. So grateful.",
        rating: 5,
        image: "/clients/julia.png"
    },
    {
        name: "Ethan W.",
        text: "They turned my real estate walkthrough into something you'd see on HGTV or Netflix. Uploaded it to YouTube and it looks so polished.",
        rating: 5,
        image: "/clients/ethan.png"
    },
    {
        name: "Chloe S.",
        text: "They edited my lifestyle vlog for YouTube — it felt like a proper episode. Great flow, music, and energy. Super happy!",
        rating: 5,
        image: "/clients/chloe.png"
    },
    {
        name: "Benjamin A.",
        text: "They’ve cut over 12 fitness Shorts for my channel. Every one hits — clean cuts, on-beat transitions, and zero micromanaging needed. 💪",
        rating: 5,
        image: "/clients/benjamin.png"
    },
    {
        name: "Ella D.",
        text: "I'm a content coach and sent them long-form YouTube videos + Instagram reels — both turned out way better than expected. They *get* content.",
        rating: 5,
        image: "/clients/ella.png"
    },
    {
        name: "Leo H.",
        text: "I run a podcast and needed help with YouTube Shorts. They picked all the best hooks and added captions that pop. Total pros.",
        rating: 5,
        image: "/clients/leo.png"
    },
    {
        name: "Freya M.",
        text: "I don’t understand editing at all, so I just sent my travel clips. They made a beautiful YouTube vlog out of it — smooth, cinematic, and easy!",
        rating: 5,
        image: "/clients/freya.png"
    },
    {
        name: "Oscar V.",
        text: "Made my boring LinkedIn video actually look interesting. Didn’t know that was possible 😂",
        rating: 4.5,
        image: "/clients/oscar.png"
    },
    {
        name: "Amelia C.",
        text: "I'm obsessed. My skincare brand reel got 3x more views thanks to their edit.",
        rating: 5,
        image: "/clients/amelia.png"
    },
    {
        name: "Miles J.",
        text: "Super responsive, professional, and creative — loved working with them.",
        rating: 5,
        image: "/clients/miles.png"
    },
    {
        name: "Nina T.",
        text: "The captions were timed perfectly, and the cuts felt really natural. Beautiful work.",
        rating: 4.5,
        image: "/clients/nina.png"
    },
    {
        name: "Jacob F.",
        text: "As a content creator, it's hard to find good editors. I struck gold with this team.",
        rating: 5,
        image: "/clients/jacob.png"
    },

];


export default function Testimonials() {
    const scrollRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;

            // Check if it's scrolled to the end
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
                // Scroll back to start
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                // Scroll forward
                el.scrollBy({ left: 300, behavior: "smooth" });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            
            <div className="flex flex-col items-center mb-8">
                <div className="h-1 bg-gray-500 rounded-full w-20 sm:w-28 md:w-32 lg:w-48"></div>
            </div>
            <section className="bg-black-900 py-10 mt-16">

                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-20">
                    Why Creators Trust Us
                </h2>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto space-x-8 px-6 no-scrollbar"
                >

                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="min-w-[300px] max-w-xs bg-zinc-800 text-white p-6 rounded-2xl shadow-lg shrink-0 flex flex-col justify-between"
                        >
                            {/* Testimonial Text */}
                            <p className="text-sm text-zinc-300 mb-4">"{testimonial.text}"</p>

                            {/* User Info Section */}
                            <div className="flex items-center space-x-4 mt-auto">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-zinc-100">
                                        {testimonial.name}
                                    </p>
                                    <div className="flex items-center gap-0.5 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const filled = testimonial.rating >= star;
                                            const half = testimonial.rating >= star - 0.5 && testimonial.rating < star;
                                            return (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill={filled ? "#facc15" : half ? "url(#half)" : "none"}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="#facc15"
                                                    className="w-4 h-4"
                                                >
                                                    <defs>
                                                        <linearGradient id="half">
                                                            <stop offset="50%" stopColor="#facc15" />
                                                            <stop offset="50%" stopColor="transparent" />
                                                        </linearGradient>
                                                    </defs>
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 17.25L6.515 20.375l1.047-6.11-4.44-4.33 6.14-.893L12 3.75l2.738 5.292 6.14.893-4.44 4.33 1.047 6.11L12 17.25z"
                                                    />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
