export type SeontaekContractMonths = 12 | 24;

export interface SeontaekPenaltyInputs {
    monthlyBase: number;
    discountRate: number;
    contractMonths: SeontaekContractMonths;
    monthsUsed: number;
}

export function calculateSeontaekPenalty({
    monthlyBase,
    discountRate,
    contractMonths,
    monthsUsed,
}: SeontaekPenaltyInputs): number {
    const used = Math.max(0, Math.min(monthsUsed, contractMonths));
    const rate = Math.max(0, discountRate) / 100;
    const receivedDiscount = monthlyBase * rate * used;

    const fullRepayment =
        (contractMonths === 12 && used <= 3) ||
        (contractMonths === 24 && used <= 6);

    if (fullRepayment) {
        return receivedDiscount;
    }

    const remainingMonths = Math.max(0, contractMonths - used);
    return receivedDiscount * (remainingMonths / contractMonths);
}
