import Header from "../../components/Header";
import Heading from "../../components/Heading";

export default function TermsPage() {
    return (
        <div>
            <Header />

            <section
                id="text-section1"
                className="bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-5 md:pb-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#a48c74] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Terms & Conditions
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            Please read these terms carefully before using OscarStudio.
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-3xl mx-auto p-6">
                <p className="mb-4 text-sm text-gray-500">
                    Effective from: April 1, 2025
                </p>

                <p className="mb-4">
                    These Terms and Conditions govern your use of OscarStudio.in (“Platform”),
                    operated by <strong>Bigmeet Infotech Private Limited</strong>.
                    By accessing or using the Platform, you agree to be bound by these terms.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of the Platform</h2>
                <p className="mb-4">
                    You must be at least 18 years of age or use the Platform under the supervision of a parent or guardian.
                    You agree not to misuse the Platform, and to follow all applicable laws while using our services.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. Services Offered</h2>
                <p className="mb-4">
                    We provide digital video editing and content production services. All orders must be prepaid.
                    Delivery timelines vary based on the selected package.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Payments</h2>
                <p className="mb-4">
                    All payments must be made through the available options on the website.
                    Once the editing process begins, cancellations and refunds are subject to our <a href="/refund-policy" className="text-blue-600 underline">Refund Policy</a>.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
                <p className="mb-4">
                    All content, designs, and branding on the Platform are the intellectual property of OscarStudio
                    or its licensors. You may not reproduce or reuse any part of the content without permission.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
                <p className="mb-4">
                    We are not liable for any direct or indirect damages resulting from your use of the Platform or our services.
                    Your use of the Platform is at your own risk.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
                <p className="mb-4">
                    We may modify these terms from time to time. Updated versions will be posted on this page with the effective date.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Information</h2>
                <p className="mb-4">
                    For any questions regarding these Terms, please contact us:
                </p>
                <ul className="list-disc ml-6 mb-4 text-sm">
                    <li>Email: <a href="mailto:support@oscarstudio.in" className="text-blue-600 underline">support@oscarstudio.in</a></li>
                    <li>Phone / WhatsApp: <a href="https://wa.me/918824083829" className="text-blue-600 underline">+91 88240 83829</a></li>
                    <li>Business Name: Bigmeet Infotech Private Limited</li>
                    <li>Address: Saroj Sharma W/O Bihari Lal, Plot No-12, Ward No-2, Near Laxmi Talkies, Chirawa, Jhunjhunu, Rajasthan – 333026</li>
                </ul>

                <p className="mt-6">
                    By using this website, you agree to the above terms.
                </p>
            </div>
        </div>
    );
}
