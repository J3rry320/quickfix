export interface BrandItem {
  _id?: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isPopular?: boolean;
}

export interface ServicePricingItem {
  service:
    | {
        _id?: string;
        name: string;
        slug?: string;
        startingPrice?: number;
        warrantyDays?: number;
      }
    | string;
  price: number;
  estimatedTimeMinutes?: number;
}

export interface ModelItem {
  _id?: string;
  name: string;
  slug: string;
  imageUrl?: string;
  releaseYear?: number;
  isPopular?: boolean;
  servicePricing?: ServicePricingItem[];
}

export interface ServiceItem {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  startingPrice: number;
  estimatedTimeMinutes: number;
  warrantyDays: number;
  isPopular?: boolean;
  commonIssues?: string[];
}

export interface BookingSuccessData {
  bookingReference: string;
  message: string;
  slotDate?: string;
  timeSlot?: string;
}

export interface QuickSlot {
  id: string;
  dateOffset: number;
  slot: string;
  label: string;
  sub: string;
}

export interface BookingFormData {
  brand: string;
  model: string;
  issueDescription: string;
  additionalNotes?: string;
  serviceMode: "doorstep" | "pickup_drop" | "walk_in";
  date: string;
  timeSlot: string;
  area: string;
  streetAddress: string;
  pincode: string;
  name: string;
  phone: string;
}
