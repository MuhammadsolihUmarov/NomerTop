import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NomerTop | Global Vehicle Identity Network",
  description: "Secure, anonymous communication for vehicle owners worldwide.",
};

import { LanguageProvider } from "@/components/LanguageProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="midnight-theme">
        <div className="mesh-bg"></div>
        <LanguageProvider>
          <Navbar />
          <div className="layout-root">
            {children}
          </div>
          <Toaster position="bottom-right" richColors theme="dark" />
        </LanguageProvider>
      </body>
    </html>
  );
}
