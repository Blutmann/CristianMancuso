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
  metadataBase: new URL("https://cristianmancuso.pages.dev"),
  title: "Cristian Mancuso — Sastrería de Autor · Camisas a Medida Buenos Aires",
  description:
    "Tu camisa a medida, sin costo extra. Elegí tela, cuello y medidas. Envío a todo el país y exterior.",
  openGraph: {
    title: "Cristian Mancuso — Camisas a Medida sin Costo Extra",
    description:
      "Telas italianas y peruanas. Configurá tu camisa en 3D o elegí talle comercial. Envíos a toda Argentina y exterior.",
    url: "/",
    siteName: "Cristian Mancuso Atelier",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/og-atelier.jpg",
        width: 1200,
        height: 630,
        alt: "Cristian Mancuso Atelier — Camisas a medida sin costo extra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian Mancuso — Camisas a Medida sin Costo Extra",
    description:
      "Algodón Pima 120/2 y Lino Italiano. Configurá tu camisa a medida en 3D.",
    images: ["/images/og-atelier.jpg"],
  },
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
      <body className="min-h-screen bg-transparent text-[#111113] font-sans antialiased transition-colors duration-300 dark:text-[#F8FAFC]">
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
