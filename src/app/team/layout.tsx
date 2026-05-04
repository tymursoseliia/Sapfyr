import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наша команда - Sapfyr",
  description: "Команда профессионалов Sapfyr. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 9 лет.",
  openGraph: {
    title: "Наша команда - Sapfyr",
    description: "Команда профессионалов Sapfyr. 13 специалистов по подбору и доставке автомобилей из Европы. Опыт работы более 9 лет.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
