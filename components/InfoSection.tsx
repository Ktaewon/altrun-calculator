export default function InfoSection() {
    return (
        <section className="info-section" id="guide">
            <div className="info-container">
                <h2 className="info-title">💡 알뜰런 계산기 사용 가이드</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <h3>1. 단말기 및 요금제 정보 입력</h3>
                        <p>구매하려는 스마트폰의 출고가와 통신사의 요금제 정보를 입력하세요. 성지(판매점)에서 제공하는 추가지원금(불법보조금)이 있다면 &apos;판매점 지원금&apos; 항목에 입력하여 더 정확한 계산이 가능합니다.</p>
                    </div>
                    <div className="info-card">
                        <h3>2. 5가지 구매 방식 비교</h3>
                        <p>공시지원금, 선택약정, 그리고 &apos;알뜰런(선택약정 후 알뜰폰 이동)&apos; 등 5가지 시나리오의 총 비용을 자동으로 계산하여 최저가를 추천해드립니다.</p>
                    </div>
                    <div className="info-card">
                        <h3>3. 알뜰런 타이밍 분석</h3>
                        <p>선택약정으로 개통 후 언제 알뜰폰으로 이동하는 것이 위약금을 포함하더라도 가장 저렴한지 최적의 타이밍을 그래프로 보여드립니다.</p>
                    </div>
                </div>
            </div>

            <div className="info-container">
                <h2 className="info-title">📚 필수 용어 설명</h2>
                <dl className="term-list">
                    <div className="term-item">
                        <dt>공시지원금</dt>
                        <dd>통신사와 약정을 맺는 대신 단말기 가격을 할인받는 제도입니다. 요금제가 비쌀수록 할인폭이 커지지만, 중도 해지 시 위약금이 큽니다.</dd>
                    </div>
                    <div className="term-item">
                        <dt>선택약정</dt>
                        <dd>단말기 할인을 받지 않는 대신, 매월 요금의 25%를 할인받는 제도입니다. 자급제 폰이나 중고폰도 가입 가능합니다.</dd>
                    </div>
                    <div className="term-item">
                        <dt>알뜰런(알뜰폰 환승)</dt>
                        <dd>통신사 보조금을 받고 개통한 뒤, 의무 유지 기간(보통 6개월)만 채우고 위약금을 내더라도 저렴한 알뜰폰 요금제로 갈아타는 전략입니다.</dd>
                    </div>
                    <div className="term-item">
                        <dt>자급제</dt>
                        <dd>통신사를 거치지 않고 제조사나 오픈마켓(쿠팡 등)에서 기기만 구매하는 방식입니다. 약정이 없어 자유롭게 알뜰폰 요금제를 쓸 수 있습니다.</dd>
                    </div>
                </dl>
            </div>

            <div className="info-container">
                <h2 className="info-title">❓ 자주 묻는 질문 (FAQ)</h2>
                <div className="faq-list">
                    <div className="faq-item">
                        <div className="faq-q">Q. 알뜰런(통신사 이동) 시 위약금은 얼마나 나오나요?</div>
                        <div className="faq-a">선택약정의 경우, 할인받은 금액을 반환해야 합니다. 개통 후 6개월 정도 지나면 위약금이 발생하지만, 알뜰폰 요금제의 절약액이 더 크기 때문에 이득인 경우가 많습니다. 본 계산기에서 정확한 위약금과 총 비용을 비교해볼 수 있습니다.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-q">Q. 공시지원금 받고 알뜰폰으로 가도 되나요?</div>
                        <div className="faq-a">공시지원금은 단말기 값을 할인받는 것이라 초기 위약금이 매우 큽니다. 보통 24개월 약정을 다 채우지 않으면 손해가 큽니다. 알뜰폰으로 이동하려면 &apos;선택약정&apos;이나 &apos;자급제&apos;가 유리합니다.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-q">Q. 판매점 지원금(성지 보조금)은 뭔가요?</div>
                        <div className="faq-a">대리점이나 판매점에서 자체적으로 마진을 줄여 고객에게 제공하는 추가 할인입니다. 단통법 상 공시지원금의 15%를 초과하면 불법이지만, 암암리에 많이 이루어지고 있어 현실적인 계산을 위해 항목을 포함했습니다.</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
