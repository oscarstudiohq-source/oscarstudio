import Script from "next/script";
import Image from "next/image";
import Testimonials from './screen/Testimonials';
// app/page.tsx
import LandingForm from './screen/LandingForm';
import Steps from './screen/Steps.jsx';
import ScrollingStats from './screen/ScrollingStats.jsx';

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


      <main className="bg-black text-white py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-2 sm:px-10 md:px-20">

          {/* Left (Text) - 45% on desktop */}
          <div className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug">
              You Shoot,<br /> We Edit. Deal?
            </h1>
            <p className="text-base sm:text-lg text-zinc-300">
              Send us your raw footage, and we’ll turn it into polished, ready-to-post videos.
              Whether it’s Reels, YouTube, or long-form content — we handle the editing, you stay focused on creating.
            </p>
          </div>

          {/* Right (Form) - 55% on desktop */}
          <div className="w-full md:w-[60%] flex justify-center mt-12 md:mt-0">
            <Script
              src="https://www.paypal.com/sdk/js?client-id=AYc2iFVc3SlSYh7lthEbE2nLzwGQWfYhYxT6knouke2Dt7F0SjkAbCB5sNqhRPG29FLxH1acexKnmHtm&currency=USD"
              strategy="afterInteractive"
            />
            <LandingForm />
          </div>

        </div>
      </main>


      {/* 🌟 Steps Section */}
      <section className="bg-black text-white px-2 sm:px-10 md:px-20 py-12 sm:py-16">
        <Steps />
      </section>

      {/* 🌟 Steps Section */}  
      <section className="bg-black text-white px-2 sm:px-10 md:px-20 py-12 sm:py-16">
        <ScrollingStats />
      </section>

      {/* 🌟 Testimonial Section */}
      <section className="bg-black text-white px-2 sm:px-10 md:px-20 py-12 sm:py-16">
        <Testimonials />
      </section>
    </>
  );
}