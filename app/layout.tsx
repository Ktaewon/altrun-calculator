import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_KR } from "next/font/google";
import Link from "next/link";
import { siteDescription, siteKeywords, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";
import Navbar from "@/components/Navbar";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: siteKeywords,
    applicationName: siteName,
    icons: {
        icon: "/phone-cost-mark.svg",
        shortcut: "/phone-cost-mark.svg",
        apple: "/phone-cost-mark.svg",
    },
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        type: "website",
        url: siteUrl,
        siteName,
        locale: "ko_KR",
    },
    twitter: {
        card: "summary",
        title: siteTitle,
        description: siteDescription,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const themeScript = `
        (() => {
            try {
                const stored = localStorage.getItem('theme-preference');
                const theme = stored === 'light' || stored === 'dark'
                    ? stored
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
            } catch (error) {
                document.documentElement.dataset.theme = 'dark';
                document.documentElement.style.colorScheme = 'dark';
            }
        })();
    `;

    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`${notoSansKr.className} ${jetbrainsMono.variable}`}>
                <div className="background-pattern" />
                <Navbar />
                <main className="pt-20">
                    {children}
                </main>
                <footer className="site-footer">
                    <p>&copy; 2026 {siteName}. All rights reserved.</p>
                    <div className="site-footer-links">
                        <Link href="/privacy">개인정보처리방침</Link>
                        <Link href="/guide">구매 방식 가이드</Link>
                    </div>
                </footer>
            </body>
        </html>
    );
}
