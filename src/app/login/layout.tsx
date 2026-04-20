import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход в систему - СД-Сервис",
  description: "Вход в панель управления СД-Сервис",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
