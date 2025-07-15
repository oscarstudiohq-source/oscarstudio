// app/page.tsx
'use client';
import Script from "next/script";
import Image from "next/image";
import { Suspense } from "react";
import Testimonials from './screen/Testimonials';
// app/page.tsx
import LandingForm from './screen/LandingForm';
import Steps from './screen/Steps.jsx';
import ScrollingStats from './screen/ScrollingStats.jsx';
import EditingTier from './screen/EditingTier';
import Header from "../components/Header";
import Footer from "./screen/Footer";

import Link from 'next/link';

import Heading from '../components/Heading';

export default function Home() {
  return (
    <>

      <a
        href="https://wa.me/918426919793?text=Hi%2C%20I%E2%80%99m%20looking%20to%20get%20my%20videos%20edited%20with%20TuesdayTrim.%20Can%20you%20help%3F"
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

      <Header />

      <main id="orderSection" className="bg-white text-gray-900 py-8 sm:py-10 md:py-8 lg:py-6">

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 sm:px-10 md:px-20 bg-[url('/icons/next.png')] bg-cover bg-center text-white"
        >
          {/* children */}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 sm:px-10 md:px-20">

          {/* Left (Text) - 45% on desktop */}
          <div className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left space-y-6 mt-0 md:mt-[-80px]">
            
            <img src="/newlogo.png" alt="TuesdayTrim Logo" className="w-20 h-20 rounded-full" />

            <Heading className="text-[#001c64] text-[32px] sm:text-[46px] md:text-[58px]" weight={800}>
              You Shoot,<br />We Edit.
            </Heading>

            <p className="text-sm sm:text-base text-black">
              Send us your raw footage, and we’ll turn it into polished, ready-to-post videos.
              Whether it’s Reels, YouTube, or long-form content — we handle the editing, you stay focused on creating.
            </p>
          </div>

          {/* Right (Form) - 55% on desktop */}
          <div className="w-full md:w-[60%] flex justify-center">
            <Suspense fallback={<div>Loading form...</div>}>
              <LandingForm />
            </Suspense>
          </div>
          {/* <div className="w-full md:w-[60%] flex justify-center">
            <LandingForm />
          </div> */}

        </div>
      </main>

      {/* 🌟 Steps Section */}
      <section id="steps" className="bg-white text-white px-2 sm:px-10 md:px-20 py-6 sm:py-10">
        <Steps />
      </section>

      {/* 🌟 information Section */}
      <section id="text-section1" className="bg-[#0070e0] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <Heading className="text-[#ffffff]">
            The growth secret of top 1% creators?<br />
            Pro editing. That’s us.
          </Heading>
          <div className="text-white text-sm md:text-base mt-2">
            Want your videos go viral? Let us do the editing.
          </div>
        </div>
      </section>


      {/* 🌟 Editing tier Section */}
      <section id="editingTier" className="bg-[#f3f3f6] text-gray-900 px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <EditingTier />
      </section>

      {/* 🌟 information Section */}
      <section id="text-section1" className="bg-[#0070e0] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <Heading className="text-[#ffffff]">
            Want more engagement on your videos?<br />
            Fast, high-quality edits that keep viewers hooked.
          </Heading>
          <div className="text-white text-sm md:text-base mt-2">
            Gain more subscribers, followers, and boost engagement with expertly edited videos designed for growth.
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
      </div>


      {/* 🌟 Testimonial Section */}
      <section id="testimonials" className="bg-white text-white px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <Testimonials />
      </section>

      {/* 🌟 Stats Section */}
      <section
        id="scrollingStats"
        className="bg-[#fff] px-2 sm:px-6 md:px-8 py-6 pb-10 sm:py-10 mb-12"
      >
        <div className="bg-[#001435] text-white rounded-2xl px-4 sm:px-10 py-6 sm:py-8 shadow-md max-w-7xl mx-auto">
          <ScrollingStats />
        </div>
      </section>


      {/* 🌟 Footer Section */}
      <section id="footer" className="bg-[#001435] text-white px-4 sm:px-10 md:px-20 py-6 sm:py-10">
        <Footer />
      </section>
    </>
  );
}