import { Heart } from "lucide-react";
import Heading from "../../components/Heading";
import Header from "../../components/Header";

export default function RefundPolicyPage() {
    return (
        <div>
            <Header />

            {/* 🌟 Information Section */}
            <section
                id="text-section1"
                className="bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-5 md:pb-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#001c64] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Refund & Cancellation Policy
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            How we handle cancellations and refunds.
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Refund & Cancellation Policy</h1>

                <p className="mb-4">
                    This refund and cancellation policy outlines how you can cancel an order or seek a refund for services purchased through Tuesday Trim (operated by Bigmeet Infotech Private Limited).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Cancellations</h2>
                <p className="mb-4">
                    Cancellations are accepted only if requested within <strong>24 hours</strong> of placing the order, and only if the editing work has not yet begun. Once our editors start working on your content, the order becomes non-refundable.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Non-Refundable Cases</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>If editing work has already started</li>
                    <li>If the final output has already been delivered</li>
                    <li>If the refund request is made after 24 hours of order placement</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">Refund Eligibility</h2>
                <p className="mb-4">
                    If there is a technical issue or the delivered output does not meet basic quality standards for the selected package, you may contact us with a detailed explanation. After review, we may approve a partial or full refund on a case-by-case basis.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Refund Process</h2>
                <p className="mb-4">
                    Approved refunds will be processed within <strong>5–7 business days</strong> to the original payment method.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
                <p className="mb-2">
                    For any cancellation or refund-related queries, please contact our support team:
                </p>
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
                    <strong>This policy is effective from 1st April 2025.</strong>
                </p>

                <p className="mt-4">
                    By placing an order on our platform, you agree to this refund and cancellation policy.
                </p>
            </div>
        </div>
    );
}
