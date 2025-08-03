import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Metadata } from "next";
import { Jost, La_Belle_Aurore, Marcellus } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: ["400"],
});
const la_belle_aurore = La_Belle_Aurore({
  variable: "--font-la_belle_aurore",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Blommehuset – Sommerhus, udejning, marielyst",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${jost.variable} ${marcellus.variable} ${la_belle_aurore.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
