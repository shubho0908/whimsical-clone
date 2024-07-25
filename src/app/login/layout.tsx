import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import Image from "next/image";

const kanit = Kanit({
    weight: "400",
    subsets: ["latin"],
  });

export const metadata: Metadata = {
  title: "Whimsical - Login",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={kanit.className}>
      <body className="font-sans">
        <div className="bg-img absolute z-[-1] w-screen h-screen">
          <Image src="/login.jpg" alt="bg" fill className="object-cover" />
        </div>
        <div className="navbar flex items-center justify-center">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
