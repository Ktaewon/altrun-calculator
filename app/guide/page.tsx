import type { Metadata } from "next";
import InfoSection, { faqItems } from "@/components/InfoSection";

export const metadata: Metadata = {
    title: "휴대폰 구매 방식 가이드",
    description:
        "공시지원금, 선택약정, 자급제, 알뜰런 차이와 휴대폰 유지비 계산 기준을 정리한 안내 페이지입니다.",
    alternates: {
        canonical: "/guide",
    },
    openGraph: {
        title: "휴대폰 구매 방식 가이드",
        description:
            "휴대폰 요금 계산기와 유지비 비교에 필요한 공시지원금, 선택약정, 자급제, 알뜰런 개념을 정리했습니다.",
        url: "/guide",
    },
};

export default function GuidePage() {
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <div className="container pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <InfoSection />
        </div>
    );
}
