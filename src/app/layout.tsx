import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/app/_providers/trpc-provider";
import { Toaster } from "@/components/ui/sonner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SubZero - Freeze Unnecessary Spending",
  description: "Track, manage, and optimize your subscriptions with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className="font-sans antialiased dark">
        <TRPCProvider>
          {children}
        </TRPCProvider>
        <Toaster />
      </body>
    </html>
  );
}
