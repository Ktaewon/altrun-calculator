import type { Metadata } from "next";
import CoupangEventBanner from "@/components/CoupangEventBanner";
import GuidedCalculator from "@/components/GuidedCalculator";
import { siteKeywords } from "@/lib/site";

export const metadata: Metadata = {
    title: "가이드 계산기",
    description: "휴대폰 구매비와 요금제 조건을 단계별로 입력해 공시지원금, 선택약정, 자급제, 알뜰런 총비용을 비교합니다.",
    keywords: [...siteKeywords, "가이드 계산기", "단계별 휴대폰 비용 계산", "자급제 가격 비교"],
    alternates: {
        canonical: "/guided",
    },
    openGraph: {
        title: "가이드 계산기 | 휴대폰 비용 계산기",
        description: "기기 가격부터 요금제 조건까지 순서대로 입력하고 구매 방식별 총비용을 비교합니다.",
        url: "/guided",
    },
};

export default function GuidedPage() {
    return (
        <div className="container pb-12">
            <header className="header guided-header">
                <p className="eyebrow">단계별 휴대폰 비용 계산</p>
                <h1 className="hero-title">기기 가격부터 요금제 조건까지 순서대로 비교하세요</h1>
                <p className="subtitle">
                    기존 계산기가 복잡하게 느껴질 때, 필요한 값을 한 단계씩 입력하고 마지막에 구매 방식별 총비용을 확인할 수 있습니다.
                </p>
            </header>
            <CoupangEventBanner />
            <GuidedCalculator />
        </div>
    );
}
