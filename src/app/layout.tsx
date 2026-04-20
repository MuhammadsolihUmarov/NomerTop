import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NomerTop | Global Vehicle Identity Network",
  description: "Secure, anonymous communication for vehicle owners worldwide.",
};

import { LanguageProvider } from "@/components/LanguageProvider";
import { AuthModalProvider } from "@/components/AuthModal";
import { NextAuthProvider } from "@/components/NextAuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="midnight-theme">
        <div className="mesh-bg"></div>
        <NextAuthProvider>
          <LanguageProvider>
            <AuthModalProvider>
              <Navbar />
              <div className="layout-root">
                {children}
              </div>
              <Footer />
              <Toaster position="bottom-right" richColors theme="dark" />
            </AuthModalProvider>
          </LanguageProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
