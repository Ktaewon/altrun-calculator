"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    calculateSeontaekPenalty,
    SeontaekContractMonths,
} from "@/lib/seontaek-penalty";
import { formatNumber } from "@/lib/phone-calculator";

function clampNumber(value: number, min: number, max?: number) {
    if (value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
}

function NumberField({
    label,
    value,
    onChange,
    unit,
    hint,
    max,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    unit: string;
    hint?: string;
    max?: number;
}) {
    const [focused, setFocused] = useState(false);
    const displayValue = focused ? String(value) : formatNumber(value);

    return (
        <div className="input-group">
            <label>{label}</label>
            <div className="input-wrapper">
                <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(event) => {
                        const raw = event.target.value.replace(/[^0-9]/g, "");
                        const next = Number(raw || 0);
                        onChange(max !== undefined ? clampNumber(next, 0, max) : Math.max(0, next));
                    }}
                />
                <span className="unit">{unit}</span>
            </div>
            {hint && <span className="hint">{hint}</span>}
        </div>
    );
}

export default function SeontaekPenaltyCalculator() {
    const [monthlyBase, setMonthlyBase] = useState(85000);
    const [discountRate, setDiscountRate] = useState(25);
    const [contractMonths, setContractMonths] = useState<SeontaekContractMonths>(24);
    const [monthsUsed, setMonthsUsed] = useState(6);

    const expectedRepayment = useMemo(
        () =>
            calculateSeontaekPenalty({
                monthlyBase,
                discountRate,
                contractMonths,
                monthsUsed,
            }),
        [monthlyBase, discountRate, contractMonths, monthsUsed],
    );

    return (
        <div className="penalty-calculator">
            <section className="guided-panel">
                <div className="input-row">
                    <NumberField
                        label="월 기본료"
                        value={monthlyBase}
                        onChange={setMonthlyBase}
                        unit="원"
                    />
                    <NumberField
                        label="할인율"
                        value={discountRate}
                        onChange={(value) => setDiscountRate(clampNumber(value, 0, 100))}
                        unit="%"
                        hint="기본 25%"
                    />
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="contract-months">약정 기간</label>
                        <div className="input-wrapper">
                            <select
                                id="contract-months"
                                className="penalty-select"
                                value={contractMonths}
                                onChange={(event) =>
                                    setContractMonths(Number(event.target.value) as SeontaekContractMonths)
                                }
                            >
                                <option value={12}>12개월</option>
                                <option value={24}>24개월</option>
                            </select>
                        </div>
                    </div>
                    <NumberField
                        label="사용한 개월"
                        value={monthsUsed}
                        onChange={setMonthsUsed}
                        unit="개월"
                    />
                </div>
            </section>

            <section className="guided-result-hero penalty-result">
                <div>
                    <p className="eyebrow">예상 반환금</p>
                    <h2>{formatNumber(expectedRepayment)}원</h2>
                    <p className="penalty-disclaimer">
                        참고용 추정치입니다. 실제 위약금은 통신사 청구서가 기준입니다.
                    </p>
                </div>
            </section>

            <p className="penalty-back-link">
                <Link href="/">휴대폰 요금 계산기로 이동</Link>
            </p>
        </div>
    );
}
