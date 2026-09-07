/**
 * QuickFix.in - Seed Data Script
 *
 * Populates MongoDB with rich, SEO-ready, user-friendly data for:
 * - 14 Comprehensive Smartphone Repair Services (Screen, Battery, Port, Back Glass, Camera, Camera Glass, Speaker/Mic, Motherboard, Water Damage, Buttons, Face ID/Biometrics, Housing/Chassis, Vibration, Software)
 * - 12 Major Smartphone Brands in India (Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Google Pixel, Realme, Motorola, Nothing, iQOO, Poco)
 * - 150+ Popular Device Models with authentic tier-based Indian market pricing estimates.
 *
 * Safe to re-run: Uses upsert (findOneAndUpdate with upsert: true) to avoid duplicate entries.
 *
 * Usage:
 *   MONGODB_URI="your_connection_string" npx tsx scripts/seed-data.ts
 *   OR
 *   npm run seed:data
 */

import mongoose from "mongoose";
import { connectDb } from "@/lib/mongodb";
import { Brand, RepairService, DeviceModel } from "@/models";

// ============================================================================
// 1. REPAIR SERVICES (SEO-Optimized, User-Friendly Descriptions & Pune SLAs)
// ============================================================================
const SERVICES_DATA = [
  {
    name: "Touchscreen & OLED Display Replacement",
    slug: "screen-replacement",
    description:
      "Fix cracked outer glass, unresponsive touch, vertical green lines, bleeding pixels, or completely black displays. Installed in 30 minutes at your doorstep with high-refresh rate OEM grade OLED and LCD panels.",
    estimatedTimeMinutes: 30,
    startingPrice: 1499,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Cracked or shattered outer glass",
      "Touch screen unresponsive or ghost touches",
      "Green or white vertical lines on display",
      "Black spots or ink bleed on OLED screen",
      "Flickering or completely blank display",
    ],
  },
  {
    name: "Battery Replacement & Health Restoration",
    slug: "battery-replacement",
    description:
      "Solve rapid battery drain, sudden phone shutdowns at 20%, overheating during charging, or swollen battery back covers. High-capacity certified lithium-ion cells restored to 100% health in 20 minutes.",
    estimatedTimeMinutes: 25,
    startingPrice: 999,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Battery health degraded below 80%",
      "Phone shutting down unexpectedly under load",
      "Battery draining completely in 3 to 4 hours",
      "Back cover lifting due to swollen battery cell",
      "Phone getting unusually hot while charging",
    ],
  },
  {
    name: "Charging Port & Flex Cable Repair",
    slug: "charging-port-repair",
    description:
      "Resolve loose USB Type-C and Lightning port connections, slow charging warnings, moisture detected errors, or intermittent power supply with genuine replacement charging flex boards.",
    estimatedTimeMinutes: 30,
    startingPrice: 699,
    warrantyDays: 90,
    isPopular: true,
    commonIssues: [
      "Cable needs to be held at an angle to charge",
      "Phone not detecting charger or fast charging protocols",
      "Persistent 'Moisture detected in charging port' alert",
      "Debris or broken pins inside USB-C / Lightning socket",
      "Phone not connecting to PC or Mac for data transfer",
    ],
  },
  {
    name: "Back Glass & Frame Restoration",
    slug: "back-glass-repair",
    description:
      "Laser debonding removal and precision replacement of shattered rear glass panels and camera bump rings. Factory-grade adhesive seal restores smooth tactile feel and dust/moisture resistance.",
    estimatedTimeMinutes: 45,
    startingPrice: 999,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Spiderweb cracks on rear glass panel",
      "Chipped glass around camera island",
      "Loose back panel peeling off the chassis",
      "Sharp broken glass edges risking finger cuts",
    ],
  },
  {
    name: "Front & Rear Camera Module Repair",
    slug: "camera-repair",
    description:
      "Repair blurry autofocus, optical image stabilization (OIS) buzzing or vibration, black screen sensor failure, and damaged selfie or telephoto sensors with genuine OEM sensor modules.",
    estimatedTimeMinutes: 35,
    startingPrice: 1199,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Camera app shows completely black screen",
      "Rear camera lens vibrating or buzzing continuously",
      "Autofocus fails to lock on close or distant objects",
      "Permanent purple flare or spots on captured photos",
      "Front selfie camera not recognized or blurred",
    ],
  },
  {
    name: "Camera Glass & Lens Protector Replacement",
    slug: "camera-glass-replacement",
    description:
      "Quick outer camera sapphire glass replacement when the camera module is intact but the protective outer lens is scratched or cracked. Restores crystal-clear photo clarity in 20 minutes.",
    estimatedTimeMinutes: 20,
    startingPrice: 499,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Cracked outer circular camera protective glass",
      "Scratched camera lens causing foggy or hazy pictures",
      "Missing camera lens glass exposing internal sensor to dust",
      "Glared reflections when taking night photos",
    ],
  },
  {
    name: "Earpiece Speaker & Microphone Repair",
    slug: "speaker-mic-repair",
    description:
      "Fix muffled in-call audio, distorted bottom speaker output, crackling sounds at high volume, or callers unable to hear your voice due to damaged microphone flex cables or clogged mesh.",
    estimatedTimeMinutes: 30,
    startingPrice: 699,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Cannot hear callers unless switched to loudspeaker",
      "Callers complain your voice sounds muffled or distant",
      "Bottom loudspeaker crackles on ringtones or music",
      "Microphone fails to record audio in WhatsApp voice notes",
    ],
  },
  {
    name: "Motherboard & Chip-Level Micro-Soldering",
    slug: "motherboard-repair",
    description:
      "Advanced micro-soldering for phones with power IC failures, short circuits, charging loop issues, or CPU/eMMC reballing. Diagnosed and repaired by master technicians in our static-controlled lab.",
    estimatedTimeMinutes: 60,
    startingPrice: 1999,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone completely dead and drawing zero current",
      "Stuck on brand boot logo or restart loop",
      "Short circuit causing extreme overheating near processor",
      "No network signal or Wi-Fi greyed out on settings",
      "Audio IC malfunction (no sound on recording or calls)",
    ],
  },
  {
    name: "Water Damage Ultrasonic Diagnostics",
    slug: "water-damage-recovery",
    description:
      "Ultrasonic chemical cleaning, corrosion removal, and circuit board component reflow for phones exposed to water, beverages, or heavy rain. High recovery rate when treated promptly.",
    estimatedTimeMinutes: 60,
    startingPrice: 1299,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone dropped in water, sink, pool, or rain shower",
      "Liquid ingress causing reboot loops or screen flickering",
      "Green corrosion visible on flex ribbon connectors",
      "Phone vibrating intermittently after liquid contact",
    ],
  },
  {
    name: "Volume, Power & Alert Slider Button Flex Repair",
    slug: "buttons-flex-repair",
    description:
      "Fix jammed power lock buttons, unresponsive volume up/down rockers, or broken alert slider switches. Restores crisp tactile click feel with high-durability replacement flex cables.",
    estimatedTimeMinutes: 25,
    startingPrice: 599,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Power lock button stuck or requires heavy pressure",
      "Volume buttons not increasing or decreasing audio level",
      "Alert slider loose or not switching between silent and ring",
      "Phone auto-booting into recovery mode due to stuck volume key",
    ],
  },
  {
    name: "Face ID & Biometric Sensor Repair",
    slug: "biometric-sensor-repair",
    description:
      "Precision alignment and flex restoration for Apple TrueDepth Face ID dot projectors and Android in-display ultrasonic/optical fingerprint scanners.",
    estimatedTimeMinutes: 45,
    startingPrice: 1499,
    warrantyDays: 60,
    isPopular: false,
    commonIssues: [
      "Face ID disabled alert or 'Move iPhone lower/higher'",
      "In-display fingerprint sensor not reading thumbprints",
      "TrueDepth camera failure after screen replacement",
      "Biometrics setup failing during registration",
    ],
  },
  {
    name: "Full Body Housing & Chassis Replacement",
    slug: "housing-chassis-replacement",
    description:
      "Complete frame and middle chassis overhaul for phones with bent frames, severe corner impacts, or deformed aluminum/titanium rails. Prevents display stress fractures and ensures perfect fit.",
    estimatedTimeMinutes: 45,
    startingPrice: 1899,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Phone visibly bent from pocket pressure or impact",
      "Chassis corners dented preventing new display installation",
      "Side buttons popping out of deformed bezel rails",
      "Severely scratched or chipped exterior metal paint",
    ],
  },
  {
    name: "Vibration Motor & Taptic Engine Replacement",
    slug: "vibration-motor-repair",
    description:
      "Fix weak, rattling, or completely missing vibration alerts. Restores crisp haptic feedback for incoming calls, keyboard typing, and system notifications.",
    estimatedTimeMinutes: 20,
    startingPrice: 549,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "No vibration on silent mode for incoming calls",
      "Vibration motor makes loud buzzing or rattling noise",
      "Keyboard haptic feedback completely absent",
      "Irregular or weak haptic pulses",
    ],
  },
  {
    name: "Software Flashing & Bootloop Recovery",
    slug: "software-bootloop-recovery",
    description:
      "Professional firmware flashing, recovery loop unbricking, fastboot repair, and secure Android/iOS reinstallation without data loss where feasible.",
    estimatedTimeMinutes: 40,
    startingPrice: 799,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone stuck in infinite restart bootloop",
      "Device boots only into Recovery / Fastboot screen",
      "Failed OTA update causing corrupt system partition",
      "Google Play Services crashing continuously",
    ],
  },
];

// ============================================================================
// 2. BRANDS DATA
// ============================================================================
const BRANDS_DATA = [
  { name: "Apple", slug: "apple", isPopular: true, displayOrder: 1 },
  { name: "Samsung", slug: "samsung", isPopular: true, displayOrder: 2 },
  { name: "OnePlus", slug: "oneplus", isPopular: true, displayOrder: 3 },
  { name: "Xiaomi", slug: "xiaomi", isPopular: true, displayOrder: 4 },
  { name: "Vivo", slug: "vivo", isPopular: true, displayOrder: 5 },
  { name: "Oppo", slug: "oppo", isPopular: true, displayOrder: 6 },
  { name: "Google Pixel", slug: "google-pixel", isPopular: true, displayOrder: 7 },
  { name: "Realme", slug: "realme", isPopular: true, displayOrder: 8 },
  { name: "Motorola", slug: "motorola", isPopular: false, displayOrder: 9 },
  { name: "Nothing", slug: "nothing", isPopular: false, displayOrder: 10 },
  { name: "iQOO", slug: "iqoo", isPopular: false, displayOrder: 11 },
  { name: "Poco", slug: "poco", isPopular: false, displayOrder: 12 },
];

// ============================================================================
// 3. TIER-BASED PRICING BLUEPRINTS (Authentic Indian Market Rates)
// ============================================================================
type DeviceTier = "flagship_ultra" | "flagship" | "upper_mid" | "mid" | "budget";

const TIER_PRICES: Record<DeviceTier, Record<string, number>> = {
  flagship_ultra: {
    "screen-replacement": 18999,
    "battery-replacement": 3999,
    "charging-port-repair": 1699,
    "back-glass-repair": 4499,
    "camera-repair": 6499,
    "camera-glass-replacement": 899,
    "speaker-mic-repair": 1299,
    "motherboard-repair": 3499,
    "water-damage-recovery": 1999,
    "buttons-flex-repair": 999,
    "biometric-sensor-repair": 2499,
    "housing-chassis-replacement": 5999,
    "vibration-motor-repair": 799,
    "software-bootloop-recovery": 799,
  },
  flagship: {
    "screen-replacement": 13999,
    "battery-replacement": 3299,
    "charging-port-repair": 1399,
    "back-glass-repair": 3299,
    "camera-repair": 4999,
    "camera-glass-replacement": 799,
    "speaker-mic-repair": 1099,
    "motherboard-repair": 2999,
    "water-damage-recovery": 1699,
    "buttons-flex-repair": 899,
    "biometric-sensor-repair": 1999,
    "housing-chassis-replacement": 4499,
    "vibration-motor-repair": 699,
    "software-bootloop-recovery": 799,
  },
  upper_mid: {
    "screen-replacement": 6499,
    "battery-replacement": 2199,
    "charging-port-repair": 999,
    "back-glass-repair": 1999,
    "camera-repair": 2999,
    "camera-glass-replacement": 699,
    "speaker-mic-repair": 799,
    "motherboard-repair": 2499,
    "water-damage-recovery": 1499,
    "buttons-flex-repair": 799,
    "biometric-sensor-repair": 1499,
    "housing-chassis-replacement": 2999,
    "vibration-motor-repair": 599,
    "software-bootloop-recovery": 799,
  },
  mid: {
    "screen-replacement": 3999,
    "battery-replacement": 1699,
    "charging-port-repair": 799,
    "back-glass-repair": 1399,
    "camera-repair": 1999,
    "camera-glass-replacement": 599,
    "speaker-mic-repair": 699,
    "motherboard-repair": 1999,
    "water-damage-recovery": 1299,
    "buttons-flex-repair": 699,
    "biometric-sensor-repair": 1199,
    "housing-chassis-replacement": 2199,
    "vibration-motor-repair": 549,
    "software-bootloop-recovery": 699,
  },
  budget: {
    "screen-replacement": 2399,
    "battery-replacement": 1299,
    "charging-port-repair": 699,
    "back-glass-repair": 999,
    "camera-repair": 1299,
    "camera-glass-replacement": 499,
    "speaker-mic-repair": 599,
    "motherboard-repair": 1499,
    "water-damage-recovery": 999,
    "buttons-flex-repair": 599,
    "biometric-sensor-repair": 899,
    "housing-chassis-replacement": 1499,
    "vibration-motor-repair": 499,
    "software-bootloop-recovery": 599,
  },
};

interface ModelBlueprint {
  brandSlug: string;
  name: string;
  slug: string;
  releaseYear: number;
  isPopular: boolean;
  tier: DeviceTier;
  priceOverrides?: Partial<Record<string, number>>;
}

// ============================================================================
// 4. EXTENSIVE DEVICE MODELS (150+ Top Indian Smartphone Models)
// ============================================================================
const MODELS_DATA: ModelBlueprint[] = [
  // --------------------------------------------------------------------------
  // APPLE IPHONES (22 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "apple",
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 19999, backGlass: 4699, camera: 6999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 16999, backGlass: 3999, camera: 5999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 16 Plus",
    slug: "iphone-16-plus",
    releaseYear: 2024,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 14499, backGlass: 3499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 16",
    slug: "iphone-16",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 12999, backGlass: 3299 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 16499, backGlass: 3899, camera: 5999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 14999, backGlass: 3499, camera: 5499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15 Plus",
    slug: "iphone-15-plus",
    releaseYear: 2023,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 12499, backGlass: 2999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15",
    slug: "iphone-15",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 11999, backGlass: 2899 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14 Pro Max",
    slug: "iphone-14-pro-max",
    releaseYear: 2022,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 14999, backGlass: 3499, camera: 4999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14 Pro",
    slug: "iphone-14-pro",
    releaseYear: 2022,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 13499, backGlass: 2999, camera: 4499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14 Plus",
    slug: "iphone-14-plus",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 10499, backGlass: 2699 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14",
    slug: "iphone-14",
    releaseYear: 2022,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 9999, backGlass: 2499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13 Pro Max",
    slug: "iphone-13-pro-max",
    releaseYear: 2021,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 13499, backGlass: 2999, camera: 4499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13 Pro",
    slug: "iphone-13-pro",
    releaseYear: 2021,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 11999, backGlass: 2699, camera: 3999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13",
    slug: "iphone-13",
    releaseYear: 2021,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 8499, backGlass: 2299 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13 mini",
    slug: "iphone-13-mini",
    releaseYear: 2021,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 7999, backGlass: 2199 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 12 Pro Max",
    slug: "iphone-12-pro-max",
    releaseYear: 2020,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 10999, backGlass: 2499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 12 Pro",
    slug: "iphone-12-pro",
    releaseYear: 2020,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 9499, backGlass: 2299 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 12",
    slug: "iphone-12",
    releaseYear: 2020,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 6999, backGlass: 1999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 11",
    slug: "iphone-11",
    releaseYear: 2019,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 4499, battery: 2199, backGlass: 1999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone XR",
    slug: "iphone-xr",
    releaseYear: 2018,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 3999, battery: 1999, backGlass: 1699 },
  },
  {
    brandSlug: "apple",
    name: "iPhone SE (3rd Gen)",
    slug: "iphone-se-3rd-gen",
    releaseYear: 2022,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3499, battery: 1899, backGlass: 1499 },
  },

  // --------------------------------------------------------------------------
  // SAMSUNG GALAXY (22 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "samsung",
    name: "Galaxy S24 Ultra",
    slug: "galaxy-s24-ultra",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 17999, camera: 6499, backGlass: 3999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S24+",
    slug: "galaxy-s24-plus",
    releaseYear: 2024,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 13999, camera: 4999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S24",
    slug: "galaxy-s24",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 12499, camera: 4499 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23 Ultra",
    slug: "galaxy-s23-ultra",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 15499, camera: 5999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23+",
    slug: "galaxy-s23-plus",
    releaseYear: 2023,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 11999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23",
    slug: "galaxy-s23",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 10999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23 FE",
    slug: "galaxy-s23-fe",
    releaseYear: 2023,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 7499 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S22 Ultra",
    slug: "galaxy-s22-ultra",
    releaseYear: 2022,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 13999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S22+",
    slug: "galaxy-s22-plus",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 9999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S22",
    slug: "galaxy-s22",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 8999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S21 FE 5G",
    slug: "galaxy-s21-fe-5g",
    releaseYear: 2022,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy Z Fold 5",
    slug: "galaxy-z-fold-5",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 24999, housing: 8999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy Z Flip 5",
    slug: "galaxy-z-flip-5",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 16999, housing: 6999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy Z Fold 4",
    slug: "galaxy-z-fold-4",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship_ultra",
    priceOverrides: { screen: 21999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy Z Flip 4",
    slug: "galaxy-z-flip-4",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship_ultra",
    priceOverrides: { screen: 14999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A55 5G",
    slug: "galaxy-a55-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A54 5G",
    slug: "galaxy-a54-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A35 5G",
    slug: "galaxy-a35-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 4499 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A34 5G",
    slug: "galaxy-a34-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy M34 5G",
    slug: "galaxy-m34-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy M14 5G",
    slug: "galaxy-m14-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 2399 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy F54 5G",
    slug: "galaxy-f54-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3699 },
  },

  // --------------------------------------------------------------------------
  // ONEPLUS (15 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "oneplus",
    name: "OnePlus 12",
    slug: "oneplus-12",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 10999, camera: 4499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 12R",
    slug: "oneplus-12r",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 6999 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 11 5G",
    slug: "oneplus-11-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 9499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 11R 5G",
    slug: "oneplus-11r-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 10 Pro 5G",
    slug: "oneplus-10-pro-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 8499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 10T 5G",
    slug: "oneplus-10t-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 10R 5G",
    slug: "oneplus-10r-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 4999 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 9 Pro 5G",
    slug: "oneplus-9-pro-5g",
    releaseYear: 2021,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 6999 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 9 5G",
    slug: "oneplus-9-5g",
    releaseYear: 2021,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 9R 5G",
    slug: "oneplus-9r-5g",
    releaseYear: 2021,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 4899 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord 4 5G",
    slug: "oneplus-nord-4-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord 3 5G",
    slug: "oneplus-nord-3-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 4699 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord CE 4 5G",
    slug: "oneplus-nord-ce-4-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3899 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord CE 3 5G",
    slug: "oneplus-nord-ce-3-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord CE 3 Lite 5G",
    slug: "oneplus-nord-ce-3-lite-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2899 },
  },

  // --------------------------------------------------------------------------
  // XIAOMI / REDMI (15 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 14",
    slug: "xiaomi-14",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 11499, camera: 4999 },
  },
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 13 Pro",
    slug: "xiaomi-13-pro",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 10499, camera: 4499 },
  },
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 12 Pro",
    slug: "xiaomi-12-pro",
    releaseYear: 2022,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 7499 },
  },
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 11T Pro 5G",
    slug: "xiaomi-11t-pro-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 Pro+ 5G",
    slug: "redmi-note-13-pro-plus-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 4999 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 Pro 5G",
    slug: "redmi-note-13-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3899 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 5G",
    slug: "redmi-note-13-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 12 Pro+ 5G",
    slug: "redmi-note-12-pro-plus-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3899 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 12 Pro 5G",
    slug: "redmi-note-12-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3499 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 12 5G",
    slug: "redmi-note-12-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 2799 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 11 Pro+ 5G",
    slug: "redmi-note-11-pro-plus-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi 13C 5G",
    slug: "redmi-13c-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2199 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi 12 5G",
    slug: "redmi-12-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2199 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi K50i 5G",
    slug: "redmi-k50i-5g",
    releaseYear: 2022,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi 10 Prime",
    slug: "redmi-10-prime",
    releaseYear: 2021,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 1899 },
  },

  // --------------------------------------------------------------------------
  // GOOGLE PIXEL (10 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "google-pixel",
    name: "Pixel 9 Pro XL",
    slug: "pixel-9-pro-xl",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 17499, camera: 5999 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 9 Pro",
    slug: "pixel-9-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 15999, camera: 5499 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 9",
    slug: "pixel-9",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 12999 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 8 Pro",
    slug: "pixel-8-pro",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 14999, camera: 4999 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 8",
    slug: "pixel-8",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 11499 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 8a",
    slug: "pixel-8a",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 6499 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 7 Pro",
    slug: "pixel-7-pro",
    releaseYear: 2022,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 12499 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 7",
    slug: "pixel-7",
    releaseYear: 2022,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 7999 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 7a",
    slug: "pixel-7a",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 6a",
    slug: "pixel-6a",
    releaseYear: 2022,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 4499 },
  },

  // --------------------------------------------------------------------------
  // VIVO (12 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "vivo",
    name: "Vivo X100 Pro",
    slug: "vivo-x100-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 14999, camera: 5999 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo X100",
    slug: "vivo-x100",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 10999 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo X90 Pro",
    slug: "vivo-x90-pro",
    releaseYear: 2023,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 9999 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo X90",
    slug: "vivo-x90",
    releaseYear: 2023,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 7999 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V30 Pro",
    slug: "vivo-v30-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 6499 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V30",
    slug: "vivo-v30",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V29 Pro",
    slug: "vivo-v29-pro",
    releaseYear: 2023,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V29",
    slug: "vivo-v29",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 4499 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo T3 5G",
    slug: "vivo-t3-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo T3x 5G",
    slug: "vivo-t3x-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2399 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo T2 Pro 5G",
    slug: "vivo-t2-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3699 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo Y200 5G",
    slug: "vivo-y200-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },

  // --------------------------------------------------------------------------
  // OPPO (11 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "oppo",
    name: "Oppo Find N3 Flip",
    slug: "oppo-find-n3-flip",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 16999 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 12 Pro 5G",
    slug: "oppo-reno-12-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 6499 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 12 5G",
    slug: "oppo-reno-12-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 11 Pro 5G",
    slug: "oppo-reno-11-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 11 5G",
    slug: "oppo-reno-11-5g",
    releaseYear: 2024,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 4999 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 10 Pro+ 5G",
    slug: "oppo-reno-10-pro-plus-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 6499 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 10 5G",
    slug: "oppo-reno-10-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 4499 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo F27 Pro+ 5G",
    slug: "oppo-f27-pro-plus-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 4299 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo F25 Pro 5G",
    slug: "oppo-f25-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3699 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo F23 5G",
    slug: "oppo-f23-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo A79 5G",
    slug: "oppo-a79-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2399 },
  },

  // --------------------------------------------------------------------------
  // REALME (12 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "realme",
    name: "Realme GT 6",
    slug: "realme-gt-6",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999, camera: 2999 },
  },
  {
    brandSlug: "realme",
    name: "Realme GT 6T",
    slug: "realme-gt-6t",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5299 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12 Pro+ 5G",
    slug: "realme-12-pro-plus-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3999 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12 Pro 5G",
    slug: "realme-12-pro-5g",
    releaseYear: 2024,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3499 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12+ 5G",
    slug: "realme-12-plus-5g",
    releaseYear: 2024,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12 5G",
    slug: "realme-12-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2499 },
  },
  {
    brandSlug: "realme",
    name: "Realme 11 Pro+ 5G",
    slug: "realme-11-pro-plus-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3699 },
  },
  {
    brandSlug: "realme",
    name: "Realme 11 Pro 5G",
    slug: "realme-11-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "realme",
    name: "Realme Narzo 70 Pro 5G",
    slug: "realme-narzo-70-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "realme",
    name: "Realme Narzo 60 Pro 5G",
    slug: "realme-narzo-60-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "realme",
    name: "Realme C67 5G",
    slug: "realme-c67-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2199 },
  },
  {
    brandSlug: "realme",
    name: "Realme C55",
    slug: "realme-c55",
    releaseYear: 2023,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 1999 },
  },

  // --------------------------------------------------------------------------
  // MOTOROLA (10 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "motorola",
    name: "Moto Razr 40 Ultra",
    slug: "moto-razr-40-ultra",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship_ultra",
    priceOverrides: { screen: 16999 },
  },
  {
    brandSlug: "motorola",
    name: "Motorola Edge 50 Ultra",
    slug: "motorola-edge-50-ultra",
    releaseYear: 2024,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 9999, camera: 3999 },
  },
  {
    brandSlug: "motorola",
    name: "Motorola Edge 50 Pro",
    slug: "motorola-edge-50-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "motorola",
    name: "Motorola Edge 50 Fusion",
    slug: "motorola-edge-50-fusion",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3799 },
  },
  {
    brandSlug: "motorola",
    name: "Motorola Edge 40",
    slug: "motorola-edge-40",
    releaseYear: 2023,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 4999 },
  },
  {
    brandSlug: "motorola",
    name: "Motorola Edge 40 Neo",
    slug: "motorola-edge-40-neo",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3699 },
  },
  {
    brandSlug: "motorola",
    name: "Moto G85 5G",
    slug: "moto-g85-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "motorola",
    name: "Moto G84 5G",
    slug: "moto-g84-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2699 },
  },
  {
    brandSlug: "motorola",
    name: "Moto G54 5G",
    slug: "moto-g54-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 2299 },
  },
  {
    brandSlug: "motorola",
    name: "Moto G34 5G",
    slug: "moto-g34-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 1999 },
  },

  // --------------------------------------------------------------------------
  // NOTHING & CMF (5 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "nothing",
    name: "Nothing Phone (2)",
    slug: "nothing-phone-2",
    releaseYear: 2023,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 6499, backGlass: 2699 },
  },
  {
    brandSlug: "nothing",
    name: "Nothing Phone (2a) Plus",
    slug: "nothing-phone-2a-plus",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 4299, backGlass: 1699 },
  },
  {
    brandSlug: "nothing",
    name: "Nothing Phone (2a)",
    slug: "nothing-phone-2a",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3899, backGlass: 1599 },
  },
  {
    brandSlug: "nothing",
    name: "Nothing Phone (1)",
    slug: "nothing-phone-1",
    releaseYear: 2022,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 4499, backGlass: 2199 },
  },
  {
    brandSlug: "nothing",
    name: "CMF Phone 1",
    slug: "cmf-phone-1",
    releaseYear: 2024,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2499, backGlass: 899 },
  },

  // --------------------------------------------------------------------------
  // IQOO (8 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "iqoo",
    name: "iQOO 12 5G",
    slug: "iqoo-12-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "flagship",
    priceOverrides: { screen: 8499, camera: 3899 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO 11 5G",
    slug: "iqoo-11-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "flagship",
    priceOverrides: { screen: 7999 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Neo 9 Pro",
    slug: "iqoo-neo-9-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5499 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Neo 7 Pro",
    slug: "iqoo-neo-7-pro",
    releaseYear: 2023,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 4699 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Z9 5G",
    slug: "iqoo-z9-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 2999 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Z9x 5G",
    slug: "iqoo-z9x-5g",
    releaseYear: 2024,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 2199 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Z7 Pro 5G",
    slug: "iqoo-z7-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3499 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO 9 Pro",
    slug: "iqoo-9-pro",
    releaseYear: 2022,
    isPopular: false,
    tier: "upper_mid",
    priceOverrides: { screen: 6499 },
  },

  // --------------------------------------------------------------------------
  // POCO (9 Models)
  // --------------------------------------------------------------------------
  {
    brandSlug: "poco",
    name: "Poco F6 Pro",
    slug: "poco-f6-pro",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 5999 },
  },
  {
    brandSlug: "poco",
    name: "Poco F6 5G",
    slug: "poco-f6-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "upper_mid",
    priceOverrides: { screen: 4999 },
  },
  {
    brandSlug: "poco",
    name: "Poco X6 Pro 5G",
    slug: "poco-x6-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    tier: "mid",
    priceOverrides: { screen: 3899 },
  },
  {
    brandSlug: "poco",
    name: "Poco X6 5G",
    slug: "poco-x6-5g",
    releaseYear: 2024,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3199 },
  },
  {
    brandSlug: "poco",
    name: "Poco X5 Pro 5G",
    slug: "poco-x5-pro-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3299 },
  },
  {
    brandSlug: "poco",
    name: "Poco M6 Pro 5G",
    slug: "poco-m6-pro-5g",
    releaseYear: 2023,
    isPopular: true,
    tier: "budget",
    priceOverrides: { screen: 2399 },
  },
  {
    brandSlug: "poco",
    name: "Poco M6 5G",
    slug: "poco-m6-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 2199 },
  },
  {
    brandSlug: "poco",
    name: "Poco C65",
    slug: "poco-c65",
    releaseYear: 2023,
    isPopular: false,
    tier: "budget",
    priceOverrides: { screen: 1899 },
  },
  {
    brandSlug: "poco",
    name: "Poco F5 5G",
    slug: "poco-f5-5g",
    releaseYear: 2023,
    isPopular: false,
    tier: "mid",
    priceOverrides: { screen: 3999 },
  },
];

// ============================================================================
// SEED RUNNER
// ============================================================================
async function seedDatabase() {
  console.log("Connecting to MongoDB via connectDb()...");
  await connectDb();
  console.log("Connected successfully.\n");

  // 1. Seed Services
  console.log("Seeding Repair Services...");
  const serviceMap = new Map<string, mongoose.Types.ObjectId>();

  for (const s of SERVICES_DATA) {
    const doc = await RepairService.findOneAndUpdate(
      { slug: s.slug },
      { $set: s },
      { upsert: true, new: true }
    );
    serviceMap.set(s.slug, doc._id as mongoose.Types.ObjectId);
    console.log(`  ✓ Service: ${s.name} (Starting at ₹${s.startingPrice}, ${s.estimatedTimeMinutes}m SLA)`);
  }

  // 2. Seed Brands
  console.log("\nSeeding Brands...");
  const brandMap = new Map<string, mongoose.Types.ObjectId>();

  for (const b of BRANDS_DATA) {
    const doc = await Brand.findOneAndUpdate(
      { slug: b.slug },
      { $set: b },
      { upsert: true, new: true }
    );
    brandMap.set(b.slug, doc._id as mongoose.Types.ObjectId);
    console.log(`  ✓ Brand: ${b.name}`);
  }

  // 3. Seed Models with Comprehensive Tier & Custom Pricing Across All Services
  console.log("\nSeeding Device Models with Custom Pricing across all 14 services...");
  let modelCount = 0;

  for (const m of MODELS_DATA) {
    const brandId = brandMap.get(m.brandSlug);
    if (!brandId) {
      console.warn(`  ⚠ Warning: Brand slug "${m.brandSlug}" not found for model "${m.name}"`);
      continue;
    }

    const tierPrices = TIER_PRICES[m.tier];
    const servicePricing: { service: mongoose.Types.ObjectId; price: number; estimatedTimeMinutes: number }[] = [];

    for (const s of SERVICES_DATA) {
      const sId = serviceMap.get(s.slug);
      if (!sId) continue;

      const price = m.priceOverrides?.[s.slug] ?? tierPrices[s.slug] ?? s.startingPrice;
      servicePricing.push({
        service: sId,
        price,
        estimatedTimeMinutes: s.estimatedTimeMinutes,
      });
    }

    await DeviceModel.findOneAndUpdate(
      { slug: m.slug },
      {
        $set: {
          brand: brandId,
          name: m.name,
          slug: m.slug,
          releaseYear: m.releaseYear,
          isPopular: m.isPopular,
          servicePricing,
          isActive: true,
        },
      },
      { upsert: true, new: true }
    );

    modelCount++;
    console.log(`  ✓ Model [${m.name}]: ${servicePricing.length} service prices configured`);
  }

  console.log("\n========================================================");
  console.log(`✨ Seeding Complete! Summary:`);
  console.log(`  - Repair Services: ${SERVICES_DATA.length}`);
  console.log(`  - Smartphone Brands: ${BRANDS_DATA.length}`);
  console.log(`  - Device Models with Full Service Pricing: ${modelCount}`);
  console.log(`  - Total Service-Price Points Configured: ${modelCount * SERVICES_DATA.length}`);
  console.log("========================================================\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB.");
}

// Only auto-run if executed directly (e.g. `npx tsx scripts/seed-data.ts`)
if (require.main === module || process.argv[1]?.includes("seed-data")) {
  seedDatabase().catch((err) => {
    console.error("Seed execution failed:", err);
    process.exit(1);
  });
}

export { seedDatabase };
