import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/context/MotionContext";
import { AtelierProvider } from "@/context/AtelierContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { SelectionDrawer } from "@/components/SelectionDrawer";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cristian Mancuso — Sastrería de Autor · Camisas a Medida Buenos Aires",
  description:
    "Tu camisa a medida, sin costo extra. Elegí tela, cuello y medidas. Envío a todo el país y exterior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${syne.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-obsidian text-primary font-sans antialiased">
        <MotionProvider>
          <AtelierProvider>
            <SmoothScrollProvider>
              <Preloader />
              <Navbar />
              <main>{children}</main>
              <SelectionDrawer />
            </SmoothScrollProvider>
          </AtelierProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
