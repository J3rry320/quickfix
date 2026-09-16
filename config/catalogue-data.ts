/**
 * Centralized SEO & Catalogue Data for QuickFixMobile.in (Pune)
 *
 * NOTE: Services, Brands, and Models are dynamically loaded from MongoDB.
 * Only Localities are loaded from config (config/localities.json).
 */

import localitiesData from "./localities.json";

export interface LocalityItem {
  slug: string;
  name: string;
  zone: string;
  dispatchTime: string;
  pincode: string;
  landmark: string;
  popularNeighborhoods: string[];
}

export const LOCALITIES_CATALOG: LocalityItem[] =
  localitiesData as LocalityItem[];

// Note: Database queries and models are strictly in @/lib/db/catalogue (server-only).
// This config file contains only client-safe static metadata and process definitions.

/** Standard 4-step doorstep pickup and lab repair process across Pune */
export const STANDARD_REPAIR_PROCESS = [
  {
    step: "01",
    title: "Schedule Doorstep Pickup",
    desc: "Pick your brand, device model, and preferred doorstep pickup slot anywhere in Pune.",
  },
  {
    step: "02",
    title: "Verified Device Pickup",
    desc: "A background-verified technician arrives, inspects physical condition, and issues an official handover receipt.",
  },
  {
    step: "03",
    title: "Certified Lab Repair",
    desc: "Your phone is serviced in our central Pune ESD-safe lab with genuine OEM parts and zero passcode access.",
  },
  {
    step: "04",
    title: "Doorstep Return & Pay",
    desc: "Delivered back to your doorstep the same day. Test touch, display, and features personally before paying.",
  },
];
