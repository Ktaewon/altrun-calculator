"use client";

function getCoupangDisclosure() {
    return process.env.NEXT_PUBLIC_COUPANG_PARTNERS_DISCLOSURE ||
        "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
}

export default function CoupangDynamicBanner() {
    const bannerHtml = `
        <!doctype html>
        <html lang="ko">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style>
                    html, body { margin: 0; padding: 0; background: transparent; overflow: hidden; }
                    body { display: flex; justify-content: center; align-items: center; min-height: 100px; }
                </style>
            </head>
            <body>
                <script src="https://ads-partners.coupang.com/g.js"></script>
                <script>
                    var isMobile = window.matchMedia("(max-width: 640px)").matches;
                    new PartnersCoupang.G({
                        "id": isMobile ? 989770 : 989765,
                        "template": "carousel",
                        "trackingCode": "AF2405874",
                        "width": isMobile ? "360" : "720",
                        "height": "100",
                        "tsource": ""
                    });
                </script>
            </body>
        </html>
    `;

    return (
        <aside className="coupang-dynamic-banner">
            <iframe
                className="coupang-dynamic-banner-frame"
                title="쿠팡 파트너스 다이내믹 배너"
                srcDoc={bannerHtml}
                width="100%"
                height="100"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
                loading="lazy"
            />
            <p className="affiliate-disclosure">{getCoupangDisclosure()}</p>
        </aside>
    );
}
