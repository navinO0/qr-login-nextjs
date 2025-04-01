import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; 
import { SidebarProvider } from "@/components/ui/sidebar";
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
  description: "Add devices using QR code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col w-screen">
          <Providers>
              <SidebarProvider
                style={{
                  "--sidebar-width": "10rem",
                  "--sidebar-width-mobile": "5rem",
                }}
              >
                <AppSidebar variant="insert" />
                <div className="flex flex-col w-full h-full">
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
