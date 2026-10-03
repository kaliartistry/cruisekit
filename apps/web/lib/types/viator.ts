/* ------------------------------------------------------------------ */
/*  Viator Product Types                                               */
/*  Subset of Viator Partner API v2.0 response shapes.                 */
/* ------------------------------------------------------------------ */

export interface ViatorProduct {
  productCode: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  rating: number;
  reviewCount: number;
  duration: string | null;
  pricingFrom: number | null;
  currency: string;
  productUrl: string;           // Pre-attributed affiliate link — do NOT modify
  bookingQuestions?: string[];
}

export interface ViatorSearchResponse {
  products: ViatorProduct[];
  totalCount: number;
  portSlug: string;
}
