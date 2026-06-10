"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header id="home" className="bg-white text-[#7D5B39] border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-20 py-4 relative">
                {/* Logo */}
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    {/* <img src="/favicon.ico" alt="OscarStudio Logo" className="w-8 h-8" /> */}
                    OscarStudio.in
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-6 font-medium text-sm">
                    <Link
                        href="/#home"
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Home
                    </Link>
                    <a
                        href="/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Contact
                    </a>

                    <Link
                        href="/portfolio"
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Portfolio
                    </Link>
                </nav>

                {/* CTA + Mobile Icon */}
                <div className="flex items-center gap-3">
                    {/* CTA Button: hidden on mobile */}
                    <a
                        href="/#orderSection"
                        className="hidden sm:inline-block bg-[#977c61] hover:bg-[#7D5B39] transition-colors px-5 py-2 rounded-full text-white font-semibold text-base shadow"
                    >
                        Get Started
                    </a>
                    {/* Hamburger Menu (shown only on mobile) */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-[#7D5B39] focus:outline-none"
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-2 px-4 pb-4">
                    <Link
                        href="/#home"
                        onClick={() => setMenuOpen(false)}
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/#footer"
                        onClick={() => setMenuOpen(false)}
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/portfolio"
                        onClick={() => setMenuOpen(false)}
                        className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#977c61] hover:text-[#ffffff] transition-colors"
                    >
                        Portfolio
                    </Link>
                    <a
                        href="/#orderSection"
                        className="mt-2 bg-[#ffffff] hover:bg-[#0874e4] transition-colors px-5 py-2 rounded-full text-white font-semibold text-base text-center shadow"
                    >
                        Get Started
                    </a>
                </div>
            )}
        </header>
      
    );
}
