import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Sidebar } from "./sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ZDesigner AI",
  description: "Various types of redesigns for your interior within a minute.",
  robots: "index, follow",
  openGraph: {
    title: "ZDesigner AI",
    description:
      "Various types of redesigns for your interior within a minute.",
    url: "https://back-1lj7im7yk-azizbekdevuzs-projects.vercel.app/",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://back-1lj7im7yk-azizbekdevuzs-projects.vercel.app/app-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Screenshot of the ZDesigner AI app",
      },
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
