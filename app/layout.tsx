import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./markdown.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TouristAssist - All-in-one AI assistant for tourism in Northern Territory",
  description: "All-in-one AI assistant for tourism in Northern Territory",
  openGraph: {
    title: "TouristAssist - All-in-one AI assistant for tourism in Northern Territory",
    description: "All-in-one AI assistant for tourism in Northern Territory",
    images: ["/background.png"],
  },
  twitter: {
    title: "TouristAssist - All-in-one AI assistant for tourism in Northern Territory",
    description: "All-in-one AI assistant for tourism in Northern Territory",
    images: "/background.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
