"use client";

import { useEffect, useState } from "react";

let sdkLoaded = false;

interface AdUnit {
    unit: string;
    width: number;
    height: number;
}

interface KakaoAdFitProps {
    pc: AdUnit;
    mobile: AdUnit;
    className?: string;
}

export default function KakaoAdFit({ pc, mobile, className }: KakaoAdFitProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 768px)");
        setIsMobile(mql.matches);
        setMounted(true);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (!sdkLoaded) {
            sdkLoaded = true;
            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    if (!mounted) return null;

    const ad = isMobile ? mobile : pc;

    return (
        <ins
            key={ad.unit}
            className={`kakao_ad_area${className ? ` ${className}` : ""}`}
            style={{ display: "none" }}
            data-ad-unit={ad.unit}
            data-ad-width={String(ad.width)}
            data-ad-height={String(ad.height)}
        />
    );
}
