import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О компании Sapfyr - Авто из Европы",
  description: "Sapfyr — команда специалистов с опытом в подборе и импорте автомобилей более 11 лет. Честность, прозрачность и профессионализм.",
  openGraph: {
    title: "О компании Sapfyr - Авто из Европы",
    description: "Sapfyr — команда специалистов с опытом в подборе и импорте автомобилей более 11 лет. Честность, прозрачность и профессионализм.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
