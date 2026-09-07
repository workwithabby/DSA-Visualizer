import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SoundProvider } from "@/components/SoundProvider";
import { ProgressProvider } from "@/components/ProgressProvider";
import { Navbar } from "@/components/Navbar";
import { dataStructures } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DSA Visualizer by Abigail",
  description:
    "An interactive learning tool for Data Structures & Algorithms. Read the concept, watch it happen, and interact with it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("dsa-theme");document.documentElement.classList.toggle("dark",t==="dark");}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SoundProvider>
            <ProgressProvider>
              <Navbar />
              <main className="flex-1 pt-16">{children}</main>
              <footer className="border-t border-rule py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-sm text-muted">
                    <span className="font-display font-bold text-ink">DSA Visualizer</span>
                    <span className="text-faint"> — interactive learning tool for data structures &amp; algorithms</span>
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
                    {dataStructures.length} structures · step-by-step playback
                  </p>
                </div>
              </footer>
            </ProgressProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}