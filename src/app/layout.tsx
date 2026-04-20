import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "СД-Сервис - Авто из Европы с доставкой по РФ",
  description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
  keywords: "авто из европы, автомобили из европы, пригон авто, растаможка авто, СД-Сервис",
  authors: [{ name: "СД-Сервис" }],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "СД-Сервис - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
    url: "https://lts-prigon.ru",
    siteName: "СД-Сервис - Авто из Европы",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "https://lts-prigon.ru/lts_office_preview.jpg",
        width: 1200,
        height: 630,
        alt: "СД-Сервис - Автомобили из Европы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "СД-Сервис - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов.",
    images: ["https://lts-prigon.ru/lts_office_preview.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
