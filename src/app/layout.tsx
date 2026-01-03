import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ToasterProvider } from '@/components/Toaster';
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Biz360°",
    template: "%s | Biz360°",
  },
  description:
    "An all-in-one business operating system that unifies sales, inventory, finance, and HR—giving growing businesses real-time insights and complete operational visibility.",
  applicationName: "Biz360°",
  keywords: [
    "Business Management",
    "ERP",
    "Business OS",
    "Inventory Management",
    "Sales Tracking",
    "HR Management",
    "SME Software",
  ],
  authors: [{ name: "Biz360" }],
  creator: "Biz360",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProviderWrapper>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <ToasterProvider>

                {children}
                {/* Only one Toaster instance */}
                <Toaster position="bottom-right" />
              </ToasterProvider>
            </StackTheme>
          </StackProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}