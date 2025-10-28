import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LiveBlocksProvider from "./provider";
import { LoadingProvider } from "@/utils/LoadingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Document Editor",
<<<<<<< HEAD
=======
  description: "Edit everything",
>>>>>>> 29efb48dd8ab9fc55f280789e05ce9019cc750f8
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark bg-gray-11 min-h-dvh  antialiased`}
      >
    <LiveBlocksProvider   >
        <LoadingProvider>

        {children}
        </LoadingProvider>
    </LiveBlocksProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
