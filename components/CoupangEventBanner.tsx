"use client";

function getCoupangDisclosure() {
    return process.env.NEXT_PUBLIC_COUPANG_PARTNERS_DISCLOSURE ||
        "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
}

export default function CoupangEventBanner() {
    return (
        <aside className="coupang-event-slot">
            <a
                className="coupang-event-banner"
                href="https://link.coupang.com/a/dO0dhjGqrY"
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                referrerPolicy="unsafe-url"
            >
                <img
                    src="https://ads-partners.coupang.com/banners/989766?subId=&traceId=V0-301-5f9bd61900e673c0-I989766&w=728&h=90"
                    alt="쿠팡 이벤트 배너"
                    loading="lazy"
                />
            </a>
            <p className="affiliate-disclosure">{getCoupangDisclosure()}</p>
        </aside>
    );
}
