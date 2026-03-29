/** Point of interest at a port */
export interface PointOfInterest {
  name: string;
  type: "restaurant" | "beach" | "landmark" | "shop" | "activity";
  coordinates: { lat: number; lng: number };
  description: string;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  walkingTimeFromTerminal?: number;
  tips?: string[];
}

/** Excursion category */
export interface ExcursionCategory {
  name: string;
  slug: string;
  priceRange: { min: number; max: number };
  typicalDuration: string;
  description: string;
}

/** Full port data */
export interface Port {
  slug: string;
  name: string;
  country: string;
  island?: string;
  coordinates: { lat: number; lng: number };
  terminalCoordinates: { lat: number; lng: number };
  timezone: string;
  currency: string;
  usdAccepted: boolean;
  safetyRating: number;
  walkabilityRating: number;
  wifiAvailability: "none" | "limited" | "good" | "excellent";
  cellularCoverage: "none" | "limited" | "good" | "excellent";
  isTenderPort: boolean;
  typicalPortHours: number;
  walkingDistanceToTown: string;
  overview: string;
  gettingAround: string;
  tips: string[];
  restaurants: PointOfInterest[];
  beaches: PointOfInterest[];
  landmarks: PointOfInterest[];
  excursionCategories: ExcursionCategory[];
  freeActivities: {
    name: string;
    description: string;
    walkingTime: number;
  }[];
  emergencyInfo: {
    police: string;
    hospital: string;
    usConsulate?: string;
  };
  annualCruiseVisitors?: number;
}
