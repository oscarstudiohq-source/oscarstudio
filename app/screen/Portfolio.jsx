"use client";
import Heading from '../../components/Heading';
import Header from "../../components/Header";

const portfolioVideos = [
    {
        url: "https://www.youtube.com/shorts/OLG95eePMg8",
        title: "video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/h0NGJGvp4lc",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/918nPdw0LUc",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/KYqsws2ALrs",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/DjQPLXLnDC0",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/ZcP4NYTtuD4",
        title: "video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/pFPWbho9r54",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/X9iVfYVcq44",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/ND0CdqpemAM",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/9cskzMO967M",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/g8JLt7H6k0A",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/r1WsP7Cm23k",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/D0x2mp8rRbY",
        title: "Informative video sample",
        type: "short",
    },
    {
        url: "https://www.youtube.com/shorts/xffN_Nq3f-k",
        title: "Informative video sample",
        type: "short",
    },
    // {
    //     url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    //     title: "Me at the zoo",
    //     type: "long",
    // },
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
        <div className="group w-full">
            <div
                className={`overflow-hidden rounded-xl shadow-md hover:shadow-xl transition border border-gray-200 bg-black 
          ${isShort ? "aspect-[9/16]" : "aspect-video"}`}
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
            <div className="mt-2 px-1 mb-1">
                {/* <h3 className="text-sm font-semibold text-[#7D5B39] truncate group-hover:text-[#003087]">
                    {title}
                </h3> */}
                <span className="text-xs text-[#003087] uppercase">
                    {isShort ? "YT Shorts/ IG Reels" : "Long-form Video"}
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
            <section
                id="text-section1"
                className="bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-5 md:pb-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#7D5B39] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Portfolio Highlights
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            Explore our best edits — high-performing short reels and professional long-form productions.
                        </div>
                    </div>
                </div>
            </section>


            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-6 md:mt-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#003087] mb-6 mt-0 text-left">
                    Short Videos & Reels - Client Work
                </h3>
                <div className="h-1 w-20 bg-[#003087] mb-6 rounded"></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                    {shorts.map((video, index) => (
                        <VideoCard key={index} {...video} />
                    ))}
                </div>

                {/* Long-Form Section */}
                <h3 className="text-xl sm:text-2xl font-semibold text-[#003087] mb-6 mt-12 text-left">
                    Long-Form Videos - Client Work
                </h3>
                <div className="h-1 w-20 bg-[#003087] mb-6 rounded"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {longs.map((video, index) => (
                        <VideoCard key={index} {...video} />
                    ))}
                </div>
            </div>
        </section>

    );
}
