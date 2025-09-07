import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WorkoutProvider } from "@/contexts/WorkoutContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XTracker - P90X Workout Tracker",
  description: "Track your P90X workouts and achieve your fitness goals with our comprehensive workout logging system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WorkoutProvider>
          {children}
        </WorkoutProvider>
      </body>
    </html>
  );
}
