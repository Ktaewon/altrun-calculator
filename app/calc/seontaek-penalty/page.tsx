import type { Metadata } from "next";
import SeontaekPenaltyCalculator from "@/components/SeontaekPenaltyCalculator";

export const metadata: Metadata = {
    title: "선택약정 위약금 계산기",
    description: "선택약정 해지 시 예상 반환금을 월 기본료, 할인율, 약정 기간, 사용 개월 기준으로 빠르게 확인합니다.",
    alternates: {
        canonical: "/calc/seontaek-penalty",
    },
    openGraph: {
        title: "선택약정 위약금 계산기",
        description: "선택약정 해지 시 예상 반환금을 간단히 계산합니다. 실제 금액은 통신사 청구서를 확인하세요.",
        url: "/calc/seontaek-penalty",
    },
};

export default function SeontaekPenaltyPage() {
    return (
        <div className="container pb-12">
            <header className="header">
                <p className="eyebrow">선택약정 해지</p>
                <h1 className="hero-title">선택약정 위약금 계산기</h1>
                <p className="subtitle">
                    받은 할인과 약정 기간을 기준으로 예상 반환금을 계산합니다.
                </p>
            </header>
            <SeontaekPenaltyCalculator />
        </div>
    );
}
