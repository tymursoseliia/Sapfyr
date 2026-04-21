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
  title: "Sapfyr - Авто из Европы с доставкой по РФ",
  description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
  keywords: "авто из европы, автомобили из европы, пригон авто, растаможка авто, Sapfyr",
  authors: [{ name: "Sapfyr" }],
  icons: {
    icon: "/logonew.png",
    shortcut: "/logonew.png",
    apple: "/logonew.png",
  },
  openGraph: {
    title: "Sapfyr - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов. Экономия до 30%.",
    url: "https://lts-prigon.ru",
    siteName: "Sapfyr - Авто из Европы",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "https://sapfyr.netlify.app/Gemini_Generated_Image_gs1vi0gs1vi0gs1v.jpeg",
        width: 1200,
        height: 630,
        alt: "Sapfyr - Автомобили из Европы",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapfyr - Авто из Европы с доставкой по РФ",
    description: "Автомобили из Европы под ключ. Подбор, доставка, растаможка. Более 11 лет на рынке, 1000+ довольных клиентов.",
    images: ["https://sapfyr.netlify.app/Gemini_Generated_Image_gs1vi0gs1vi0gs1v.jpeg"],
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
