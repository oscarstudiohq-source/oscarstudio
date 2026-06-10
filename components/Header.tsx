"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const linkClass = (path: string) =>
        `text-base font-bold px-4 py-2 rounded-full transition-colors ${isActive(path)
            ? "bg-[#977c61] text-white"
            : "hover:bg-[#977c61] hover:text-white"
        }`;

    return (
        <header className="bg-white text-[#7D5B39] border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-20 py-4 relative">

                {/* Logo */}
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    OscarStudio.in
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-6 font-medium text-sm">
                    <Link href="/" className={linkClass("/")}>
                        Home
                    </Link>

                    <Link href="/contact" className={linkClass("/contact")}>
                        Contact
                    </Link>

                    <Link href="/portfolio" className={linkClass("/portfolio")}>
                        Portfolio
                    </Link>
                </nav>

                {/* CTA + Mobile */}
                <div className="flex items-center gap-3">
                    <a
                        href="/#orderSection"
                        className="hidden sm:inline-block bg-[#977c61] hover:bg-[#7D5B39] transition-colors px-5 py-2 rounded-full text-white font-semibold text-base shadow"
                    >
                        Get Started
                    </a>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-[#7D5B39]"
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col gap-2 px-4 pb-4">
                    <Link
                        href="/"
                        onClick={() => setMenuOpen(false)}
                        className={linkClass("/")}
                    >
                        Home
                    </Link>

                    <Link
                        href="/contact"
                        onClick={() => setMenuOpen(false)}
                        className={linkClass("/contact")}
                    >
                        Contact
                    </Link>

                    <Link
                        href="/portfolio"
                        onClick={() => setMenuOpen(false)}
                        className={linkClass("/portfolio")}
                    >
                        Portfolio
                    </Link>
                </div>
            )}
        </header>
    );
}