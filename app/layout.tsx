import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "알뜰런 유지비 계산기 - 호갱 탈출 필수품",
    description: "공시지원금 vs 선택약정 vs 자급제+알뜰폰. 내 상황에 딱 맞는 최저가 구매 방식을 3초 만에 계산해보세요.",
    keywords: "알뜰폰, 자급제, 공시지원금, 선택약정, 알뜰런, 휴대폰 계산기, 스마트폰 요금 계산",
    openGraph: {
        title: "알뜰런 유지비 계산기",
        description: "호갱 탈출을 위한 필수 도구! 최저가 구매 방식을 계산해보세요.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <meta name="google-adsense-account" content="ca-pub-9920611646006709" />
            </head>
            <body className={notoSansKr.className}>
                <div className="background-pattern" />
                <Navbar />
                <main className="pt-20">
                    {children}
                </main>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9920611646006709"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
