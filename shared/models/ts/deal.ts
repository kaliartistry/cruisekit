/**
 * A canonical cruise deal/promotion record. Independent from Sailing — a deal may apply to
 * many sailings (applicableSailingIds).
 */
export interface Deal {
    affiliateLink?: null | string;
    /**
     * Optional join: Sailing.id values this deal explicitly applies to. Empty array means 'see
     * source page for eligible sailings'.
     */
    applicableSailingIds: string[];
    /**
     * Last date the deal can be booked.
     */
    bookingEndDate: string;
    /**
     * First date the deal can be booked.
     */
    bookingStartDate: string;
    confidence:       Confidence;
    createdAt: string;
    cruiseLine:       CruiseLine;
    dealType:         DealType;
    /**
     * 1–3 sentence plain-English summary of what the deal does.
     */
    description: string;
    /**
     * Required. Cruise-line URL where the deal is published.
     */
    directLink: string;
    /**
     * Plain-English exclusion list, e.g. ['Suites excluded', 'Not combinable with Casino
     * offers'].
     */
    exclusions: string[];
    /**
     * Stable unique identifier. Convention: <cruiseLine>-deal-<slug>.
     */
    id: string;
    /**
     * Plain-English perk list, e.g. ['Drink package', 'WiFi', '$200 OBC'].
     */
    includedPerks: string[];
    lastVerified: string;
    /**
     * Optional booking-flow promo code, when applicable.
     */
    promoCode?: null | string;
    /**
     * Latest sailing departure the deal applies to.
     */
    sailingEndDate: string;
    /**
     * Earliest sailing departure the deal applies to.
     */
    sailingStartDate: string;
    source:           SourceMetadata;
    sourceUrl:        string;
    /**
     * Headline as published, e.g. 'Black Friday: Up to 60% off second guest'.
     */
    title:     string;
    updatedAt: string;
}

export enum Confidence {
    EditorialOnly = "editorial_only",
    InternalDoNotPublish = "internal_do_not_publish",
    ItineraryVerifiedPriceCheckRequired = "itinerary_verified_price_check_required",
    VerifiedFromCruiseLine = "verified_from_cruise_line",
}

export enum CruiseLine {
    Carnival = "carnival",
    Celebrity = "celebrity",
    Disney = "disney",
    HollandAmerica = "holland-america",
    Msc = "msc",
    Norwegian = "norwegian",
    Princess = "princess",
    RoyalCaribbean = "royal-caribbean",
    VirginVoyages = "virgin-voyages",
}

export enum DealType {
    BundledPackage = "bundled-package",
    FreePerk = "free-perk",
    KidsSailFree = "kids-sail-free",
    OnboardCredit = "onboard-credit",
    PercentOffFare = "percent-off-fare",
    PromoCode = "promo-code",
    ReducedDeposit = "reduced-deposit",
    SecondGuestDiscount = "second-guest-discount",
}

export interface SourceMetadata {
    advertiserName?:   null | string;
    affiliateNetwork?: null | string;
    confidence:        Confidence;
    lastImported: string;
    lastVerified: string;
    provider:          string;
    sourceType:        SourceType;
    sourceUrl:         string;
    termsNotes?:       null | string;
}

export enum SourceType {
    AffiliateFeed = "affiliate-feed",
    CruiseLineWebsite = "cruise-line-website",
    ManualEditorial = "manual-editorial",
    PressRelease = "press-release",
}
