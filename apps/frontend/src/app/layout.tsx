import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boardo - Task Manager",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
