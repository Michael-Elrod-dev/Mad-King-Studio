// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LiveStatusProvider } from "@/contexts/LiveStatusContext";
import { DocsProvider } from "@/contexts/DocsContext";
import { TasksProvider } from "@/contexts/TasksContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mad King Studio - Indie Game Development",
  description: "Solo indie game developer. Watch live development on Twitch.",
  keywords: ["indie games", "game development", "twitch"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LiveStatusProvider>
          <DocsProvider>
            <TasksProvider>
              {children}
            </TasksProvider>
          </DocsProvider>
        </LiveStatusProvider>
      </body>
    </html>
  );
}
