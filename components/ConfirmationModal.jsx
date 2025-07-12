"use client";

export default function ConfirmationModal({
    onClose,
    title = "Thank you!",
    description = "Your action was successful.",
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative animate-fade-in">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Modal Content */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-4 flex items-center justify-center bg-emerald-600 rounded-full">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
                    <p className="text-gray-600 text-sm px-2 mb-4">{description}</p>

                    <button
                        onClick={onClose}
                        className="mt-2 px-5 py-2 bg-emerald-600 text-white text-sm rounded-full hover:bg-emerald-700 transition"
                    >
                       Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
