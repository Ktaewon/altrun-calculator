import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date("2026-04-11");

    return [
        {
            url: siteUrl,
            lastModified,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${siteUrl}/guide`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${siteUrl}/privacy`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.4,
        },
    ];
}
