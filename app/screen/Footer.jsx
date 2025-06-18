export default function Footer() {
    return (
        <footer className="bg-[#001435] text-white px-6 sm:px-10 md:px-20 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <h3 className="text-2xl font-bold mb-2">TuesdayTrim</h3>
                    <p className="text-sm text-gray-300">
                        Seamless video editing for creators — fast, affordable, professional.
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-gray-300">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#home" className="hover:underline text-gray-100">Home</a></li>
                        <li><a href="#footer" className="hover:underline text-gray-100">Contact</a></li>
                        <li><a href="#home" className="hover:underline text-gray-100">Order Now</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-gray-300">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#terms" className="hover:underline text-gray-100">Terms of Service</a></li>
                        <li><a href="#privacy" className="hover:underline text-gray-100">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-gray-300">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            Email: <a
                                href="mailto:support@tuesdaytrim.com"
                                className="hover:underline text-gray-100"
                            >
                                support@tuesdaytrim.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://wa.me/918824083829"
                                className="hover:underline text-gray-100"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Chat on WhatsApp
                            </a>
                        </li>
                    </ul>
                </div>
                {/* <div>
                    <h4 className="text-sm font-semibold uppercase mb-3 tracking-wider text-gray-300">Follow Us</h4>
                    <div className="flex space-x-4">
                       
                    </div>
                </div> */}
            </div>
            <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-gray-400 text-center">
                © {new Date().getFullYear()} TuesdayTrim. All rights reserved.
            </div>
        </footer>
    );
}
