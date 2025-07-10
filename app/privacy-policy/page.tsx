import { Heart } from "lucide-react";
import Heading from "../../components/Heading";
import Header from "../../components/Header";

export default function PrivacyPolicyPage() {
    return (
        <div>
            <Header />

            {/* 🌟 Info Section */}
            <section
                id="text-section1"
                className="bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-5 md:pb-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#001c64] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Privacy Policy
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            How we collect, use, and protect your personal data.
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

                <p className="mb-4">
                    This Privacy Policy explains how Tuesday Trim (operated by Bigmeet Infotech Private Limited) collects, uses, and protects personal information when you use our platform.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>Your name, email, and phone number</li>
                    <li>Uploaded videos or images</li>
                    <li>Device and browser data (via analytics)</li>
                    <li>Order details and transaction history</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>To provide video editing and design services</li>
                    <li>To communicate with you about orders</li>
                    <li>To improve our platform and user experience</li>
                    <li>To comply with legal and financial obligations</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Tools</h2>
                <p className="mb-4">
                    We may use trusted third-party services like Supabase, Google Analytics, and Cloudflare R2 to help us store, analyze, and improve our services. These platforms may collect limited user data to support core functionality.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
                <p className="mb-4">
                    We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Your Consent</h2>
                <p className="mb-4">
                    By using our website or placing an order, you consent to this privacy policy and the collection and use of information as outlined here.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>Email: <a href="mailto:support@tuesdaytrim.com" className="text-blue-600 underline">support@tuesdaytrim.com</a></li>
                    <li>Phone / WhatsApp: <a href="tel:+918824083829" className="text-blue-600 underline">+91 88240 83829</a></li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">Business Address</h2>
                <p>
                    Saroj Sharma W/O Bihari Lal, Plot No-12, Ward No-2,<br />
                    Near Laxmi Talkies, Chirawa, Jhunjhunu,<br />
                    Rajasthan – 333026
                </p>

                <p className="mt-6">
                    <strong>This privacy policy is effective from 1st April 2025.</strong>
                </p>

                <p className="mt-4">
                    We may update this policy occasionally. Continued use of our platform after any changes will be deemed as your acceptance of those changes.
                </p>
            </div>
        </div>
    );
}
