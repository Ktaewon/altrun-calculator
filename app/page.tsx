import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import KakaoAdFit from "@/components/KakaoAdFit";
import { siteDescription, siteKeywords, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "휴대폰 비용 계산기",
    description:
        "휴대폰 요금 계산기와 유지비 계산기로 공시지원금, 선택약정, 자급제, 알뜰런 시나리오별 총 비용과 월 평균을 비교합니다.",
    keywords: [...siteKeywords, "휴대폰 비용 계산기", "휴대폰 총비용 비교"],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "휴대폰 비용 계산기 | 요금제 · 구매비 · 알뜰런 비교",
        description:
            "공시지원금, 선택약정, 자급제, 알뜰런 시나리오를 한 화면에서 비교하는 휴대폰 유지비 계산기입니다.",
        url: "/",
    },
    twitter: {
        title: "휴대폰 비용 계산기",
        description:
            "휴대폰 요금 계산기이자 유지비 계산기로 여러 구매 방식의 총 비용을 비교합니다.",
    },
};

export default function Home() {
    const webApplicationJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: siteName,
        url: siteUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        inLanguage: "ko-KR",
        description: siteDescription,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "KRW",
        },
        featureList: [
            "휴대폰 요금 계산",
            "휴대폰 유지비 계산",
            "공시지원금 비교",
            "선택약정 비교",
            "자급제 비교",
            "알뜰런 시나리오 비교",
        ],
    };

    return (
        <div className="container pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
            />
            <header className="header text-center py-6">
                <img src="/phone-cost-mark.svg" alt="" className="hero-mark" aria-hidden="true" />
                <p className="eyebrow">휴대폰 요금 계산기 · 유지비 계산기</p>
                <h1 className="hero-title">휴대폰 구매비와 요금제를 같은 기준으로 비교해보세요</h1>
                <p className="subtitle">
                    공시지원금, 선택약정, 자급제, 알뜰런까지 여러 시나리오의 총 비용과 월 평균을 한 번에 계산합니다.
                </p>
                <p className="intro-desc">
                    휴대폰 요금 계산기이자 유지비 계산기로 구매 방식별 차이를 바로 볼 수 있고,
                    {" "}알뜰런 계산기는 그중 하나의 전략으로 함께 비교할 수 있습니다.
                    {" "}<Link href="/guide" className="intro-link">계산 기준과 용어 보기</Link>
                </p>
                <div className="hero-pills" aria-label="핵심 기능">
                    <span className="hero-pill">공시지원금 비교</span>
                    <span className="hero-pill">선택약정 계산</span>
                    <span className="hero-pill">자급제 비교</span>
                    <span className="hero-pill">알뜰런 시나리오</span>
                </div>
                <a href="#calculator" className="hero-cta">비용 비교 시작하기</a>
            </header>

            {/* Ad Section */}
            <div className="ad-section text-center">
                {/* Top Banner */}
                <KakaoAdFit
                    pc={{ unit: process.env.NEXT_PUBLIC_KAKAO_ADFIT_PC_UNIT!, width: 728, height: 90 }}
                    mobile={{ unit: process.env.NEXT_PUBLIC_KAKAO_ADFIT_MOBILE_UNIT!, width: 320, height: 100 }}
                />
            </div>

            <main className="main-content space-y-8">
                <Calculator />

                {/* Ad Section */}
                <div className="ad-section text-center">
                    {/* Middle Banner */}
                    <KakaoAdFit
                    pc={{ unit: process.env.NEXT_PUBLIC_KAKAO_ADFIT_PC_UNIT!, width: 728, height: 90 }}
                    mobile={{ unit: process.env.NEXT_PUBLIC_KAKAO_ADFIT_MOBILE_UNIT!, width: 320, height: 100 }}
                />
                </div>


            </main>

            <aside className="calculator-disclaimer">
                <p>※ 본 휴대폰 비용 계산기 결과는 참고용이며, 실제 요금과 지원금은 통신사 정책에 따라 달라질 수 있습니다.</p>
                <p>※ 공시지원금 반환 조건, 선택약정 조건 등은 가입 전 반드시 확인하세요.</p>
                <p>※ 선택약정 반환금 = 월 할인금액 × 남은 개월 수</p>
            </aside>
        </div>
    );
}
