import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template:`%s|${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/scissors-svgrepo-com.svg',
      href:'/scissors-svgrepo-com.svg'
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
