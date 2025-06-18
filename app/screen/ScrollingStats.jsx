"use client";
import React, { useEffect, useRef, useState } from "react";

const stats = [
    { label: "Videos Edited", value: 350, icon: "/icons/play-button.png" },
    { label: "Happy Creators", value: 120, icon: "/clients/james.png" },
    { label: "Avg. Delivery Time", value: 48, suffix: "hrs", icon: "/icons/time-passing.png" },
    { label: "Countries Served", value: 5, icon: "/icons/airplane.png" },
];

const AnimatedStats = () => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const containerRef = useRef(null);
    const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    animateStats();
                }
            },
            { threshold: 0.3 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const animateStats = () => {
        const duration = 1500;
        const frameRate = 60;
        const steps = Math.round((duration / 1000) * frameRate);

        const intervals = stats.map((stat, index) => {
            let current = 0;
            const step = stat.value / steps;
            return setInterval(() => {
                current += step;
                setAnimatedValues((prev) => {
                    const updated = [...prev];
                    updated[index] = Math.min(Math.round(current), stat.value);
                    return updated;
                });
            }, duration / steps);
        });

        setTimeout(() => intervals.forEach(clearInterval), duration);
    };

    return (
       
        <section
            ref={containerRef}
            className="bg-[#f3f3f6] text-gray-900 py-10 px-6 md:px-20"
        >
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#001c64]">
                    Trusted by Creators Worldwide
                </h2>
                <p className="text-black mt-2">We let our numbers speak.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-4 md:gap-8 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center bg-white rounded-xl p-6 border border-gray-200"
                    >
                        <img
                            src={stat.icon || stat.image}
                            alt={stat.label}
                            className="w-12 h-12 object-contain rounded-full"
                        />
                        <h3 className="text-3xl font-bold text-gray-900 pt-4">
                            {animatedValues[index]}
                            {stat.suffix || ""}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    

    );
};

export default AnimatedStats;
