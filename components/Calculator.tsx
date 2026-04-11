"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

// Types
interface CalculationResult {
    device: number;
    plan: number;
    total: number;
    monthly: number;
    penalty: number;
    usim: number;
    vas: number;
    vasMonths: number;
    highPlan?: number;
    lowPlan?: number;
    mvno?: number;
    highMonths?: number;
    lowMonths?: number;
    mvnoMonths?: number;
    combineDiscount?: number;
    // For timing chart
    carrier?: number;
    carrierMonths?: number;
}

interface MethodResult extends CalculationResult {
    rank?: number;
    badge?: { class: string; text: string };
}

const methodNames = ['공시지원금', '선택약정', '선택약정+추가지원금', '선택약정+알뜰런', '자급제+알뜰폰'];

function formatInputThousands(num: number): string {
    return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function Calculator() {
    // --- State ---

    // 단말기 정보
    const [devicePrice, setDevicePrice] = useState(1500000);
    const [selfPurchasePrice, setSelfPurchasePrice] = useState(1350000);

    // 공통 설정
    const [totalPeriod, setTotalPeriod] = useState(24);
    const [mvnoPlanCost, setMvnoPlanCost] = useState(15000);
    const [usimCost, setUsimCost] = useState(5000);

    // 공시지원금 조건
    const [publicSubsidy, setPublicSubsidy] = useState(300000);
    const [publicExtraSubsidy, setPublicExtraSubsidy] = useState(200000);
    const [publicStoreSubsidy, setPublicStoreSubsidy] = useState(100000);
    const [publicPlanCost, setPublicPlanCost] = useState(85000);
    const [publicLowPlanCost, setPublicLowPlanCost] = useState(55000);
    const [publicMinMonths, setPublicMinMonths] = useState(6);
    const [publicVasCost, setPublicVasCost] = useState(15000);
    const [publicVasMonths, setPublicVasMonths] = useState(3);
    const [publicHighCombineDiscount, setPublicHighCombineDiscount] = useState(0);
    const [publicLowCombineDiscount, setPublicLowCombineDiscount] = useState(0);

    // 선택약정 조건
    const [selectExtraSubsidy, setSelectExtraSubsidy] = useState(200000);
    const [selectStoreSubsidy, setSelectStoreSubsidy] = useState(150000);
    const [selectDiscountRate, setSelectDiscountRate] = useState(25);
    const [selectMinMonths, setSelectMinMonths] = useState(6);
    const [selectPlanCost, setSelectPlanCost] = useState(69000);
    const [selectLowPlanCost, setSelectLowPlanCost] = useState(45000);
    const [selectVasCost, setSelectVasCost] = useState(10000);
    const [selectVasMonths, setSelectVasMonths] = useState(2);
    const [selectHighCombineDiscount, setSelectHighCombineDiscount] = useState(0);
    const [selectLowCombineDiscount, setSelectLowCombineDiscount] = useState(0);
    const [mvnoMoveMonths, setMvnoMoveMonths] = useState(6);

    // Modal State
    const [activeModal, setActiveModal] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Modal accessibility: Escape close, body scroll lock, focus
    useEffect(() => {
        if (activeModal === null) return;
        document.body.style.overflow = 'hidden';
        modalRef.current?.focus();
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveModal(null);
        };
        document.addEventListener('keydown', handler);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handler);
        };
    }, [activeModal]);

    // Phase 1: Accordion state
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['public']));
    const toggleSection = (key: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    // Phase 5: Sticky summary bar state
    const [showStickyBar, setShowStickyBar] = useState(false);
    const comparisonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = comparisonRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyBar(!entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const scrollToResults = useCallback(() => {
        comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Phase 9: Result flash animation
    const prevTotalsRef = useRef<number[]>([]);
    const [flashCards, setFlashCards] = useState<Set<number>>(new Set());

    // --- Helpers ---
    const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

    // --- Results Calculation ---
    const results = useMemo(() => {
        // 방식 1: 공시지원금
        const calculatePublicSubsidy = () => {
            const deviceCost = Math.max(0, devicePrice - publicSubsidy - publicExtraSubsidy - publicStoreSubsidy);
            const highPlanMonthly = publicPlanCost - publicHighCombineDiscount;
            const highPlanTotal = highPlanMonthly * publicMinMonths;
            const remainingMonths = Math.max(0, totalPeriod - publicMinMonths);
            const lowPlanMonthly = publicLowPlanCost - publicLowCombineDiscount;
            const lowPlanTotal = lowPlanMonthly * remainingMonths;
            const combineDiscountTotal = (publicHighCombineDiscount * publicMinMonths) + (publicLowCombineDiscount * remainingMonths);
            const planTotal = highPlanTotal + lowPlanTotal;
            const vasTotal = publicVasCost * publicVasMonths;
            const total = deviceCost + planTotal + vasTotal;

            return {
                device: deviceCost,
                plan: planTotal,
                highPlan: highPlanTotal,
                lowPlan: lowPlanTotal,
                highMonths: publicMinMonths,
                lowMonths: remainingMonths,
                vas: vasTotal,
                vasMonths: publicVasMonths,
                combineDiscount: combineDiscountTotal,
                penalty: 0,
                usim: 0,
                total,
                monthly: total / totalPeriod
            };
        };

        // 방식 2, 3: 선택약정
        const calculateSelectContract = (extraSubsidy: number, minMonthsOverride?: number) => {
            const minMonths = minMonthsOverride || selectMinMonths;
            const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy - extraSubsidy);
            const discountDec = selectDiscountRate / 100;

            const discountedHighPlan = selectPlanCost * (1 - discountDec) - selectHighCombineDiscount;
            const highPlanTotal = discountedHighPlan * minMonths;

            const remainingMonths = Math.max(0, totalPeriod - minMonths);
            const discountedLowPlan = selectLowPlanCost * (1 - discountDec) - selectLowCombineDiscount;
            const lowPlanTotal = discountedLowPlan * remainingMonths;

            const combineDiscountTotal = (selectHighCombineDiscount * minMonths) + (selectLowCombineDiscount * remainingMonths);
            const planTotal = highPlanTotal + lowPlanTotal;
            const vasTotal = selectVasCost * selectVasMonths;
            const total = deviceCost + planTotal + vasTotal;

            return {
                device: deviceCost,
                plan: planTotal,
                highPlan: highPlanTotal,
                lowPlan: lowPlanTotal,
                highMonths: minMonths,
                lowMonths: remainingMonths,
                vas: vasTotal,
                vasMonths: selectVasMonths,
                combineDiscount: combineDiscountTotal,
                penalty: 0,
                usim: 0,
                total,
                monthly: total / totalPeriod
            };
        };

        // 방식 4: 선택약정 + 알뜰런
        const calculateSelectMvno = (moveMonths: number) => {
            const discountDec = selectDiscountRate / 100;
            const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy);

            // 의무 유지 기간 동안
            const discountedHighPlan = selectPlanCost * (1 - discountDec) - selectHighCombineDiscount;
            const highPlanMonths = Math.min(selectMinMonths, moveMonths);
            const highPlanTotal = discountedHighPlan * highPlanMonths;

            // 의무 유지 이후 ~ 알뜰런 이동까지
            const discountedLowPlan = selectLowPlanCost * (1 - discountDec) - selectLowCombineDiscount;
            const lowPlanMonths = Math.max(0, moveMonths - selectMinMonths);
            const lowPlanTotal = discountedLowPlan * lowPlanMonths;

            const combineDiscountTotal = (selectHighCombineDiscount * highPlanMonths) + (selectLowCombineDiscount * lowPlanMonths);
            const carrierTotal = highPlanTotal + lowPlanTotal;

            // 알뜰폰 기간
            const mvnoMonths = Math.max(0, totalPeriod - moveMonths);
            const mvnoTotal = mvnoPlanCost * mvnoMonths;

            // 부가서비스
            const actualVasMonths = Math.min(selectVasMonths, moveMonths);
            const vasTotal = selectVasCost * actualVasMonths;

            // 위약금 (할인반환금)
            const highPlanDiscount = selectPlanCost * discountDec * highPlanMonths;
            const lowPlanDiscount = selectLowPlanCost * discountDec * lowPlanMonths;
            const penalty = highPlanDiscount + lowPlanDiscount;

            const total = deviceCost + carrierTotal + mvnoTotal + vasTotal + penalty + usimCost;

            return {
                device: deviceCost,
                carrier: carrierTotal,
                highPlan: highPlanTotal,
                lowPlan: lowPlanTotal,
                highMonths: highPlanMonths,
                lowMonths: lowPlanMonths,
                mvno: mvnoTotal,
                plan: carrierTotal + mvnoTotal,
                vas: vasTotal,
                vasMonths: actualVasMonths,
                combineDiscount: combineDiscountTotal,
                penalty,
                usim: usimCost,
                total,
                monthly: total / totalPeriod,
                carrierMonths: moveMonths,
                mvnoMonths: mvnoMonths
            };
        };

        // 방식 5: 자급제 + 알뜰폰
        const calculateSelfMvno = () => {
            const deviceCost = selfPurchasePrice;
            const planTotal = mvnoPlanCost * totalPeriod;
            const total = deviceCost + planTotal;

            return {
                device: deviceCost,
                plan: planTotal,
                penalty: 0,
                usim: 0,
                vas: 0,
                vasMonths: 0,
                total,
                monthly: total / totalPeriod
            };
        };

        const m1 = calculatePublicSubsidy();
        const m2 = calculateSelectContract(0);
        const m3 = calculateSelectContract(selectExtraSubsidy, 6);
        const m4 = calculateSelectMvno(mvnoMoveMonths);
        const m5 = calculateSelfMvno();

        const methods: MethodResult[] = [
            { ...m1 },
            { ...m2 },
            { ...m3 },
            { ...m4 },
            { ...m5 }
        ];

        // Rank
        const sorted = methods.map((m, i) => ({ index: i, total: m.total })).sort((a, b) => a.total - b.total);
        const rankingMap = new Map();
        sorted.forEach((item, rank) => {
            rankingMap.set(item.index, rank + 1);
        });

        // Add badges
        const badgeConfigs: Record<number, { class: string; text: string }> = {
            1: { class: 'badge-primary', text: '가장 낮음' },
            2: { class: 'badge-success', text: '대안' },
            3: { class: 'badge-warning', text: '비교 필요' },
            4: { class: 'badge-warning', text: '비교 필요' },
            5: { class: 'badge-danger', text: '비용 높음' }
        };

        const finalMethods = methods.map((m, i) => ({
            ...m,
            rank: rankingMap.get(i),
            badge: badgeConfigs[rankingMap.get(i)]
        }));

        const bestMethod = sorted[0];
        const savings = m1.total - bestMethod.total;
        const savingsPercent = m1.total > 0 ? (savings / m1.total) * 100 : 0;

        // Timing Analysis
        let minCost = Infinity;
        let optimalMonth = 1;
        const timingCosts = [];
        for (let m = 1; m <= 12; m++) {
            const res = calculateSelectMvno(m);
            timingCosts.push({ month: m, total: res.total, monthly: res.monthly });
            if (res.total < minCost) {
                minCost = res.total;
                optimalMonth = m;
            }
        }

        return {
            methods: finalMethods,
            savings,
            savingsPercent,
            bestIndex: bestMethod.index,
            timing: { costs: timingCosts, optimalMonth, minCost }
        };
    }, [
        devicePrice, selfPurchasePrice, totalPeriod, mvnoPlanCost, usimCost,
        publicSubsidy, publicExtraSubsidy, publicStoreSubsidy, publicPlanCost, publicLowPlanCost,
        publicMinMonths, publicVasCost, publicVasMonths, publicHighCombineDiscount, publicLowCombineDiscount,
        selectExtraSubsidy, selectStoreSubsidy, selectDiscountRate, selectMinMonths, selectPlanCost,
        selectLowPlanCost, selectVasCost, selectVasMonths, selectHighCombineDiscount, selectLowCombineDiscount,
        mvnoMoveMonths
    ]);

    // Phase 9: Flash effect on results change
    useEffect(() => {
        const currentTotals = results.methods.map(m => m.total);
        const prev = prevTotalsRef.current;
        if (prev.length > 0) {
            const changed = new Set<number>();
            currentTotals.forEach((t, i) => {
                if (prev[i] !== undefined && prev[i] !== t) changed.add(i);
            });
            if (changed.size > 0) {
                setFlashCards(changed);
                setTimeout(() => setFlashCards(new Set()), 600);
            }
        }
        prevTotalsRef.current = currentTotals;
    }, [results]);

    // --- Modal Guide ---
    const renderModalGuide = () => {
        if (activeModal === null) return null;
        switch (activeModal) {
            case 1:
                return (
                    <div className="modal-guide">
                        <div className="modal-guide-title">계산 기준</div>
                        <ol className="modal-guide-steps">
                            <li>공시지원금({formatNumber(publicSubsidy)}원) + 추가지원금({formatNumber(publicExtraSubsidy)}원) + 판매점 지원금({formatNumber(publicStoreSubsidy)}원)을 받고 단말기 구매</li>
                            <li>고가 요금제({formatNumber(publicPlanCost)}원/월)로 <strong>{publicMinMonths}개월</strong> 의무 유지</li>
                            <li>이후 저가 요금제({formatNumber(publicLowPlanCost)}원/월)로 변경하여 나머지 <strong>{Math.max(0, totalPeriod - publicMinMonths)}개월</strong> 사용</li>
                            {publicVasMonths > 0 && <li>부가서비스({formatNumber(publicVasCost)}원/월) {publicVasMonths}개월 유지 후 해지</li>}
                            <li>총 <strong>{totalPeriod}개월</strong> 동일 통신사 유지</li>
                        </ol>
                    </div>
                );
            case 2:
                return (
                    <div className="modal-guide">
                        <div className="modal-guide-title">계산 기준</div>
                        <ol className="modal-guide-steps">
                            <li>선택약정({selectDiscountRate}% 할인) + 판매점 지원금({formatNumber(selectStoreSubsidy)}원)으로 단말기 구매</li>
                            <li>고가 요금제({formatNumber(selectPlanCost)}원/월, 할인 후 {formatNumber(selectPlanCost * (1 - selectDiscountRate / 100))}원)로 <strong>{selectMinMonths}개월</strong> 의무 유지</li>
                            <li>이후 저가 요금제({formatNumber(selectLowPlanCost)}원/월, 할인 후 {formatNumber(selectLowPlanCost * (1 - selectDiscountRate / 100))}원)로 변경하여 나머지 <strong>{Math.max(0, totalPeriod - selectMinMonths)}개월</strong> 사용</li>
                            {selectVasMonths > 0 && <li>부가서비스({formatNumber(selectVasCost)}원/월) {selectVasMonths}개월 유지 후 해지</li>}
                            <li>총 <strong>{totalPeriod}개월</strong> 동일 통신사에서 선택약정 유지</li>
                        </ol>
                    </div>
                );
            case 3:
                return (
                    <div className="modal-guide">
                        <div className="modal-guide-title">계산 기준</div>
                        <ol className="modal-guide-steps">
                            <li>선택약정({selectDiscountRate}% 할인) + 추가지원금({formatNumber(selectExtraSubsidy)}원) + 판매점 지원금({formatNumber(selectStoreSubsidy)}원)으로 단말기 구매</li>
                            <li>고가 요금제({formatNumber(selectPlanCost)}원/월, 할인 후 {formatNumber(selectPlanCost * (1 - selectDiscountRate / 100))}원)로 <strong>6개월</strong> 의무 유지 (추가지원금 조건)</li>
                            <li>이후 저가 요금제({formatNumber(selectLowPlanCost)}원/월, 할인 후 {formatNumber(selectLowPlanCost * (1 - selectDiscountRate / 100))}원)로 변경하여 나머지 <strong>{Math.max(0, totalPeriod - 6)}개월</strong> 사용</li>
                            {selectVasMonths > 0 && <li>부가서비스({formatNumber(selectVasCost)}원/월) {selectVasMonths}개월 유지 후 해지</li>}
                            <li>총 <strong>{totalPeriod}개월</strong> 동일 통신사에서 선택약정 유지</li>
                        </ol>
                    </div>
                );
            case 4:
                return (
                    <div className="modal-guide">
                        <div className="modal-guide-title">계산 기준</div>
                        <ol className="modal-guide-steps">
                            <li>선택약정({selectDiscountRate}% 할인) + 판매점 지원금({formatNumber(selectStoreSubsidy)}원)으로 단말기 구매</li>
                            {Math.min(selectMinMonths, mvnoMoveMonths) > 0 && <li>고가 요금제({formatNumber(selectPlanCost)}원/월)로 <strong>{Math.min(selectMinMonths, mvnoMoveMonths)}개월</strong> 유지</li>}
                            {mvnoMoveMonths > selectMinMonths && <li>저가 요금제({formatNumber(selectLowPlanCost)}원/월)로 변경하여 <strong>{mvnoMoveMonths - selectMinMonths}개월</strong> 추가 유지</li>}
                            <li><strong>{mvnoMoveMonths}개월 후</strong> 선택약정 해지 → 할인반환금({formatNumber(results.methods[3].penalty)}원) 납부</li>
                            <li>알뜰폰(MVNO)으로 번호이동 → 유심/eSIM 비용({formatNumber(usimCost)}원)</li>
                            <li>알뜰폰 요금제({formatNumber(mvnoPlanCost)}원/월)로 나머지 <strong>{Math.max(0, totalPeriod - mvnoMoveMonths)}개월</strong> 사용</li>
                            <li>총 사용 기간: <strong>{totalPeriod}개월</strong> (통신사 {mvnoMoveMonths}개월 + 알뜰폰 {Math.max(0, totalPeriod - mvnoMoveMonths)}개월)</li>
                        </ol>
                    </div>
                );
            default: // 5
                return (
                    <div className="modal-guide">
                        <div className="modal-guide-title">계산 기준</div>
                        <ol className="modal-guide-steps">
                            <li>자급제 채널(쿠팡, 11번가, 애플스토어 등)에서 단말기를 {formatNumber(selfPurchasePrice)}원에 직접 구매</li>
                            <li>처음부터 알뜰폰(MVNO) 요금제({formatNumber(mvnoPlanCost)}원/월) 가입</li>
                            <li>통신사 약정 없이 <strong>{totalPeriod}개월</strong> 자유롭게 사용</li>
                        </ol>
                    </div>
                );
        }
    };

    // --- Modal Logic ---
    const renderModalContent = () => {
        if (activeModal === null) return null;
        const m = results.methods[activeModal - 1];

        switch (activeModal) {
            case 1: // 공시지원금
                return (
                    <>
                        <div className="modal-section">
                            <div className="modal-section-title">단말기 비용</div>
                            <div className="modal-row"><span className="modal-row-label">출고가</span><span className="modal-row-value">{formatNumber(devicePrice)}원</span></div>
                            <div className="modal-row discount"><span className="modal-row-label">공시지원금</span><span className="modal-row-value">-{formatNumber(publicSubsidy)}원</span></div>
                            <div className="modal-row discount"><span className="modal-row-label">추가지원금</span><span className="modal-row-value">-{formatNumber(publicExtraSubsidy)}원</span></div>
                            <div className="modal-row discount"><span className="modal-row-label">판매점 지원금</span><span className="modal-row-value">-{formatNumber(publicStoreSubsidy)}원</span></div>
                            <div className="modal-row subtotal"><span className="modal-row-label">단말기 실구매가</span><span className="modal-row-value">{formatNumber(m.device)}원</span></div>
                        </div>
                        <div className="modal-section">
                            <div className="modal-section-title">요금제 비용 ({totalPeriod}개월)</div>
                            <div className="modal-row">
                                <span className="modal-row-label">고가 요금제 ({m.highMonths}개월)</span>
                                <span className="modal-row-value">{formatNumber(m.highPlan!)}원</span>
                            </div>
                            {publicHighCombineDiscount > 0 && <div className="modal-row discount"><span className="modal-row-label">└ 결합할인</span><span className="modal-row-value">-{formatNumber(publicHighCombineDiscount)}원/월</span></div>}
                            <div className="modal-row">
                                <span className="modal-row-label">저가 요금제 ({m.lowMonths}개월)</span>
                                <span className="modal-row-value">{formatNumber(m.lowPlan!)}원</span>
                            </div>
                            {publicLowCombineDiscount > 0 && <div className="modal-row discount"><span className="modal-row-label">└ 결합할인</span><span className="modal-row-value">-{formatNumber(publicLowCombineDiscount)}원/월</span></div>}
                            <div className="modal-row subtotal"><span className="modal-row-label">요금제 소계</span><span className="modal-row-value">{formatNumber(m.plan)}원</span></div>
                        </div>
                        {m.vasMonths > 0 &&
                            <div className="modal-section">
                                <div className="modal-section-title">부가서비스</div>
                                <div className="modal-row"><span className="modal-row-label">부가서비스 ({m.vasMonths}개월)</span><span className="modal-row-value">{formatNumber(m.vas)}원</span></div>
                            </div>}
                    </>
                );
            case 2:
            case 3: // 선택약정
                return (
                    <>
                        <div className="modal-section">
                            <div className="modal-section-title">단말기 비용</div>
                            <div className="modal-row"><span className="modal-row-label">출고가</span><span className="modal-row-value">{formatNumber(devicePrice)}원</span></div>
                            {activeModal === 3 && <div className="modal-row discount"><span className="modal-row-label">추가지원금 (6개월 조건)</span><span className="modal-row-value">-{formatNumber(selectExtraSubsidy)}원</span></div>}
                            <div className="modal-row discount"><span className="modal-row-label">판매점 지원금</span><span className="modal-row-value">-{formatNumber(selectStoreSubsidy)}원</span></div>
                            <div className="modal-row subtotal"><span className="modal-row-label">단말기 실구매가</span><span className="modal-row-value">{formatNumber(m.device)}원</span></div>
                        </div>
                        <div className="modal-section">
                            <div className="modal-section-title">요금제 비용 (선택약정 {selectDiscountRate}% 할인)</div>
                            <div className="modal-row"><span className="modal-row-label">고가 요금제 ({m.highMonths}개월)</span><span className="modal-row-value">{formatNumber(m.highPlan!)}원</span></div>
                            {selectHighCombineDiscount > 0 && <div className="modal-row discount"><span className="modal-row-label">└ 결합할인</span><span className="modal-row-value">-{formatNumber(selectHighCombineDiscount)}원/월</span></div>}
                            <div className="modal-row"><span className="modal-row-label">저가 요금제 ({m.lowMonths}개월)</span><span className="modal-row-value">{formatNumber(m.lowPlan!)}원</span></div>
                            {selectLowCombineDiscount > 0 && <div className="modal-row discount"><span className="modal-row-label">└ 결합할인</span><span className="modal-row-value">-{formatNumber(selectLowCombineDiscount)}원/월</span></div>}
                            <div className="modal-row subtotal"><span className="modal-row-label">요금제 소계</span><span className="modal-row-value">{formatNumber(m.plan)}원</span></div>
                        </div>
                        {m.vasMonths > 0 && <div className="modal-section"><div className="modal-section-title">부가서비스</div><div className="modal-row"><span className="modal-row-label">부가서비스 ({m.vasMonths}개월)</span><span className="modal-row-value">{formatNumber(m.vas)}원</span></div></div>}
                    </>
                );
            case 4: // 알뜰런
                return (
                    <>
                        <div className="modal-section">
                            <div className="modal-section-title">단말기 비용</div>
                            <div className="modal-row"><span className="modal-row-label">출고가</span><span className="modal-row-value">{formatNumber(devicePrice)}원</span></div>
                            <div className="modal-row discount"><span className="modal-row-label">판매점 지원금</span><span className="modal-row-value">-{formatNumber(selectStoreSubsidy)}원</span></div>
                            <div className="modal-row subtotal"><span className="modal-row-label">단말기 실구매가</span><span className="modal-row-value">{formatNumber(m.device)}원</span></div>
                        </div>
                        <div className="modal-section">
                            <div className="modal-section-title">요금제 비용</div>
                            <div className="modal-row"><span className="modal-row-label">고가 요금제 ({m.highMonths}개월)</span><span className="modal-row-value">{formatNumber(m.highPlan!)}원</span></div>
                            <div className="modal-row"><span className="modal-row-label">저가 요금제 ({m.lowMonths}개월)</span><span className="modal-row-value">{formatNumber(m.lowPlan!)}원</span></div>
                            <div className="modal-row"><span className="modal-row-label">알뜰폰 ({m.mvnoMonths}개월)</span><span className="modal-row-value">{formatNumber(m.mvno!)}원</span></div>
                            <div className="modal-row penalty"><span className="modal-row-label">선택약정 반환금</span><span className="modal-row-value">{formatNumber(m.penalty)}원</span></div>
                            <div className="modal-row"><span className="modal-row-label">유심비</span><span className="modal-row-value">{formatNumber(m.usim)}원</span></div>
                            <div className="modal-row subtotal"><span className="modal-row-label">합계</span><span className="modal-row-value">{formatNumber(m.plan + m.penalty + m.usim)}원</span></div>
                        </div>
                    </>
                );
            default: // 자급제 (5)
                return (
                    <>
                        <div className="modal-section">
                            <div className="modal-section-title">단말기 비용</div>
                            <div className="modal-row"><span className="modal-row-label">자급제 구매가</span><span className="modal-row-value">{formatNumber(selfPurchasePrice)}원</span></div>
                        </div>
                        <div className="modal-section">
                            <div className="modal-section-title">요금제 비용</div>
                            <div className="modal-row"><span className="modal-row-label">알뜰폰 ({totalPeriod}개월)</span><span className="modal-row-value">{formatNumber(m.plan)}원</span></div>
                        </div>
                    </>
                );
        }
    };



    return (
        <div id="calculator">
            {/* 입력 섹션 */}
            <div className="input-section">
                {/* 상단: 항상 열린 기본 설정 (2열) */}
                <div className="input-row-top">
                    <section className="card input-card">
                        <div className="card-header">
                            <h2>단말기 가격</h2>
                        </div>
                        <p className="card-desc">휴대폰 구매비 비교에 필요한 기기 가격을 입력하세요</p>
                        <div className="card-body">
                            <div className="input-row">
                                <InputField label="단말기 출고가" id="devicePrice" value={devicePrice} onChange={setDevicePrice} unit="원" tooltip="통신사 공식 출고가 (SKT/KT/LGU+ 홈페이지 확인)" />
                                <InputField label="자급제 구매가" id="selfPurchasePrice" value={selfPurchasePrice} onChange={setSelfPurchasePrice} unit="원" hint="쿠팡/11번가 등 자급제 가격" tooltip="쿠팡, 11번가, 애플스토어 등 자급제 채널 구매 가격" />
                            </div>
                        </div>
                    </section>

                    <section className="card input-card">
                        <div className="card-header">
                            <h2>비교 기준</h2>
                        </div>
                        <p className="card-desc">휴대폰 요금 계산과 유지비 비교에 공통으로 들어가는 기준값입니다</p>
                        <div className="card-body">
                            <div className="input-row">
                                <InputField label="총 사용 기간" id="totalPeriod" value={totalPeriod} onChange={setTotalPeriod} unit="개월" min={12} max={48} tooltip="단말기를 총 사용할 기간. 보통 24개월 기준으로 비교합니다" />
                                <InputField label="알뜰폰 요금제" id="mvnoPlanCost" value={mvnoPlanCost} onChange={setMvnoPlanCost} unit="원/월" tooltip="알뜰폰(MVNO) 이동 시 사용할 요금제 월 요금" />
                            </div>
                            <div className="input-row">
                                <InputField label="유심/eSIM 비용" id="usimCost" value={usimCost} onChange={setUsimCost} unit="원" tooltip="알뜰폰 이동 시 필요한 유심칩 또는 eSIM 발급 비용" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* 하단: 아코디언 상세 설정 (풀폭 스택) */}
                <div className="input-row-bottom">
                    <section className="card input-card card-public">
                        <div className="card-header" onClick={() => toggleSection('public')}>
                            <h2>공시지원금 시나리오</h2>
                            <span className={`chevron ${openSections.has('public') ? 'open' : ''}`}>▼</span>
                        </div>
                        <p className="card-desc">공시지원금을 적용했을 때의 휴대폰 구매비와 유지비 조건을 입력하세요</p>
                        <div className={`card-body-wrapper ${openSections.has('public') ? 'open' : ''}`}>
                            <div className="card-body">
                                <div className="input-row">
                                    <InputField id="publicSubsidy" label="공시지원금" value={publicSubsidy} onChange={setPublicSubsidy} unit="원" tooltip="통신사가 공시한 단말기 보조금. 요금제에 따라 금액이 다릅니다" />
                                    <InputField id="publicExtraSubsidy" label="추가지원금" value={publicExtraSubsidy} onChange={setPublicExtraSubsidy} unit="원" hint="6개월 이전 해지 시 반환" hintClass="warning" tooltip="공시지원금에 추가 지급되는 보조금. 6개월 이내 해지 시 반환해야 합니다" />
                                </div>
                                <div className="input-row">
                                    <InputField id="publicStoreSubsidy" label="판매점 지원금" value={publicStoreSubsidy} onChange={setPublicStoreSubsidy} unit="원" hint="반환 불필요" tooltip="대리점/매장에서 자체 지원하는 금액. 해지해도 반환 불필요" />
                                    <InputField id="publicMinMonths" label="의무 유지 기간" value={publicMinMonths} onChange={setPublicMinMonths} unit="개월" min={1} max={24} hint="보통 6개월" tooltip="고가 요금제를 반드시 유지해야 하는 최소 기간" />
                                </div>
                                <div className="input-row">
                                    <InputField id="publicPlanCost" label="공시 요금제 (고가)" value={publicPlanCost} onChange={setPublicPlanCost} unit="원/월" hint="의무 유지 기간 동안" tooltip="의무 유지 기간 동안 사용해야 하는 요금제 월 요금" />
                                    <InputField id="publicLowPlanCost" label="이후 요금제 (저가)" value={publicLowPlanCost} onChange={setPublicLowPlanCost} unit="원/월" hint="의무 유지 후 하향 가능" tooltip="의무 유지 후 변경 가능한 저가 요금제 월 요금" />
                                </div>
                                <div className="input-row">
                                    <InputField id="publicVasCost" label="부가서비스 금액" value={publicVasCost} onChange={setPublicVasCost} unit="원/월" hint="의무 가입 부가서비스" tooltip="가입 시 필수 가입 부가서비스의 월 요금 (보험, 멤버십 등)" />
                                    <InputField id="publicVasMonths" label="부가서비스 유지 기간" value={publicVasMonths} onChange={setPublicVasMonths} unit="개월" min={0} max={24} tooltip="부가서비스를 유지해야 하는 최소 기간. 이후 해지 가능" />
                                </div>
                                <div className="input-row">
                                    <InputField id="publicHighCombineDiscount" label="결합할인 (고가)" value={publicHighCombineDiscount} onChange={setPublicHighCombineDiscount} unit="원/월" hint="고가 요금제 결합할인" tooltip="인터넷/TV 결합 시 고가 요금제에서 할인되는 월 금액" />
                                    <InputField id="publicLowCombineDiscount" label="결합할인 (저가)" value={publicLowCombineDiscount} onChange={setPublicLowCombineDiscount} unit="원/월" hint="저가 요금제 결합할인" tooltip="인터넷/TV 결합 시 저가 요금제에서 할인되는 월 금액" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card input-card card-select">
                        <div className="card-header" onClick={() => toggleSection('select')}>
                            <h2>선택약정 · 알뜰런 시나리오</h2>
                            <span className={`chevron ${openSections.has('select') ? 'open' : ''}`}>▼</span>
                        </div>
                        <p className="card-desc">선택약정 유지 비용과 알뜰런 이동 비용을 함께 비교할 수 있는 조건입니다</p>
                        <div className={`card-body-wrapper ${openSections.has('select') ? 'open' : ''}`}>
                            <div className="card-body">
                                <div className="input-row">
                                    <InputField id="selectExtraSubsidy" label="추가지원금" value={selectExtraSubsidy} onChange={setSelectExtraSubsidy} unit="원" hint="6개월 이전 해지 시 반환" hintClass="warning" tooltip="추가 지급 보조금. 6개월 이내 해지 시 반환 필요" />
                                    <InputField id="selectStoreSubsidy" label="판매점 지원금" value={selectStoreSubsidy} onChange={setSelectStoreSubsidy} unit="원" hint="반환 불필요" tooltip="대리점/매장 자체 지원금. 해지해도 반환 불필요" />
                                </div>
                                <div className="input-row">
                                    <InputField id="selectDiscountRate" label="선택약정 할인율" value={selectDiscountRate} onChange={setSelectDiscountRate} unit="%" tooltip="선택약정 시 요금제에서 할인받는 비율. 보통 25%" />
                                    <InputField id="selectMinMonths" label="의무 유지 기간" value={selectMinMonths} onChange={setSelectMinMonths} unit="개월" min={1} max={24} hint="요금제 유지 필수 기간" tooltip="선택약정 요금제를 유지해야 하는 최소 기간" />
                                </div>
                                <div className="input-row">
                                    <InputField id="selectPlanCost" label="선택약정 요금제 (고가)" value={selectPlanCost} onChange={setSelectPlanCost} unit="원/월" hint="의무 유지 기간 동안 요금제" tooltip="선택약정 할인이 적용되는 고가 요금제 월 요금" />
                                    <InputField id="selectLowPlanCost" label="이후 요금제 (저가)" value={selectLowPlanCost} onChange={setSelectLowPlanCost} unit="원/월" hint="의무 유지 후 변경 가능한 요금제" tooltip="의무 유지 후 변경 가능한 저가 요금제 월 요금" />
                                </div>
                                <div className="input-row">
                                    <InputField id="selectVasCost" label="부가서비스 금액" value={selectVasCost} onChange={setSelectVasCost} unit="원/월" hint="의무 가입 부가서비스" tooltip="필수 가입 부가서비스 월 요금" />
                                    <InputField id="selectVasMonths" label="부가서비스 유지 기간" value={selectVasMonths} onChange={setSelectVasMonths} unit="개월" min={0} max={24} tooltip="부가서비스 최소 유지 기간" />
                                </div>
                                <div className="input-row">
                                    <InputField id="selectHighCombineDiscount" label="결합할인 (고가)" value={selectHighCombineDiscount} onChange={setSelectHighCombineDiscount} unit="원/월" hint="고가 요금제 결합할인" tooltip="인터넷/TV 결합 시 고가 요금제 할인 월 금액" />
                                    <InputField id="selectLowCombineDiscount" label="결합할인 (저가)" value={selectLowCombineDiscount} onChange={setSelectLowCombineDiscount} unit="원/월" hint="저가 요금제 결합할인" tooltip="인터넷/TV 결합 시 저가 요금제 할인 월 금액" />
                                </div>
                                <div className="input-row">
                                    <InputField id="mvnoMoveMonths" label="알뜰런 이동 시점" value={mvnoMoveMonths} onChange={setMvnoMoveMonths} unit="개월 후" min={1} max={24} hint="이 기간 후 알뜰폰 이동" tooltip="선택약정 후 몇 개월 뒤 알뜰폰으로 이동할지 설정. 최적 타이밍은 하단 차트에서 확인" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Ad Placeholder */}
            {/* <div className="ad-section">...</div> */}

            {/* Phase 8: Disclaimer banner */}
            <div className="disclaimer-banner">
                <span className="disclaimer-icon">안내</span>
                <span>입력값에 따라 휴대폰 요금과 유지비 결과가 달라집니다. 공시지원금과 선택약정 조건을 함께 넣어야 비교가 더 정확해집니다.</span>
            </div>

            {/* 5가지 방식 비교 */}
            <section className="comparison-section" ref={comparisonRef}>
                <h2 className="section-title">휴대폰 총비용 비교</h2>
                <div className="comparison-cards">
                    {results.methods.map((m, i) => (
                        <div key={i} className={`method-card ${m.rank === 1 ? 'best' : ''} ${m.rank === 2 ? 'featured' : ''} ${flashCards.has(i) ? 'result-updated' : ''}`}>
                            <div className="method-header">
                                <div className="method-rank">{m.rank}</div>
                                <div className={`method-badge ${m.badge?.class}`}>{m.badge?.text}</div>
                            </div>
                            <h3 className="method-title">{methodNames[i]}</h3>
                            <p className="method-desc">
                                {i === 0 && `공시지원금을 적용한 뒤 ${totalPeriod}개월 동안 사용하는 기준`}
                                {i === 1 && `선택약정 ${selectDiscountRate}% 할인 기준으로 ${totalPeriod}개월 유지`}
                                {i === 2 && `추가지원금을 포함한 선택약정 시나리오 비교`}
                                {i === 3 && `${mvnoMoveMonths}개월 후 알뜰폰으로 이동하는 알뜰런 시나리오`}
                                {i === 4 && `자급제 구매 후 알뜰폰 요금제를 바로 쓰는 기준`}
                            </p>
                            <div className="method-total">
                                <span className="total-label">총 비용</span>
                                <span className="total-value">{formatNumber(m.total)}원</span>
                            </div>
                            <div className="method-monthly">
                                <span className="monthly-label">월 평균</span>
                                <span className="monthly-value">{formatNumber(m.monthly)}원</span>
                            </div>
                            <button className="detail-btn" onClick={() => setActiveModal(i + 1)}>비용 내역 보기</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 절약 금액 요약 */}
            <section className="savings-section">
                <div className="savings-grid">
                    <div className="savings-item best">
                        <div className="savings-content">
                            <span className="savings-label">가장 낮은 총비용</span>
                            <span className="savings-method">{methodNames[results.bestIndex]}</span>
                        </div>
                    </div>
                    <div className="savings-item">
                        <div className="savings-content">
                            <span className="savings-label">공시지원금 대비 차이</span>
                            <span className="savings-amount">{formatNumber(results.savings)}원</span>
                        </div>
                    </div>
                    <div className="savings-item">
                        <div className="savings-content">
                            <span className="savings-label">절감 비율</span>
                            <span className="savings-percent">{results.savingsPercent.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 타이밍 분석 */}
            <section className="card timing-card">
                <div className="card-header"><h2>알뜰런 이동 시점 비교</h2></div>
                <div className="card-body">
                    <p className="timing-desc">선택약정 후 알뜰폰으로 옮기는 시점에 따라 휴대폰 총비용이 어떻게 달라지는지 확인합니다.</p>
                    <div className="timing-chart">
                        {results.timing.costs.map((c) => (
                            <div key={c.month}
                                className={`timing-bar ${c.month === results.timing.optimalMonth ? 'optimal' : Math.abs(c.total - results.timing.minCost) < results.timing.minCost * 0.02 ? 'good' : ''}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => setMvnoMoveMonths(c.month)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMvnoMoveMonths(c.month); } }}
                                aria-label={`${c.month}개월 유지 시 총 ${formatNumber(c.total)}원`}
                            >
                                <span className="month">{c.month}개월</span>
                                <span className="cost">{Math.round(c.monthly / 1000)}K</span>
                            </div>
                        ))}
                    </div>
                    <div className="timing-recommendation">
                        <span className="rec-text">{results.timing.optimalMonth}개월 유지 후 이동했을 때 총비용이 가장 낮습니다. (총 {formatNumber(results.timing.minCost)}원)</span>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <div className={`modal-overlay ${activeModal ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null); }}>
                {activeModal && (
                    <div className="modal" ref={modalRef} role="dialog" aria-modal="true" tabIndex={-1}>
                        <div className="modal-header">
                            <h3 className="modal-title">{methodNames[activeModal - 1]} 상세 내역</h3>
                            <button className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            {renderModalGuide()}
                            {renderModalContent()}
                        </div>
                        <div className="modal-footer">
                            <div className="modal-total"><span>총 비용</span><span className="modal-total-value">{formatNumber(results.methods[activeModal - 1].total)}원</span></div>
                            <div className="modal-monthly"><span>월 평균</span><span className="modal-monthly-value">{formatNumber(results.methods[activeModal - 1].monthly)}원</span></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Phase 5: Sticky summary bar */}
            {showStickyBar && (
                <div className="sticky-summary">
                    <div className="sticky-summary-content">
                        <div className="sticky-best">
                            <span className="sticky-label">최적</span>
                            <span className="sticky-method">{methodNames[results.bestIndex]}</span>
                        </div>
                        <div className="sticky-cost">
                            <span className="sticky-total">{formatNumber(results.methods[results.bestIndex].total)}원</span>
                            <span className="sticky-monthly">월 {formatNumber(results.methods[results.bestIndex].monthly)}원</span>
                        </div>
                        <button className="sticky-btn" onClick={scrollToResults}>결과 보기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Input Component
interface InputFieldProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    unit: string;
    id?: string;
    min?: number;
    max?: number;
    hint?: string;
    hintClass?: string;
    tooltip?: string;
}

function InputField({ label, value, onChange, unit, id, min, max, hint, hintClass, tooltip }: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState(() => formatInputThousands(value));

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatInputThousands(value));
        }
    }, [value, isFocused]);

    const handleFocus = () => {
        setIsFocused(true);
        setDisplayValue(String(value));
    };

    const handleBlur = () => {
        setIsFocused(false);
        setDisplayValue(formatInputThousands(value));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setDisplayValue(raw);
        const num = Number(raw);
        if (!isNaN(num)) {
            onChange(min !== undefined ? Math.max(min, max !== undefined ? Math.min(max, num) : num) : max !== undefined ? Math.min(max, num) : num);
        }
    };

    return (
        <div className="input-group">
            <label htmlFor={id}>
                {label}
                {tooltip && (
                    <span className="tooltip-wrap">
                        <span className="tooltip-icon">i</span>
                        <span className="tooltip-text">{tooltip}</span>
                    </span>
                )}
            </label>
            <div className="input-wrapper">
                <input
                    type="text"
                    inputMode="numeric"
                    id={id}
                    value={displayValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <span className="unit">{unit}</span>
            </div>
            {hint && <span className={`hint ${hintClass || ''}`}>{hint}</span>}
        </div>
    );
}
