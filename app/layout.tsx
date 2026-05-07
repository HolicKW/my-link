import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/query-provider";

const SITE_URL = "https://my-link-virid.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "마이링크 - 단 하나의 프로필 링크로 나를 브랜딩하세요",
    template: "%s | 마이링크",
  },
  description:
    "개발자와 크리에이터를 위한 올인원 프로필 링크 서비스. 포트폴리오, 소셜 미디어, 프로젝트를 하나의 페이지에 담아 공유하세요.",
  keywords: ["프로필 링크", "링크트리", "포트폴리오", "소셜 링크", "마이링크", "my link"],
  authors: [{ name: "My Link" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "마이링크",
    title: "마이링크 - 단 하나의 프로필 링크로 나를 브랜딩하세요",
    description:
      "개발자와 크리에이터를 위한 올인원 프로필 링크 서비스. 구글 계정으로 1초 만에 시작하세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "마이링크 - 단 하나의 프로필 링크로 나를 브랜딩하세요",
    description:
      "개발자와 크리에이터를 위한 올인원 프로필 링크 서비스. 구글 계정으로 1초 만에 시작하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      translate="no"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  )
}
