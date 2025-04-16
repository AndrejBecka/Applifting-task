import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/hooks/auth-hook";
import Header from "~/components/navigation/header";
export const metadata: Metadata = {
  title: "Applifting Blog App",
  description: "Applifting Blog App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
