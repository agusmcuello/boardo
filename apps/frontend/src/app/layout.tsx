import type { Metadata } from "next";
import { Maven_Pro, Quando, Ubuntu } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const maven = Maven_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-maven",
});

const quando = Quando({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-quando",
});

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

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
      <body
        className={`${maven.variable} ${quando.variable} ${ubuntu.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
