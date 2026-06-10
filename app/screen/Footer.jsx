export default function Footer() {
    return (
        <footer className="bg-[#001435] text-white px-6 sm:px-10 md:px-20 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>


                    <img src="/logo1-white.png" alt="OscarStudio Logo" className="rounded-full" />

                    {/* <h3 className="text-2xl font-bold mb-2">OscarStudio</h3> */}
                    <p className="text-sm text-white">
                        Seamless video editing for creators — fast, affordable, professional.
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-white">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/#home" className="hover:underline text-white">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline text-white"
                                >
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="/#home" className="hover:underline text-white">
                                    Order Now
                                </a>
                            </li>
                        </ul>

                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-white">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a
                                href="/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-white"
                            >
                                Terms and Conditions
                            </a>
                        </li>
                        <li>
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-white"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="/refund-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-white"
                            >
                                Refund & Cancellation Policy
                            </a>
                        </li>
                    </ul>

                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-white">Contact</h4>

                    <ul className="space-y-2 text-sm text-white">
                        <li>
                            Email:{" "}
                            <a
                                href="mailto:support@oscarstudio.in"
                                className="hover:underline"
                            >
                                support@oscarstudio.in
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://wa.me/918824083829"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Chat on WhatsApp
                            </a>
                        </li>
                        <li className="text-white">
                            Bigmeet Infotech Pvt. Ltd.
                        </li>
                    </ul>

                    {/* ✅ Social Icons with Label */}
                    <div className="mt-6">
                        <p className="text-sm font-medium text-white mb-4">Follow us on</p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/people/OscarStudio/61578226494486/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/icons/facebook.png" alt="Facebook" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.instagram.com/tuesday_trim/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                            </a>
                            <a
                                href="https://www.youtube.com/channel/UC0x1DR3gKszUWOK8MmWj9uQ"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/icons/youtube.png" alt="YouTube" className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-white text-center">
                © {new Date().getFullYear()} OscarStudio. All rights reserved.
            </div>
        </footer>
    );
}
