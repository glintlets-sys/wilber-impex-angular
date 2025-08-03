// TODO i will give API for this. 
export enum CouponDefinition {
    OneTimePercentDiscount = "OneTimePercentDiscount",
    FlatDiscountCoupon = "FlatDiscountCoupon",
    CartAmountBasedCoupon = "CartAmountBasedCoupon"
}

export interface OneTimePercentDiscount {
    couponCode?: string;
    couponDefinition?: CouponDefinition;
    startDate?: string;
    numOfDays?: number;
    discountPercent?: number;
}

export interface FlatDiscountCoupon {
    couponCode?: string;
    couponDefinition?: CouponDefinition;
    startDate?: string;
    numOfDays?: number;
    percentDiscount?: boolean,
    minOrder: number,
    discountAmount?: number
}

export interface CartAmountBasedCoupon {
    couponCode?: string;
    couponDefinition?: CouponDefinition;
    startDate?: string;
    numOfDays?: number;
    percentDiscount?: boolean;
    discountLimits?: Record<number, number>;
}

export interface Coupon {
    id?: number;
    couponType: string;
    couponCode: string;
    description: string | null;
    active: boolean;
    startDate: string;
    endDate: string;
    couponBenefits: CouponBenefit[];
    usageLimits: UsageLimits;
    couponDefinition: CouponDefinition;
}

export interface CouponBenefit {
    benefitType: string;
    minimumCartAmountForCoupon: number;
    discountAmount: number;
    discountPercent: number;
    percentDiscount: boolean;
    amountDiscount: boolean;
}

export interface UsageLimits {
    oneTimeUsePerUser: boolean;
    allowAllUsers: boolean;
    allowAllItems: boolean;
    maxQuantityAllowedPerItem: number;
    canBeApplyAboveItemDiscount: boolean;
    minPurchaseAmountLimit: number;
    usageCountRestricted: boolean;
    maxNumberOfTimesCouponCanBeUsed: number;
    maxDiscountAmountAllocatedForThisCoupon: number;
}

export interface CouponRequest {
    couponCode: string;
    userId: number;
    itemIds: number[];
}

export interface CouponApplicationResponse {
    success: boolean;
    discountAmount: number;
    cartAmount: number;
    message: string;
    couponUsageId: number;
}
