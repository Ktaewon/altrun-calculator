import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="container pb-12">
            <header className="header text-center py-12">
                <div className="logo flex-center mb-4">
                    <span className="logo-icon">📱</span>
                    <h1>알뜰런 계산기</h1>
                </div>
            </header>

            <main className="main-content mx-auto max-w-4xl">
                <div className="bg-privacy-card shadow-lg text-gray-300">
                    <h1 className="text-3xl font-bold text-white mb-6">개인정보처리방침</h1>
                    <p className="mb-6">최종 수정일: 2026년 3월 16일</p>

                    <p className="mb-6 leading-relaxed">
                        &apos;알뜰런 유지비 계산기&apos;(이하 &apos;사이트&apos;)는 이용자의 개인정보를 중요시하며, &quot;정보통신망 이용촉진 및 정보보호&quot;에 관한 법률을 준수하고 있습니다.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. 수집하는 개인정보 항목</h2>
                    <p className="mb-4 leading-relaxed">
                        본 사이트는 별도의 회원가입 없이 이용 가능하며, 계산기 이용 과정에서 입력되는 단말기 가격, 요금제 정보 등의 데이터는 서버에 저장되지 않고 사용자의 브라우저 내에서만 처리됩니다.
                    </p>
                    <p className="mb-2 leading-relaxed">
                        다만, 서비스 이용 과정에서 다음과 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>이용자의 브라우저 종류 및 OS</li>
                        <li>방문 기록 (IP 주소, 접속 시간)</li>
                        <li>쿠키 (Cookie)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
                    <p className="mb-2 leading-relaxed">수집된 정보는 다음의 목적을 위해 활용됩니다.</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>서비스 제공 및 기능 개선</li>
                        <li>접속 빈도 파악 및 서비스 이용 통계</li>
                        <li>광고 게재 (카카오 애드핏)</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. 쿠키(Cookie)의 운용 및 거부</h2>
                    <p className="mb-4 leading-relaxed">
                        본 사이트는 이용자에게 맞춤형 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(Cookie)&apos;를 사용합니다.
                    </p>

                    <h3 className="text-xl font-semibold text-white mt-8 mb-4">카카오 애드핏 광고</h3>
                    <p className="mb-4 leading-relaxed">
                        본 사이트는 카카오 애드핏(Kakao AdFit)을 통해 광고를 게재합니다. 카카오는 쿠키를 사용하여 이용자의 관심사에 기반한 광고를 제공할 수 있습니다.
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>
                            카카오 애드핏은 광고 제공을 위해 쿠키 및 기기 식별 정보를 수집할 수 있습니다.
                        </li>
                        <li>
                            사용자는 브라우저 설정에서 쿠키를 차단하거나 삭제하여 광고 추적을 거부할 수 있습니다.
                        </li>
                        <li>
                            카카오의 개인정보처리방침은 <a href="https://www.kakao.com/policy/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">카카오 개인정보처리방침</a>에서 확인할 수 있습니다.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. 개인정보의 제3자 제공</h2>
                    <p className="mb-4 leading-relaxed">
                        본 사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. 문의사항</h2>
                    <p className="mb-2 leading-relaxed">개인정보 관련 문의사항은 하단의 연락처로 문의해주시기 바랍니다.</p>
                    <p className="mb-4 text-gray-400">이메일: privacy@altrun.com</p>
                </div>
            </main>

            <footer className="footer mt-16 pt-8 border-t text-center text-gray-500 text-sm">
                <p className="mb-2">&copy; 2026 알뜰런 유지비 계산기. All rights reserved.</p>
                <Link href="/" className="nav-link">홈으로 돌아가기</Link>
            </footer>
        </div>
    );
}
