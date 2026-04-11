export const guideCards = [
    {
        title: "1. 단말기 가격과 요금제 입력",
        description:
            "휴대폰 출고가, 자급제 가격, 월 요금제, 유심 비용을 넣으면 휴대폰 요금 계산기와 유지비 계산기처럼 전체 비용을 바로 비교할 수 있습니다.",
    },
    {
        title: "2. 구매 방식별 총비용 비교",
        description:
            "공시지원금, 선택약정, 자급제, 알뜰런 시나리오를 같은 조건에서 계산해 어떤 방식이 총비용 기준으로 유리한지 확인합니다.",
    },
    {
        title: "3. 알뜰런 이동 시점 확인",
        description:
            "선택약정 이후 알뜰폰으로 이동하는 시점을 바꿔보며 위약금과 월 요금까지 포함한 휴대폰 유지비 변화를 살펴볼 수 있습니다.",
    },
];

export const termItems = [
    {
        term: "휴대폰 유지비",
        description:
            "단말기 가격뿐 아니라 월 요금, 부가서비스, 유심 비용, 위약금까지 합산해 실제로 지출하는 총비용을 뜻합니다.",
    },
    {
        term: "공시지원금",
        description:
            "통신사와 약정을 맺는 대신 단말기 가격을 할인받는 제도입니다. 요금제가 비쌀수록 지원금이 커질 수 있지만 중도 해지 시 부담이 큽니다.",
    },
    {
        term: "선택약정",
        description:
            "단말기 할인을 받지 않는 대신 매월 요금의 일정 비율을 할인받는 제도입니다. 자급제와 함께 비교할 때 자주 쓰이는 기준입니다.",
    },
    {
        term: "자급제",
        description:
            "통신사를 통하지 않고 기기만 별도로 구매하는 방식입니다. 요금제 선택 자유도가 높아 휴대폰 요금 계산 시 자주 비교됩니다.",
    },
    {
        term: "알뜰런",
        description:
            "통신사 보조금이나 선택약정 혜택을 활용해 개통한 뒤, 일정 기간 후 알뜰폰 요금제로 이동해 전체 유지비를 낮추는 전략입니다.",
    },
    {
        term: "판매점 지원금",
        description:
            "대리점이나 판매점이 자체적으로 제공하는 추가 할인입니다. 실제 구매비에 영향을 줘 휴대폰 구매비 비교에서 중요합니다.",
    },
];

export const faqItems = [
    {
        question: "휴대폰 요금 계산기는 어떤 비용까지 포함하나요?",
        answer:
            "기기값, 월 요금제, 유심 비용, 부가서비스, 반환금이나 위약금까지 포함해 휴대폰 총비용과 월 평균을 비교할 수 있도록 구성했습니다.",
    },
    {
        question: "자급제와 선택약정 중 어느 쪽이 더 유리한가요?",
        answer:
            "기기 할인 폭, 요금제 수준, 유지 기간에 따라 달라집니다. 이 계산기에서는 자급제와 선택약정을 같은 기간 기준으로 비교해 총비용 차이를 확인할 수 있습니다.",
    },
    {
        question: "알뜰런 계산기는 일반 휴대폰 유지비 계산에도 쓸 수 있나요?",
        answer:
            "가능합니다. 알뜰런은 여러 비교 시나리오 중 하나이며, 공시지원금·선택약정·자급제 같은 일반적인 휴대폰 구매 방식도 함께 계산할 수 있습니다.",
    },
    {
        question: "공시지원금 받고 알뜰폰으로 가도 되나요?",
        answer:
            "가능하더라도 초기 위약금이 커서 손해일 수 있습니다. 보통은 선택약정이나 자급제가 알뜰폰 이동과 더 잘 맞기 때문에 함께 비교해 보는 것이 안전합니다.",
    },
    {
        question: "판매점 지원금은 왜 입력하나요?",
        answer:
            "실제 현장에서는 판매점 지원금 때문에 체감 구매가가 크게 달라질 수 있습니다. 휴대폰 구매 계산기를 더 현실적으로 쓰려면 이 값도 반영하는 편이 좋습니다.",
    },
];

export default function InfoSection() {
    return (
        <section className="info-section" id="guide">
            <div className="info-container">
                <h2 className="info-title">휴대폰 비용 계산기 사용 가이드</h2>
                <div className="info-grid">
                    {guideCards.map((card) => (
                        <div className="info-card" key={card.title}>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-container">
                <h2 className="info-title">구매 방식과 유지비 용어</h2>
                <dl className="term-list">
                    {termItems.map((item) => (
                        <div className="term-item" key={item.term}>
                            <dt>{item.term}</dt>
                            <dd>{item.description}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="info-container">
                <h2 className="info-title">자주 묻는 질문</h2>
                <div className="faq-list">
                    {faqItems.map((item) => (
                        <div className="faq-item" key={item.question}>
                            <div className="faq-q">Q. {item.question}</div>
                            <div className="faq-a">{item.answer}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
