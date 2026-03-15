import Calculator from "@/components/Calculator";
import KakaoAdFit from "@/components/KakaoAdFit";

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
                <p className="intro-desc">
                    <strong>알뜰런</strong>이란 통신사 선택약정으로 단말기를 할인 구매한 뒤, 일정 기간 후 알뜰폰(MVNO)으로 이동하여 총 비용을 절약하는 방법입니다.
                    {' '}<Link href="/guide" className="intro-link">사용가이드 보기 &rarr;</Link>
                </p>
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
