// app/page.tsx
'use client';
import Script from "next/script";
import Image from "next/image";
import Testimonials from './screen/Testimonials';
// app/page.tsx
import LandingForm from './screen/LandingForm';
import Steps from './screen/Steps.jsx';
import ScrollingStats from './screen/ScrollingStats.jsx';
import EditingTier from './screen/EditingTier';
import Footer from "./screen/Footer";

import Link from 'next/link';

import Heading from '../components/Heading';

export default function Home() {
  return (
    <>

      <a
        href="https://wa.me/918824083829"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2 pr-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-xl transition-all duration-300 group"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Avatar with badge wrapper */}
        <div className="relative">
          {/* Your Photo */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-1 border-white shadow">
            <img
              src="/icons/akash.png"
              alt="Support"
              className="object-cover w-full h-full"
            />
          </div>

          {/* WhatsApp Badge Icon - placed OUTSIDE avatar */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center bg-white justify-center shadow-md">
            <img
              src="/icons/whatsapp.png"
              alt="WhatsApp"
              className="w-4 h-4"
            />
          </div>
        </div>

        {/* Text & Subtext */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold group-hover:translate-x-1 transition-transform">
            Chat with Us
          </span>
          <span className="text-[11px] opacity-80 -mt-0.5">
            Drop a message — we reply fast!
          </span>
        </div>
      </a>

      <header id="home" className="bg-white text-[#001c64] flex justify-between items-center px-4 sm:px-10 md:px-20 py-4 border-b border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <img src="/favicon.ico" alt="TuesdayTrim Logo" className="w-8 h-8" />
          TuesdayTrim
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium text-sm">
          <div className="flex gap-3">
            <a
              href="#home"
              className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#e3f9fe] hover:text-[#003087] transition-colors"
            >
              Home
            </a>
            <a
              href="#footer"
              className="text-base font-bold px-4 py-2 rounded-full hover:bg-[#e3f9fe] hover:text-[#003087] transition-colors"
            >
              Contact
            </a>
          </div>

        </nav>

        {/* CTA Button */}
        <a
          href="#orderSection"
          className="ml-4 bg-[#003087] hover:bg-[#0874e4] transition-colors px-5 py-2 rounded-full text-white font-semibold text-base shadow"
        >
          Get Started
        </a>
      </header>


      <main id="orderSection" className="bg-white text-gray-900 py-8 sm:py-10 md:py-8 lg:py-6">

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 sm:px-10 md:px-20 bg-[url('/icons/next.png')] bg-cover bg-center text-white"
        >
          {/* children */}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 sm:px-10 md:px-20">

          {/* Left (Text) - 45% on desktop */}
          <div className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left space-y-6 mt-0 md:mt-[-80px]">
            {/* 
            <h1
              className="font-sans font-extrabold text-[40px] sm:text-[56px] md:text-[70px] leading-[1.1] tracking-[-0.03em] text-[#001c64]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              You Shoot,<br />We Edit.
            </h1> */}

            <Heading className="text-[#001c64] text-[36px] sm:text-[50px] md:text-[66px]" weight={600}>
              You Shoot,<br />We Edit.
            </Heading>

            {/* <h1
              className="font-sans text-3xl sm:text-4xl md:text-7xl font-extrabold leading-snug tracking-[-0.04em] text-[#001c64]"
              style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            >
              Pay easy, fast,<br /> and Secure.
            </h1> */}

            <p className="text-sm sm:text-base text-black">
              Send us your raw footage, and we’ll turn it into polished, ready-to-post videos.
              Whether it’s Reels, YouTube, or long-form content — we handle the editing, you stay focused on creating.
            </p>
          </div>

          {/* Right (Form) - 55% on desktop */}
          <div className="w-full md:w-[60%] flex justify-center mt-12 md:mt-0">

            {/* <Script src="https://www.paypal.com/sdk/js?client-id=AYc2iFVc3SlSYh7lthEbE2nLzwGQWfYhYxT6knouke2Dt7F0SjkAbCB5sNqhRPG29FLxH1acexKnmHtm">
            </Script> */}

            <LandingForm />
          </div>

        </div>
      </main>

      {/* 🌟 Editing tier Section */}
      <section id="editingTier" className="bg-[#f3f3f6] text-gray-900 px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <EditingTier />
      </section>

      {/* 🌟 information Section */}
      <section id="text-section1" className="bg-[#0070e0] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <Heading className="text-[#ffffff]">
            We never showcase your videos or share them with other clients as samples.<br />
            Your content stays 100% private and secure.
          </Heading>
          <div className="text-white text-sm md:text-base mt-1">
            Demo uses non-client footage to respect creator privacy*
          </div>
        </div>
      </section>

      {/* 🌟 demo video */}
      <div className="relative w-full h-auto">
        <video
          className="w-full"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/file.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 text-center">
          <div className="bg-[#000] bg-opacity-50 px-3 py-2 md:px-6 md:py-4 rounded-lg">
            <div className="text-white text-xl md:text-4xl font-semibold">
              100% Private & Secure
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Steps Section */}
      <section id="steps" className="bg-white text-white px-2 sm:px-10 md:px-20 py-6 sm:py-10">
        <Steps />
      </section>

      {/* 🌟 Stats Section */}
      <section id="scrollingStats" className="bg-[#001435] text-white px-2 sm:px-10 md:px-20 py-6 sm:py-10">
        <ScrollingStats />
      </section>

      {/* 🌟 Testimonial Section */}
      <section id="testimonials" className="bg-white text-white px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <Testimonials />
      </section>

      {/* 🌟 Footer Section */}
      <section id="footer" className="bg-[#001435] text-white px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <Footer />
      </section>
    </>
  );
}