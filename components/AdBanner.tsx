"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
    dataAdClient: string;
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: boolean | string;
    className?: string;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        adsbygoogle: any[];
    }
}

export default function AdBanner({
    dataAdClient,
    dataAdSlot,
    dataAdFormat = "auto",
    dataFullWidthResponsive = "true",
    className = "adsbygoogle"
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // Check if the ad has already been loaded in this slot
            if (adRef.current && adRef.current.innerHTML === "") {
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
            }
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    return (
        <ins
            ref={adRef}
            className={className}
            style={{ display: "block" }}
            data-ad-client={dataAdClient}
            data-ad-slot={dataAdSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive={dataFullWidthResponsive?.toString()}
        />
    );
}
