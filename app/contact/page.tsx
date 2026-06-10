import Header from "../../components/Header";
import Heading from "../../components/Heading";

export default function ContactPage() {
    return (
        <div>
            <Header />

            {/* Hero Section */}
            <section
                id="text-section1"
                className="bg-white px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-4 sm:pb-5 md:pb-6"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#a48c74] text-white rounded-2xl px-6 sm:px-10 py-10 text-center shadow-md">
                        <Heading className="text-white text-2xl sm:text-3xl font-bold">
                            Contact Us
                        </Heading>
                        <div className="text-white text-sm sm:text-base leading-relaxed sm:leading-loose mt-2 max-w-3xl mx-auto">
                            Need help? We're here to assist you with anything related to your orders or services.
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">We're Here to Help</h1>

                <p className="mb-6">
                    For any questions regarding orders, payments, or services provided through <strong>OscarStudio.in</strong>,
                    you can contact our team using the details below.
                </p>

                
                <h2 className="text-xl font-semibold mt-6 mb-2">Website</h2>
                <p className="mb-4">
                    <a href="https://oscarstudio.in" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                        www.oscarstudio.in
                    </a>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Support Email</h2>
                <p className="mb-4">
                    <a href="mailto:support@oscarstudio.in" className="text-blue-600 underline">
                        support@oscarstudio.in
                    </a>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Phone / WhatsApp</h2>
                <p className="mb-4">
                    <a
                        href="https://wa.me/918824083829"
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        +91 88240 83829
                    </a>
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Business Name</h2>
                <p className="mb-4">Bigmeet Infotech Private Limited</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">Business Address</h2>
                <p className="mb-6">
                    Saroj Sharma W/O Bihari Lal, Plot No-12, Ward No-2,<br />
                    Near Laxmi Talkies, Chirawa, Jhunjhunu,<br />
                    Rajasthan – 333026
                </p>

                <div className="border rounded-xl p-4 bg-gray-50 text-gray-600">
                    <p className="text-sm">
                        You can reach out to us anytime via email or WhatsApp at{" "}
                        <a
                            href="https://wa.me/918824083829"
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            +91 88240 83829
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
