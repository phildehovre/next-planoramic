import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";
import Lenis from "@studio-freight/lenis";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planoramic",
  description: "Manage your campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className, "overflow-x-hidden")}>
          <main className="flex flex-col justify-between w-screen h-auto">
            <Header />
            {children}
            <Footer />
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
