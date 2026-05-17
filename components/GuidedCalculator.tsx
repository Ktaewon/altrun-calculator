"use client";

import { useEffect, useMemo, useState } from "react";
import CoupangDynamicBanner from "@/components/CoupangDynamicBanner";
import KakaoAdFit from "@/components/KakaoAdFit";
import {
    calculatePhoneCosts,
    defaultPhoneCalculationInputs,
    formatNumber,
    getMethodDescription,
    methodNames,
    MethodResult,
    PhoneCalculationInputs,
} from "@/lib/phone-calculator";

type StepId = "device" | "baseline" | "public" | "select" | "review" | "result";

const steps: Array<{ id: StepId; title: string; eyebrow: string; guide: string }> = [
    {
        id: "device",
        title: "기기 가격부터 맞추기",
        eyebrow: "1 / 4",
        guide: "먼저 비교할 휴대폰의 기준 가격을 잡습니다. 모델명을 넣으면 쿠팡에서 자급제 가격을 확인할 수 있고, 확인한 금액을 자급제 예상가에 반영하면 결과가 더 정확해집니다.",
    },
    {
        id: "baseline",
        title: "비교 기준 정하기",
        eyebrow: "2 / 4",
        guide: "모든 구매 방식을 같은 기간으로 비교하기 위한 공통값입니다. 총 사용 기간과 알뜰폰 요금제를 현실적으로 넣어야 자급제·알뜰런 결과가 왜곡되지 않습니다.",
    },
    {
        id: "public",
        title: "공시지원금 조건 넣기",
        eyebrow: "3 / 4",
        guide: "통신사 공시지원금을 받는 경우의 조건입니다. 지원금, 의무 유지 기간, 고가/저가 요금제, 부가서비스를 매장 안내 기준으로 입력하세요.",
    },
    {
        id: "select",
        title: "선택약정과 알뜰런 조건 넣기",
        eyebrow: "4 / 4",
        guide: "선택약정 할인과 알뜰폰 이동 시점을 함께 비교합니다. 알뜰런 이동 시점을 바꾸면 결과 화면의 최적 이동 월도 함께 확인할 수 있습니다.",
    },
    {
        id: "review",
        title: "입력값 확인",
        eyebrow: "검토",
        guide: "계산 전에 핵심 입력값을 한 번 확인합니다. 광고나 제휴 링크를 누르지 않아도 결과 확인은 가능합니다.",
    },
    {
        id: "result",
        title: "계산 결과",
        eyebrow: "완료",
        guide: "입력한 조건 기준으로 총비용과 월평균이 낮은 순서를 보여줍니다. 자급제 가격이 달라지면 입력 수정으로 돌아가 값을 바꿔 다시 비교하세요.",
    },
];

const numericStepIds: StepId[] = ["device", "baseline", "public", "select"];
const defaultCoupangSelfPhoneUrl = "https://link.coupang.com/a/dO199u8mv6";

function clampNumber(value: number, min?: number, max?: number) {
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
}

function buildCoupangUrl(modelName: string, resultMode: "search" | "self") {
    const query = encodeURIComponent(modelName.trim() || "자급제폰");
    const envSearch = process.env.NEXT_PUBLIC_COUPANG_PHONE_SEARCH_URL;
    const envSelf = process.env.NEXT_PUBLIC_COUPANG_SELF_PHONE_URL;
    const candidate = resultMode === "self"
        ? envSelf || defaultCoupangSelfPhoneUrl
        : envSearch || envSelf || defaultCoupangSelfPhoneUrl;

    if (candidate) {
        if (candidate.includes("{query}")) return candidate.replace("{query}", query);
        if (candidate.endsWith("=")) return `${candidate}${query}`;
        return candidate;
    }

    return `https://www.coupang.com/np/search?q=${query}`;
}

function buildCoupangWidgetUrl(modelName: string) {
    const baseUrl = process.env.NEXT_PUBLIC_COUPANG_SEARCH_WIDGET_URL || "https://coupa.ng/cmWbCk";
    const keyword = modelName.trim();

    if (!keyword) return baseUrl;

    try {
        const widgetUrl = new URL(baseUrl);
        widgetUrl.searchParams.set("q", keyword);
        widgetUrl.searchParams.set("keyword", keyword);
        return widgetUrl.toString();
    } catch {
        const separator = baseUrl.includes("?") ? "&" : "?";
        return `${baseUrl}${separator}q=${encodeURIComponent(keyword)}&keyword=${encodeURIComponent(keyword)}`;
    }
}

function getDisclosure() {
    return process.env.NEXT_PUBLIC_COUPANG_PARTNERS_DISCLOSURE ||
        "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
}

export default function GuidedCalculator() {
    const [currentStep, setCurrentStep] = useState<StepId>("device");
    const [modelName, setModelName] = useState("");
    const [inputs, setInputs] = useState<PhoneCalculationInputs>(defaultPhoneCalculationInputs);
    const [activeMethod, setActiveMethod] = useState<number | null>(null);

    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const result = useMemo(() => calculatePhoneCosts(inputs), [inputs]);
    const bestMethodName = methodNames[result.bestIndex];

    const setNumber = (key: keyof PhoneCalculationInputs, min?: number, max?: number) => (value: number) => {
        setInputs((prev) => ({ ...prev, [key]: clampNumber(value, min, max) }));
    };

    const next = () => setCurrentStep(steps[Math.min(currentIndex + 1, steps.length - 1)].id);
    const previous = () => setCurrentStep(steps[Math.max(currentIndex - 1, 0)].id);

    return (
        <div className="guided-calculator">
            <GuidedProgress currentStep={currentStep} />

            {currentStep !== "result" && (
                <section className="guided-panel">
                    <div className="guided-panel-header">
                        <span className="guided-step-eyebrow">{getProgressLabel(currentStep)}</span>
                        <h2>{steps[currentIndex].title}</h2>
                        <GuideBubble text={steps[currentIndex].guide} />
                    </div>

                    {currentStep === "device" && (
                        <DeviceStep
                            modelName={modelName}
                            onModelNameChange={setModelName}
                            inputs={inputs}
                            setNumber={setNumber}
                        />
                    )}
                    {currentStep === "baseline" && <BaselineStep inputs={inputs} setNumber={setNumber} />}
                    {currentStep === "public" && <PublicStep inputs={inputs} setNumber={setNumber} />}
                    {currentStep === "select" && <SelectStep inputs={inputs} setNumber={setNumber} />}
                    {currentStep === "review" && (
                        <ReviewStep
                            modelName={modelName}
                            inputs={inputs}
                            result={result}
                            bestMethodName={bestMethodName}
                        />
                    )}

                    <div className="guided-actions">
                        <button className="guided-btn secondary" onClick={previous} disabled={currentIndex === 0}>
                            이전
                        </button>
                        {numericStepIds.includes(currentStep) ? (
                            <button className="guided-btn" onClick={next}>다음</button>
                        ) : (
                            <button className="guided-btn" onClick={() => setCurrentStep("result")}>결과 확인하기</button>
                        )}
                    </div>
                </section>
            )}

            {currentStep === "result" && (
                <GuidedResult
                    modelName={modelName}
                    inputs={inputs}
                    result={result}
                    onEdit={() => setCurrentStep("device")}
                    onSelectTimingMonth={(month) => setInputs((prev) => ({ ...prev, mvnoMoveMonths: month }))}
                    onOpenMethod={setActiveMethod}
                />
            )}

            <ResultModal
                activeMethod={activeMethod}
                method={activeMethod !== null ? result.methods[activeMethod] : null}
                onClose={() => setActiveMethod(null)}
            />
            <CoupangDynamicBanner />
        </div>
    );
}

function GuidedProgress({ currentStep }: { currentStep: StepId }) {
    const progressValue = Math.min(4, Math.max(1, numericStepIds.indexOf(currentStep) + 1));
    const isFinalPhase = currentStep === "review" || currentStep === "result";

    return (
        <div className="guided-progress" aria-label="가이드 계산 진행 상태">
            <div className="guided-progress-copy">
                <span>{isFinalPhase ? "입력 완료" : `전체 4단계 중 ${progressValue}단계`}</span>
                <strong>{steps.find((step) => step.id === currentStep)?.title}</strong>
            </div>
            <div className="guided-progress-track" aria-hidden="true">
                <span style={{ width: `${isFinalPhase ? 100 : progressValue * 25}%` }} />
            </div>
        </div>
    );
}

function getProgressLabel(currentStep: StepId) {
    if (currentStep === "review") return "입력값 확인";
    if (currentStep === "result") return "계산 결과";
    return `전체 4단계 중 ${numericStepIds.indexOf(currentStep) + 1}단계`;
}

function GuideBubble({ text }: { text: string }) {
    return (
        <div className="guide-bubble" aria-label="단계 설명">
            <span className="guide-bubble-label">가이드</span>
            <p>{text}</p>
        </div>
    );
}

function DeviceStep({
    modelName,
    onModelNameChange,
    inputs,
    setNumber,
}: {
    modelName: string;
    onModelNameChange: (value: string) => void;
    inputs: PhoneCalculationInputs;
    setNumber: (key: keyof PhoneCalculationInputs, min?: number, max?: number) => (value: number) => void;
}) {
    return (
        <div className="guided-step-grid">
            <CoupangSearchWidget modelName={modelName} />
            <TextInput
                label="모델명/기기명"
                value={modelName}
                onChange={onModelNameChange}
                placeholder="예: 갤럭시 S25, 아이폰 16"
                // 쿠팡 파트너스 API 승인 후 모델명 기반 가격 확인 링크 힌트를 재활성화한다.
                tooltip="선택 입력입니다. 모델명은 나중에 계산 결과를 다시 확인하거나 API 연동 후 상품 검색에 활용할 예정입니다."
            />
            <GuidedNumberInput label="단말기 출고가" value={inputs.devicePrice} onChange={setNumber("devicePrice", 0)} unit="원" required tooltip="통신사 공식 출고가입니다. 공시지원금과 선택약정 시나리오의 단말기 기준 금액으로 사용합니다." />
            <GuidedNumberInput label="자급제 예상가" value={inputs.selfPurchasePrice} onChange={setNumber("selfPurchasePrice", 0)} unit="원" required tooltip="쿠팡, 오픈마켓, 제조사 스토어 등에서 실제 구매 가능한 자급제 가격을 입력합니다." />
            {/*
                쿠팡 파트너스 API 승인 전까지 별도 동적 딥링크 CTA는 비활성화한다.
                API 승인 후 모델명 기반 상품 검색/딥링크 결과 카드로 교체한다.
                {hasModelName && (
                    <AffiliateCard
                        title="쿠팡에서 자급제 가격 확인하기"
                        body={`${modelName.trim()} 자급제 가격을 확인한 뒤, 자급제 예상가에 직접 입력해 비교 정확도를 높일 수 있습니다.`}
                        href={buildCoupangUrl(modelName, "search")}
                        cta="가격 확인하기"
                    />
                )}
            */}
        </div>
    );
}

function BaselineStep({
    inputs,
    setNumber,
}: {
    inputs: PhoneCalculationInputs;
    setNumber: (key: keyof PhoneCalculationInputs, min?: number, max?: number) => (value: number) => void;
}) {
    return (
        <div className="guided-step-grid">
            <GuidedNumberInput label="총 사용 기간" value={inputs.totalPeriod} onChange={setNumber("totalPeriod", 12, 48)} unit="개월" hint="보통 24개월 기준으로 비교합니다." required tooltip="단말기를 사용할 전체 기간입니다. 모든 구매 방식을 같은 기간으로 환산하는 기준입니다." />
            <GuidedNumberInput label="알뜰폰 요금제" value={inputs.mvnoPlanCost} onChange={setNumber("mvnoPlanCost", 0)} unit="원/월" required tooltip="알뜰폰으로 이동하거나 자급제를 쓸 때 적용할 월 요금입니다." />
            <GuidedNumberInput label="유심/eSIM 비용" value={inputs.usimCost} onChange={setNumber("usimCost", 0)} unit="원" tooltip="알뜰폰 이동 시 한 번 발생하는 유심칩 또는 eSIM 발급 비용입니다." />
        </div>
    );
}

function PublicStep({
    inputs,
    setNumber,
}: {
    inputs: PhoneCalculationInputs;
    setNumber: (key: keyof PhoneCalculationInputs, min?: number, max?: number) => (value: number) => void;
}) {
    return (
        <div className="guided-step-grid">
            <GuidedNumberInput label="공시지원금" value={inputs.publicSubsidy} onChange={setNumber("publicSubsidy", 0)} unit="원" tooltip="통신사가 요금제별로 공시한 단말기 지원금입니다. 단말기 출고가에서 차감됩니다." />
            <GuidedNumberInput label="추가지원금" value={inputs.publicExtraSubsidy} onChange={setNumber("publicExtraSubsidy", 0)} unit="원" hint="6개월 이전 해지 시 반환될 수 있습니다." tooltip="공시지원금 외에 추가로 받는 보조금입니다. 유지 조건이 있으면 반환 가능성을 확인하세요." />
            <GuidedNumberInput label="판매점 지원금" value={inputs.publicStoreSubsidy} onChange={setNumber("publicStoreSubsidy", 0)} unit="원" tooltip="판매점이나 매장에서 자체로 지원하는 금액입니다. 실제 반환 조건은 계약 내용을 확인하세요." />
            <GuidedNumberInput label="의무 유지 기간" value={inputs.publicMinMonths} onChange={setNumber("publicMinMonths", 1, 24)} unit="개월" required tooltip="공시지원금 조건으로 고가 요금제를 유지해야 하는 기간입니다. 보통 6개월 기준이 많습니다." />
            <GuidedNumberInput label="공시 요금제 (고가)" value={inputs.publicPlanCost} onChange={setNumber("publicPlanCost", 0)} unit="원/월" required tooltip="의무 유지 기간 동안 쓰는 통신사 요금제의 월 요금입니다." />
            <GuidedNumberInput label="이후 요금제 (저가)" value={inputs.publicLowPlanCost} onChange={setNumber("publicLowPlanCost", 0)} unit="원/월" required tooltip="의무 유지 기간 이후 낮춰 쓸 요금제의 월 요금입니다." />
            <GuidedNumberInput label="부가서비스 금액" value={inputs.publicVasCost} onChange={setNumber("publicVasCost", 0)} unit="원/월" tooltip="가입 조건으로 유지해야 하는 보험, 멤버십 등 부가서비스 월 요금입니다." />
            <GuidedNumberInput label="부가서비스 유지 기간" value={inputs.publicVasMonths} onChange={setNumber("publicVasMonths", 0, 24)} unit="개월" tooltip="부가서비스를 유지해야 하는 기간입니다. 없으면 0개월로 입력하세요." />
            <GuidedNumberInput label="결합할인 (고가)" value={inputs.publicHighCombineDiscount} onChange={setNumber("publicHighCombineDiscount", 0)} unit="원/월" tooltip="고가 요금제 사용 기간에 적용되는 인터넷/TV/가족 결합 월 할인입니다." />
            <GuidedNumberInput label="결합할인 (저가)" value={inputs.publicLowCombineDiscount} onChange={setNumber("publicLowCombineDiscount", 0)} unit="원/월" tooltip="저가 요금제로 변경한 뒤 적용되는 월 결합할인입니다." />
        </div>
    );
}

function SelectStep({
    inputs,
    setNumber,
}: {
    inputs: PhoneCalculationInputs;
    setNumber: (key: keyof PhoneCalculationInputs, min?: number, max?: number) => (value: number) => void;
}) {
    return (
        <div className="guided-step-grid">
            <GuidedNumberInput label="추가지원금" value={inputs.selectExtraSubsidy} onChange={setNumber("selectExtraSubsidy", 0)} unit="원" tooltip="선택약정 조건에서 추가로 받는 단말기 지원금입니다. 유지 조건이 있으면 반환 여부를 확인하세요." />
            <GuidedNumberInput label="판매점 지원금" value={inputs.selectStoreSubsidy} onChange={setNumber("selectStoreSubsidy", 0)} unit="원" tooltip="선택약정 가입 시 판매점에서 제공하는 자체 지원금입니다." />
            <GuidedNumberInput label="선택약정 할인율" value={inputs.selectDiscountRate} onChange={setNumber("selectDiscountRate", 0, 100)} unit="%" required tooltip="요금제에서 할인되는 비율입니다. 일반적으로 25% 기준으로 계산합니다." />
            <GuidedNumberInput label="의무 유지 기간" value={inputs.selectMinMonths} onChange={setNumber("selectMinMonths", 1, 24)} unit="개월" required tooltip="선택약정 요금제를 유지해야 하는 기간입니다. 알뜰런 계산의 통신사 유지 기간에도 영향을 줍니다." />
            <GuidedNumberInput label="선택약정 요금제 (고가)" value={inputs.selectPlanCost} onChange={setNumber("selectPlanCost", 0)} unit="원/월" required tooltip="선택약정 할인이 적용되는 초기 고가 요금제 월 요금입니다." />
            <GuidedNumberInput label="이후 요금제 (저가)" value={inputs.selectLowPlanCost} onChange={setNumber("selectLowPlanCost", 0)} unit="원/월" required tooltip="의무 유지 후 낮춰 쓸 선택약정 요금제 월 요금입니다." />
            <GuidedNumberInput label="부가서비스 금액" value={inputs.selectVasCost} onChange={setNumber("selectVasCost", 0)} unit="원/월" tooltip="선택약정 가입 조건에 포함된 부가서비스 월 요금입니다." />
            <GuidedNumberInput label="부가서비스 유지 기간" value={inputs.selectVasMonths} onChange={setNumber("selectVasMonths", 0, 24)} unit="개월" tooltip="부가서비스를 유지해야 하는 기간입니다. 알뜰런으로 이동하면 실제 유지한 개월만 반영합니다." />
            <GuidedNumberInput label="결합할인 (고가)" value={inputs.selectHighCombineDiscount} onChange={setNumber("selectHighCombineDiscount", 0)} unit="원/월" tooltip="초기 고가 요금제에 적용되는 월 결합할인입니다." />
            <GuidedNumberInput label="결합할인 (저가)" value={inputs.selectLowCombineDiscount} onChange={setNumber("selectLowCombineDiscount", 0)} unit="원/월" tooltip="이후 저가 요금제에 적용되는 월 결합할인입니다." />
            <GuidedNumberInput label="알뜰런 이동 시점" value={inputs.mvnoMoveMonths} onChange={setNumber("mvnoMoveMonths", 1, 24)} unit="개월 후" required tooltip="선택약정 가입 후 몇 개월 뒤 알뜰폰으로 이동할지입니다. 결과 화면에서 1~12개월 최적 시점도 비교합니다." />
        </div>
    );
}

function ReviewStep({
    modelName,
    inputs,
    result,
    bestMethodName,
}: {
    modelName: string;
    inputs: PhoneCalculationInputs;
    result: ReturnType<typeof calculatePhoneCosts>;
    bestMethodName: string;
}) {
    const pcUnit = process.env.NEXT_PUBLIC_KAKAO_ADFIT_PC_UNIT;
    const mobileUnit = process.env.NEXT_PUBLIC_KAKAO_ADFIT_MOBILE_UNIT;

    return (
        <div className="guided-review">
            <div className="guided-summary-grid">
                <SummaryItem label="모델명" value={modelName.trim() || "미입력"} />
                <SummaryItem label="출고가" value={`${formatNumber(inputs.devicePrice)}원`} />
                <SummaryItem label="자급제 예상가" value={`${formatNumber(inputs.selfPurchasePrice)}원`} />
                <SummaryItem label="총 사용 기간" value={`${inputs.totalPeriod}개월`} />
                <SummaryItem label="알뜰폰 요금제" value={`${formatNumber(inputs.mvnoPlanCost)}원/월`} />
                <SummaryItem label="현재 최저 예상" value={bestMethodName} />
            </div>

            {pcUnit && mobileUnit && (
                <div className="guided-ad-block" aria-label="광고">
                    <KakaoAdFit
                        pc={{ unit: pcUnit, width: 728, height: 90 }}
                        mobile={{ unit: mobileUnit, width: 320, height: 100 }}
                    />
                </div>
            )}

            <AffiliateCard
                title="자급제 가격도 함께 확인해보세요"
                body={`현재 입력값 기준 최저 예상 방식은 ${bestMethodName}입니다. 실제 구매 전 자급제 가격을 확인하면 비교 정확도가 올라갑니다.`}
                href={buildCoupangUrl(modelName, "self")}
                cta="자급제 제품 보기"
            />

            <p className="guided-preview-note">
                입력값 기준 예상 최저 비용은 {formatNumber(result.methods[result.bestIndex].total)}원입니다.
            </p>
        </div>
    );
}

function GuidedResult({
    modelName,
    inputs,
    result,
    onEdit,
    onSelectTimingMonth,
    onOpenMethod,
}: {
    modelName: string;
    inputs: PhoneCalculationInputs;
    result: ReturnType<typeof calculatePhoneCosts>;
    onEdit: () => void;
    onSelectTimingMonth: (month: number) => void;
    onOpenMethod: (index: number) => void;
}) {
    const bestIsSelfOrMvno = result.bestIndex === 3 || result.bestIndex === 4;
    const affiliateTitle = result.bestIndex === 4
        ? "자급제 제품 구경가기"
        : bestIsSelfOrMvno
            ? "알뜰폰용 자급제폰 확인하기"
            : "자급제 가격도 함께 확인하기";

    return (
        <section className="guided-results">
            <div className="guided-result-hero">
                <div>
                    <span className="guided-step-eyebrow">계산 완료</span>
                    <h2>가장 낮은 예상 비용은 {methodNames[result.bestIndex]}입니다</h2>
                    <p>
                        총 {formatNumber(result.methods[result.bestIndex].total)}원,
                        월 평균 {formatNumber(result.methods[result.bestIndex].monthly)}원 기준입니다.
                    </p>
                </div>
                <button className="guided-btn secondary" onClick={onEdit}>입력 수정</button>
            </div>

            <AffiliateCard
                title={affiliateTitle}
                body="실제 자급제 가격은 시점과 판매처에 따라 달라질 수 있습니다. 구매 전 가격을 확인한 뒤 계산기의 자급제 예상가에 반영하세요."
                href={buildCoupangUrl(modelName, "self")}
                cta="제품 구경가기"
            />

            <section className="comparison-section">
                <h2 className="section-title">휴대폰 총비용 비교</h2>
                <div className="comparison-cards">
                    {result.methods.map((method, index) => (
                        <div key={methodNames[index]} className={`method-card ${method.rank === 1 ? "best" : ""} ${method.rank === 2 ? "featured" : ""}`}>
                            <div className="method-header">
                                <div className="method-rank">{method.rank}</div>
                                <div className={`method-badge ${method.badge?.class}`}>{method.badge?.text}</div>
                            </div>
                            <h3 className="method-title">{methodNames[index]}</h3>
                            <p className="method-desc">{getMethodDescription(index, inputs)}</p>
                            <div className="method-total">
                                <span className="total-label">총 비용</span>
                                <span className="total-value">{formatNumber(method.total)}원</span>
                            </div>
                            <div className="method-monthly">
                                <span className="monthly-label">월 평균</span>
                                <span className="monthly-value">{formatNumber(method.monthly)}원</span>
                            </div>
                            <button className="detail-btn" onClick={() => onOpenMethod(index)}>비용 내역 보기</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="savings-section">
                <div className="savings-grid">
                    <div className="savings-item best">
                        <div className="savings-content">
                            <span className="savings-label">가장 낮은 총비용</span>
                            <span className="savings-method">{methodNames[result.bestIndex]}</span>
                        </div>
                    </div>
                    <div className="savings-item">
                        <div className="savings-content">
                            <span className="savings-label">공시지원금 대비 차이</span>
                            <span className="savings-amount">{formatNumber(result.savings)}원</span>
                        </div>
                    </div>
                    <div className="savings-item">
                        <div className="savings-content">
                            <span className="savings-label">절감 비율</span>
                            <span className="savings-percent">{result.savingsPercent.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="card timing-card">
                <div className="card-header"><h2>알뜰런 이동 시점 비교</h2></div>
                <div className="card-body">
                    <p className="timing-desc">선택약정 후 알뜰폰으로 옮기는 시점에 따라 휴대폰 총비용이 어떻게 달라지는지 확인합니다.</p>
                    <div className="timing-chart">
                        {result.timing.costs.map((cost) => (
                            <div
                                key={cost.month}
                                className={`timing-bar ${cost.month === result.timing.optimalMonth ? "optimal" : Math.abs(cost.total - result.timing.minCost) < result.timing.minCost * 0.02 ? "good" : ""}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectTimingMonth(cost.month)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onSelectTimingMonth(cost.month);
                                    }
                                }}
                                aria-label={`${cost.month}개월 유지 시 총 ${formatNumber(cost.total)}원`}
                            >
                                <span className="month">{cost.month}개월</span>
                                <span className="cost">{Math.round(cost.monthly / 1000)}K</span>
                            </div>
                        ))}
                    </div>
                    <div className="timing-recommendation">
                        <span className="rec-text">{result.timing.optimalMonth}개월 유지 후 이동했을 때 총비용이 가장 낮습니다. (총 {formatNumber(result.timing.minCost)}원)</span>
                    </div>
                </div>
            </section>
        </section>
    );
}

function ResultModal({
    activeMethod,
    method,
    onClose,
}: {
    activeMethod: number | null;
    method: MethodResult | null;
    onClose: () => void;
}) {
    if (activeMethod === null || !method) return null;

    return (
        <div className="modal-overlay active" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div className="modal" role="dialog" aria-modal="true" tabIndex={-1}>
                <div className="modal-header">
                    <h3 className="modal-title">{methodNames[activeMethod]} 상세 내역</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-section">
                        <div className="modal-section-title">비용 구성</div>
                        <ModalRow label="단말기 비용" value={method.device} />
                        <ModalRow label="요금제 비용" value={method.plan} />
                        {method.vas > 0 && <ModalRow label={`부가서비스 (${method.vasMonths}개월)`} value={method.vas} />}
                        {method.penalty > 0 && <ModalRow label="선택약정 반환금" value={method.penalty} className="penalty" />}
                        {method.usim > 0 && <ModalRow label="유심/eSIM 비용" value={method.usim} />}
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="modal-total"><span>총 비용</span><span className="modal-total-value">{formatNumber(method.total)}원</span></div>
                    <div className="modal-monthly"><span>월 평균</span><span className="modal-monthly-value">{formatNumber(method.monthly)}원</span></div>
                </div>
            </div>
        </div>
    );
}

function ModalRow({ label, value, className }: { label: string; value: number; className?: string }) {
    return (
        <div className={`modal-row ${className || ""}`}>
            <span className="modal-row-label">{label}</span>
            <span className="modal-row-value">{formatNumber(value)}원</span>
        </div>
    );
}

function AffiliateCard({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
    return (
        <aside className="affiliate-card">
            <div>
                <span className="affiliate-label">쿠팡 파트너스</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <p className="affiliate-disclosure">{getDisclosure()}</p>
            </div>
            <a className="affiliate-link" href={href} target="_blank" rel="nofollow sponsored noopener noreferrer">
                {cta}
            </a>
        </aside>
    );
}

function CoupangSearchWidget({ modelName }: { modelName: string }) {
    const [debouncedModelName, setDebouncedModelName] = useState(modelName);
    const trimmedModelName = debouncedModelName.trim();
    const widgetUrl = buildCoupangWidgetUrl(trimmedModelName);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedModelName(modelName), 600);
        return () => window.clearTimeout(timer);
    }, [modelName]);

    const copyModelName = async () => {
        if (!trimmedModelName) return;
        try {
            await navigator.clipboard.writeText(trimmedModelName);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = trimmedModelName;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.top = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(success);
            if (success) {
                window.setTimeout(() => setCopied(false), 1500);
            }
        }
    };

    return (
        <aside className="coupang-widget-card">
            <div className="coupang-widget-copy">
                <span className="affiliate-label">가격 먼저 확인</span>
                <h3>자급제 가격 확인하기</h3>
                <p>
                    {trimmedModelName
                        ? `위젯이 검색어 자동 입력을 지원하면 ${trimmedModelName} 기준으로 열립니다. 지원하지 않는 경우 아래 검색창에 모델명을 직접 입력하세요.`
                        : "모델명이나 제품명을 검색해서 자급제 가격을 확인해보세요."}
                </p>
                {trimmedModelName && (
                    <div className="coupang-model-chip-row">
                        <span className="coupang-model-chip">{trimmedModelName}</span>
                        <button className="coupang-copy-btn" type="button" onClick={copyModelName}>
                            {copied ? "복사됨" : "모델명 복사"}
                        </button>
                    </div>
                )}
                <p className="affiliate-disclosure">{getDisclosure()}</p>
            </div>
            <iframe
                key={widgetUrl}
                className="coupang-search-widget"
                src={widgetUrl}
                title={`${trimmedModelName || "자급제폰"} 쿠팡 파트너스 검색 위젯`}
                width="100%"
                height="44"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
                loading="lazy"
            />
        </aside>
    );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="guided-summary-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function TextInput({
    label,
    value,
    onChange,
    placeholder,
    hint,
    tooltip,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    hint?: string;
    tooltip?: string;
}) {
    return (
        <div className="input-group guided-wide-field">
            <GuidedLabel label={label} tooltip={tooltip} />
            <div className="input-wrapper">
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                />
            </div>
            {hint && <span className="hint">{hint}</span>}
        </div>
    );
}

function GuidedNumberInput({
    label,
    value,
    onChange,
    unit,
    hint,
    tooltip,
    required,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    unit: string;
    hint?: string;
    tooltip?: string;
    required?: boolean;
}) {
    const [focused, setFocused] = useState(false);
    const displayValue = focused ? String(value) : formatNumber(value);

    return (
        <div className="input-group">
            <GuidedLabel label={label} tooltip={tooltip} required={required} />
            <div className="input-wrapper">
                <input
                    type="text"
                    inputMode="numeric"
                    value={displayValue}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(event) => {
                        const raw = event.target.value.replace(/[^0-9]/g, "");
                        onChange(Number(raw || 0));
                    }}
                />
                <span className="unit">{unit}</span>
            </div>
            {hint && <span className="hint">{hint}</span>}
        </div>
    );
}

function GuidedLabel({ label, tooltip, required }: { label: string; tooltip?: string; required?: boolean }) {
    return (
        <label>
            {label}
            {required && (
                <span className="required-mark" aria-label="필수 입력">*</span>
            )}
            {tooltip && (
                <span className="tooltip-wrap guided-tooltip" tabIndex={0}>
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">{tooltip}</span>
                </span>
            )}
        </label>
    );
}
