
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/core/sidebar";
import Header from "@/core/header";

 


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Add device by QR code",
  description: "add devices using QR code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col w-screen">
        <Providers>
          <SidebarProvider  style={{
    "--sidebar-width": "10rem",
    "--sidebar-width-mobile": "5rem",
  }}>
            <AppSidebar variant="insert" />
              <div className="felx flex-col w-[100%] h-[100%]">
                <Header />
                {children}
              </div>
            </SidebarProvider>
            </Providers>
        </div>
      </body>
    </html>
  );
}

