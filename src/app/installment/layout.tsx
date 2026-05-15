import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Авто в рассрочку - Sapfyr",
  description: "Выгодные условия рассрочки на автомобили из Европы. Первоначальный взнос от 10%, оформление по двум документам без справок о доходах. Одобрение за 1 час.",
  openGraph: {
    title: "Авто в рассрочку - Sapfyr",
    description: "Выгодные условия рассрочки на автомобили из Европы. Первоначальный взнос от 10%, оформление по двум документам.",
  },
};

export default function InstallmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
