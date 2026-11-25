import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { MotionProvider } from "@/context/MotionContext";
import { AtelierProvider } from "@/context/AtelierContext";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { AmbientStudioBackdrop } from "@/components/AmbientStudioBackdrop";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { SelectionDrawer } from "@/components/SelectionDrawer";
import { SelectionToast } from "@/components/SelectionToast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#F7F6F3] text-[#111113] font-sans antialiased transition-colors duration-300 dark:bg-[#0B0B0E] dark:text-[#F8FAFC]">
        <ThemeProvider>
          <MotionProvider>
            <AtelierProvider>
              <SmoothScrollProvider>
                <AmbientStudioBackdrop />
                <Preloader />
                <Navbar />
                <main className="relative z-10">{children}</main>
                <SelectionDrawer />
                <SelectionToast />
              </SmoothScrollProvider>
            </AtelierProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
