"use client";
import Heading from '../../components/Heading';
import Header from "../../components/Header";

const portfolioVideos = [
    //short videos
    {
        url: "https://www.youtube.com/shorts/5qap5aO4i9A",
        title: "Lo-fi Girl Live Shorts",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/K4TOrB7at0Y",
        title: "Kurzgesagt Science Short",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/6UStv2lKznc",
        title: "Apple Vision Pro in 30 sec",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/VYOjWnS4cMY",
        title: "MKBHD iPhone Short",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/9wD1ykkk1Mc",
        title: "30-sec Productivity Hack",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/0nIjR5P9yF0",
        title: "Instagram Reel Dance",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/3ZxBfsQuuKM",
        title: "Quick Photoshop Tip",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/VqL2gK8Onzk",
        title: "Tesla Autopilot Fails",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/I8XvVHdk7JQ",
        title: "SpaceX Launch Highlight",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/3QEZwT-jMKs",
        title: "AI in 60 Seconds",
        type: "short",
    },
      
    //long videos
    {
        url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        title: "Me at the zoo",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
        title: "Billie Jean - Michael Jackson",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=kXYiU_JCYtU",
        title: "Numb - Linkin Park",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
        title: "The Chainsmokers - Closer",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=fLexgOxsZu0",
        title: "Happy - Pharrell Williams",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=CevxZvSJLk8",
        title: "Katy Perry - Roar",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=YqeW9_5kURI",
        title: "Major Lazer - Lean On",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=60ItHLz5WEA",
        title: "Alan Walker - Faded",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
        title: "Uptown Funk - Bruno Mars",
        type: "long",
    },
    {
        url: "https://www.youtube.com/watch?v=RgKAFK5djSk",
        title: "Wiz Khalifa - See You Again",
        type: "long",
    },
];

function convertToEmbed(url) {
    try {
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = new URL(url).searchParams.get("v");
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtube.com/shorts/")) {
            const id = url.split("/shorts/")[1];
            return `https://www.youtube.com/embed/${id}?playsinline=1`;
        }
        if (url.includes("vimeo.com/")) {
            const id = url.split("vimeo.com/")[1];
            return `https://player.vimeo.com/video/${id}`;
        }
    } catch (e) {
        return null;
    }

    return null; // For Instagram, Dropbox, etc.
}

function VideoCard({ url, title, type }) {
    const isShort = type === "short";
    const embedUrl = convertToEmbed(url);
    const supportsEmbed = !!embedUrl;

    return (
        <div className="group w-fit">
            <div
                className={`overflow-hidden rounded-xl shadow-md hover:shadow-xl transition border border-gray-200 ${isShort ? "w-40 h-72" : "w-64 h-36"
                    } bg-black`}
            >
                {supportsEmbed ? (
                    <iframe
                        src={embedUrl}
                        title={title}
                        className="w-full h-full"
                        allowFullScreen
                        loading="lazy"
                    />
                ) : (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center text-white text-xs px-2 text-center"
                    >
                        View Video ↗
                    </a>
                )}
            </div>
            <div className="mt-2 px-1">
                <h3 className="text-sm font-semibold text-[#001c64] truncate group-hover:text-[#003087]">
                    {title}
                </h3>
                <span className="text-xs text-[#003087] uppercase">
                    {isShort ? "Short Video" : "Long-form Video"}
                </span>
            </div>
        </div>
    );
}

export default function Portfolio() {
    const shorts = portfolioVideos.filter((v) => v.type === "short");
    const longs = portfolioVideos.filter((v) => v.type === "long");

    return (
        <section
            id="portfolio"
            className="bg-white text-gray-900 pb-20"
        >
            {/* Header */}
            <Header />

            {/* 🌟 Information Section */}
            <section id="text-section1" className="bg-[#fff] pt-12 py-2 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#001c64] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Portfolio Highlights
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            Explore our best edits — high-performing short reels and professional long-form productions.
                        </div>
                    </div>
                </div>
            </section>


            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Main Title */}
                {/* <Heading className="text-[#001c64]">
                    Portfolio Highlights
                </Heading>
                <div className="text-[#001c64] text-sm md:text-base leading-relaxed md:leading-loose mt-2">
                    Explore our best edits — high-performing short reels and professional long-form productions.
                </div> */}

                {/* Shorts Section */}
                <h3 className="text-xl sm:text-2xl font-semibold text-[#003087] mb-6 mt-8 sm:mt-12 text-left">
                    Short Videos & Reels
                </h3>
                <div className="h-1 w-20 bg-[#003087] mb-6 rounded"></div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                    {shorts.map((video, index) => (
                        <VideoCard key={index} {...video} />
                    ))}
                </div>

                {/* Long-Form Section */}
                <h3 className="text-xl sm:text-2xl font-semibold text-[#003087] mb-6 mt-12 text-left">
                    Long-Form Videos
                </h3>
                <div className="h-1 w-20 bg-[#003087] mb-6 rounded"></div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                    {longs.map((video, index) => (
                        <VideoCard key={index} {...video} />
                    ))}
                </div>
            </div>
        </section>
      
    );
}
