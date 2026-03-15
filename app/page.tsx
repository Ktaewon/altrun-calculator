import Calculator from "@/components/Calculator";
import AdBanner from "@/components/AdBanner";

import Link from "next/link";

export default function Home() {
    return (
        <div className="container pb-12">
            <header className="header text-center py-6">
                <div className="logo flex-center mb-4">
                    <span className="logo-icon">📱</span>
                    <h1>알뜰런 계산기</h1>
                </div>
                <p className="subtitle">
                    5가지 구매 방식을 한눈에 비교해보세요
                </p>
            </header>

            {/* Ad Section */}
            <div className="ad-section text-center">
                {/* Top Banner */}
                <AdBanner
                    dataAdClient="ca-pub-9920611646006709"
                    dataAdSlot="2096389068"
                />
            </div>

            <main className="main-content space-y-8">
                <Calculator />

                {/* Ad Section */}
                <div className="ad-section text-center">
                    {/* Middle Banner */}
                    <AdBanner
                        dataAdClient="ca-pub-9920611646006709"
                        dataAdSlot="4437828987"
                    />
                </div>


            </main>

            <footer className="footer mt-16 pt-8 border-t text-center text-gray-500 text-sm">
                <div className="mb-6">
                    <p>※ 본 계산기는 참고용이며, 실제 요금은 통신사 정책에 따라 달라질 수 있습니다.</p>
                    <p>※ 공시지원금 반환 조건, 선택약정 조건 등은 가입 전 반드시 확인하세요.</p>
                    <p>※ 선택약정 반환금 = 월 할인금액 × 남은 개월 수</p>
                </div>
                <div className="footer-links">
                    <Link href="/privacy" className="nav-link">개인정보처리방침</Link>
                </div>
            </footer>
        </div>
    );
}
