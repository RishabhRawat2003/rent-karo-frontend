import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import Header from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Rent Karo",
  description: "Rent Karo - Rent, Buy and List your own Products and items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${roboto.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
