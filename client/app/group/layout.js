import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "../clock1/components/Navbar";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <ClerkLoaded>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar />
        <main>{children}</main>
        <Toaster />
      </div>
    </ClerkLoaded>
  );
}
