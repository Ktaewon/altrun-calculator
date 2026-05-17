export interface PhoneCalculationInputs {
    devicePrice: number;
    selfPurchasePrice: number;
    totalPeriod: number;
    mvnoPlanCost: number;
    usimCost: number;
    publicSubsidy: number;
    publicExtraSubsidy: number;
    publicStoreSubsidy: number;
    publicPlanCost: number;
    publicLowPlanCost: number;
    publicMinMonths: number;
    publicVasCost: number;
    publicVasMonths: number;
    publicHighCombineDiscount: number;
    publicLowCombineDiscount: number;
    selectExtraSubsidy: number;
    selectStoreSubsidy: number;
    selectDiscountRate: number;
    selectMinMonths: number;
    selectPlanCost: number;
    selectLowPlanCost: number;
    selectVasCost: number;
    selectVasMonths: number;
    selectHighCombineDiscount: number;
    selectLowCombineDiscount: number;
    mvnoMoveMonths: number;
}

export interface CalculationResult {
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
    carrier?: number;
    carrierMonths?: number;
}

export interface MethodResult extends CalculationResult {
    rank?: number;
    badge?: { class: string; text: string };
}

export interface PhoneCalculationOutput {
    methods: MethodResult[];
    savings: number;
    savingsPercent: number;
    bestIndex: number;
    timing: {
        costs: Array<{ month: number; total: number; monthly: number }>;
        optimalMonth: number;
        minCost: number;
    };
}

export const methodNames = ['공시지원금', '선택약정', '선택약정+추가지원금', '선택약정+알뜰런', '자급제+알뜰폰'];

export const defaultPhoneCalculationInputs: PhoneCalculationInputs = {
    devicePrice: 1500000,
    selfPurchasePrice: 1350000,
    totalPeriod: 24,
    mvnoPlanCost: 15000,
    usimCost: 5000,
    publicSubsidy: 300000,
    publicExtraSubsidy: 200000,
    publicStoreSubsidy: 100000,
    publicPlanCost: 85000,
    publicLowPlanCost: 55000,
    publicMinMonths: 6,
    publicVasCost: 15000,
    publicVasMonths: 3,
    publicHighCombineDiscount: 0,
    publicLowCombineDiscount: 0,
    selectExtraSubsidy: 200000,
    selectStoreSubsidy: 150000,
    selectDiscountRate: 25,
    selectMinMonths: 6,
    selectPlanCost: 69000,
    selectLowPlanCost: 45000,
    selectVasCost: 10000,
    selectVasMonths: 2,
    selectHighCombineDiscount: 0,
    selectLowCombineDiscount: 0,
    mvnoMoveMonths: 6,
};

export function formatNumber(num: number): string {
    return Math.round(num).toLocaleString('ko-KR');
}

export function getMethodDescription(index: number, inputs: PhoneCalculationInputs): string {
    if (index === 0) return `공시지원금을 적용한 뒤 ${inputs.totalPeriod}개월 동안 사용하는 기준`;
    if (index === 1) return `선택약정 ${inputs.selectDiscountRate}% 할인 기준으로 ${inputs.totalPeriod}개월 유지`;
    if (index === 2) return '추가지원금을 포함한 선택약정 시나리오 비교';
    if (index === 3) return `${inputs.mvnoMoveMonths}개월 후 알뜰폰으로 이동하는 알뜰런 시나리오`;
    return '자급제 구매 후 알뜰폰 요금제를 바로 쓰는 기준';
}

export function calculatePhoneCosts(inputs: PhoneCalculationInputs): PhoneCalculationOutput {
    const {
        devicePrice,
        selfPurchasePrice,
        totalPeriod,
        mvnoPlanCost,
        usimCost,
        publicSubsidy,
        publicExtraSubsidy,
        publicStoreSubsidy,
        publicPlanCost,
        publicLowPlanCost,
        publicMinMonths,
        publicVasCost,
        publicVasMonths,
        publicHighCombineDiscount,
        publicLowCombineDiscount,
        selectExtraSubsidy,
        selectStoreSubsidy,
        selectDiscountRate,
        selectMinMonths,
        selectPlanCost,
        selectLowPlanCost,
        selectVasCost,
        selectVasMonths,
        selectHighCombineDiscount,
        selectLowCombineDiscount,
        mvnoMoveMonths,
    } = inputs;

    const safePeriod = Math.max(1, totalPeriod);

    const calculatePublicSubsidy = (): CalculationResult => {
        const deviceCost = Math.max(0, devicePrice - publicSubsidy - publicExtraSubsidy - publicStoreSubsidy);
        const highPlanMonthly = publicPlanCost - publicHighCombineDiscount;
        const highPlanTotal = highPlanMonthly * publicMinMonths;
        const remainingMonths = Math.max(0, safePeriod - publicMinMonths);
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
            monthly: total / safePeriod,
        };
    };

    const calculateSelectContract = (extraSubsidy: number, minMonthsOverride?: number): CalculationResult => {
        const minMonths = minMonthsOverride || selectMinMonths;
        const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy - extraSubsidy);
        const discountDec = selectDiscountRate / 100;
        const discountedHighPlan = selectPlanCost * (1 - discountDec) - selectHighCombineDiscount;
        const highPlanTotal = discountedHighPlan * minMonths;
        const remainingMonths = Math.max(0, safePeriod - minMonths);
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
            monthly: total / safePeriod,
        };
    };

    const calculateSelectMvno = (moveMonths: number): CalculationResult => {
        const discountDec = selectDiscountRate / 100;
        const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy);
        const discountedHighPlan = selectPlanCost * (1 - discountDec) - selectHighCombineDiscount;
        const highPlanMonths = Math.min(selectMinMonths, moveMonths);
        const highPlanTotal = discountedHighPlan * highPlanMonths;
        const discountedLowPlan = selectLowPlanCost * (1 - discountDec) - selectLowCombineDiscount;
        const lowPlanMonths = Math.max(0, moveMonths - selectMinMonths);
        const lowPlanTotal = discountedLowPlan * lowPlanMonths;
        const combineDiscountTotal = (selectHighCombineDiscount * highPlanMonths) + (selectLowCombineDiscount * lowPlanMonths);
        const carrierTotal = highPlanTotal + lowPlanTotal;
        const mvnoMonths = Math.max(0, safePeriod - moveMonths);
        const mvnoTotal = mvnoPlanCost * mvnoMonths;
        const actualVasMonths = Math.min(selectVasMonths, moveMonths);
        const vasTotal = selectVasCost * actualVasMonths;
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
            monthly: total / safePeriod,
            carrierMonths: moveMonths,
            mvnoMonths,
        };
    };

    const calculateSelfMvno = (): CalculationResult => {
        const deviceCost = selfPurchasePrice;
        const planTotal = mvnoPlanCost * safePeriod;
        const total = deviceCost + planTotal;

        return {
            device: deviceCost,
            plan: planTotal,
            penalty: 0,
            usim: 0,
            vas: 0,
            vasMonths: 0,
            total,
            monthly: total / safePeriod,
        };
    };

    const methods: MethodResult[] = [
        { ...calculatePublicSubsidy() },
        { ...calculateSelectContract(0) },
        { ...calculateSelectContract(selectExtraSubsidy, 6) },
        { ...calculateSelectMvno(mvnoMoveMonths) },
        { ...calculateSelfMvno() },
    ];

    const sorted = methods.map((method, index) => ({ index, total: method.total })).sort((a, b) => a.total - b.total);
    const rankingMap = new Map<number, number>();
    sorted.forEach((item, rank) => rankingMap.set(item.index, rank + 1));

    const badgeConfigs: Record<number, { class: string; text: string }> = {
        1: { class: 'badge-primary', text: '가장 낮음' },
        2: { class: 'badge-success', text: '대안' },
        3: { class: 'badge-warning', text: '비교 필요' },
        4: { class: 'badge-warning', text: '비교 필요' },
        5: { class: 'badge-danger', text: '비용 높음' },
    };

    const finalMethods = methods.map((method, index) => {
        const rank = rankingMap.get(index) ?? 5;
        return {
            ...method,
            rank,
            badge: badgeConfigs[rank],
        };
    });

    const bestMethod = sorted[0];
    const savings = methods[0].total - bestMethod.total;
    const savingsPercent = methods[0].total > 0 ? (savings / methods[0].total) * 100 : 0;

    let minCost = Infinity;
    let optimalMonth = 1;
    const timingCosts = [];
    for (let month = 1; month <= 12; month++) {
        const result = calculateSelectMvno(month);
        timingCosts.push({ month, total: result.total, monthly: result.monthly });
        if (result.total < minCost) {
            minCost = result.total;
            optimalMonth = month;
        }
    }

    return {
        methods: finalMethods,
        savings,
        savingsPercent,
        bestIndex: bestMethod.index,
        timing: { costs: timingCosts, optimalMonth, minCost },
    };
}
