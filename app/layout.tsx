// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuesdayTrim – Best Video Editing for YouTube Creators in the US, UK & Europe",
  description:
    "Tired of editing YouTube videos, Shorts, Reels, or TikToks? TuesdayTrim offers fast, pro video editing trusted by creators in the US, UK & Europe. Skip the editing stress — book now!",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  applicationName: "TuesdayTrim",
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "TuesdayTrim",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>TuesdayTrim – Best Video Editing for YouTube Creators in the US, UK & Europe</title>
        <meta
          name="description"
          content="Tired of editing YouTube videos, Shorts, Reels, or TikToks? TuesdayTrim offers fast, pro video editing trusted by creators in the US, UK & Europe. Skip the editing stress — book now!"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ JSON-LD Schema for logo (used by Google for rich results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TuesdayTrim",
              "url": "https://tuesdaytrim.com",
              "logo": "https://tuesdaytrim.com/favicon-32x32.png",
            }),
          }}
        />
        <Toaster richColors position="top-right" />
        {children}

        {/* ✅ Tawk.to Live Chat Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/687fbf91828524191a31734f/1j0pg8kut';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
        })();
      `,
          }}
        />

      </body>
    </html>
  );
}
