// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // ✅ Using sonner now

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuesdayTrim – Clean, Pro Editing for YouTubers & Creators",
  description: "Affordable, professional video editing services for YouTubers, Shorts, and Reels.",
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "TuesdayTrim",
  appleWebApp: {
    title: "TuesdayTrim",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster richColors position="top-right" /> {/* ✅ Sonner toaster */}
        {children}
      </body>
    </html>
  );
}
