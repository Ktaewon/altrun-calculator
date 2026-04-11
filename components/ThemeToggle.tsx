"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const storageKey = "theme-preference";

function resolveTheme(preference: ThemePreference): "light" | "dark" {
    if (preference === "light" || preference === "dark") {
        return preference;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
    const resolvedTheme = resolveTheme(preference);
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
}

export default function ThemeToggle() {
    const [preference, setPreference] = useState<ThemePreference>("system");
    const options: Array<{
        value: ThemePreference;
        label: string;
        icon?: string;
    }> = [
        { value: "system", label: "시스템" },
        { value: "light", label: "라이트", icon: "☀" },
        { value: "dark", label: "다크", icon: "☾" },
    ];

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        const nextPreference =
            stored === "light" || stored === "dark" || stored === "system"
                ? stored
                : "system";

        setPreference(nextPreference);
        applyTheme(nextPreference);
    }, []);

    useEffect(() => {
        if (preference === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [preference]);

    const handleChangePreference = (nextPreference: ThemePreference) => {
        setPreference(nextPreference);
        localStorage.setItem(storageKey, nextPreference);
        applyTheme(nextPreference);
    };

    return (
        <div className="theme-toggle" aria-label="테마 선택">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`theme-toggle-btn ${option.icon ? "icon-only" : ""} ${preference === option.value ? "active" : ""}`}
                    onClick={() => handleChangePreference(option.value)}
                    aria-pressed={preference === option.value}
                    aria-label={option.label}
                    title={option.label}
                >
                    {option.icon ? <span className="theme-toggle-icon" aria-hidden>{option.icon}</span> : option.label}
                </button>
            ))}
        </div>
    );
}
