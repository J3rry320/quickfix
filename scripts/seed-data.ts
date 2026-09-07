/**
 * QuickFix.in - Seed Data Script
 *
 * Populates MongoDB with rich, SEO-ready, user-friendly data for:
 * - Major Repair Services (Screen, Battery, Charging, Back Glass, Camera, Motherboard, etc.)
 * - Major Smartphone Brands in India (Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Pixel, Realme, etc.)
 * - Popular Device Models with authentic Indian market pricing estimates.
 *
 * Safe to re-run: Uses upsert (findOneAndUpdate with upsert: true) to avoid duplicate entries.
 *
 * Usage:
 *   npx tsx scripts/seed-data.ts
 *   OR
 *   node --env-file=.env --experimental-strip-types scripts/seed-data.ts
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Ensure MONGODB_URI is loaded from .env or .env.local if not already in process.env
function loadEnvFallback() {
  if (process.env.MONGODB_URI) return;

  const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...values] = trimmed.split("=");
          const val = values.join("=").trim().replace(/^["']|["']$/g, "");
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnvFallback();

const MONGODB_URI = process.env.MONGODB_URI;

// Define Schemas inline to ensure script runs standalone without Next.js path resolution issues
const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    logoUrl: { type: String, trim: true },
    isPopular: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const RepairServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    estimatedTimeMinutes: { type: Number, required: true, default: 30, min: 5 },
    startingPrice: { type: Number, required: true, min: 0 },
    warrantyDays: { type: Number, required: true, default: 90, min: 0 },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    isPopular: { type: Boolean, default: false, index: true },
    commonIssues: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const ModelServicePriceSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "RepairService", required: true },
    price: { type: Number, required: true, min: 0 },
    estimatedTimeMinutes: { type: Number, default: 30, min: 5 },
  },
  { _id: false }
);

const DeviceModelSchema = new mongoose.Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    releaseYear: { type: Number },
    imageUrl: { type: String, trim: true },
    isPopular: { type: Boolean, default: false, index: true },
    servicePricing: { type: [ModelServicePriceSchema], default: [] },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
const RepairService = mongoose.models.RepairService || mongoose.model("RepairService", RepairServiceSchema);
const DeviceModel = mongoose.models.DeviceModel || mongoose.model("DeviceModel", DeviceModelSchema);

// ============================================================================
// 1. REPAIR SERVICES (SEO-Optimized, User-Friendly Descriptions)
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
      "Green/white vertical lines on display",
      "Black spots or ink bleed on OLED",
      "Flickering or blank screen",
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
      "Phone shutting down unexpectedly",
      "Battery draining completely in 3-4 hours",
      "Back cover lifting due to swollen battery",
      "Phone getting hot while charging or idling",
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
      "Phone not detecting charger or fast charge",
      "Persistent 'Moisture in charging port' alert",
      "Debris/pins broken inside USB-C socket",
      "Phone not connecting to PC for data transfer",
    ],
  },
  {
    name: "Back Glass & Frame Restoration",
    slug: "back-glass-repair",
    description:
      "Laser debonding removal and precision replacement of shattered rear glass panels and camera bump rings. Factory-grade adhesive seal restores smooth tactile feel and water-resistant protection.",
    estimatedTimeMinutes: 45,
    startingPrice: 999,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Spiderweb cracks on rear glass panel",
      "Chipped glass around camera island",
      "Loose back panel coming off frame",
      "Dented aluminium or stainless steel frame",
    ],
  },
  {
    name: "Front & Rear Camera / Lens Repair",
    slug: "camera-repair",
    description:
      "Repair cracked outer sapphire camera lenses, blurry autofocus, optical image stabilization (OIS) buzzing or vibration, and black screen camera sensor failures with genuine sensors.",
    estimatedTimeMinutes: 35,
    startingPrice: 1199,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Cracked outer protective camera glass",
      "Rear camera vibrating or buzzing constantly",
      "Camera app shows black screen",
      "Autofocus fails to focus on close objects",
      "Dust spots or purple haze on photos",
    ],
  },
  {
    name: "Earpiece Speaker & Microphone Repair",
    slug: "speaker-mic-repair",
    description:
      "Fix muffled in-call audio, distorted bottom speaker output, crackling sounds at high volume, or callers unable to hear your voice due to damaged microphone flex cables.",
    estimatedTimeMinutes: 30,
    startingPrice: 699,
    warrantyDays: 90,
    isPopular: false,
    commonIssues: [
      "Cannot hear callers unless on speakerphone",
      "Caller complains of low or robotic voice",
      "Bottom loudspeaker crackles on ringtones",
      "Microphone not recording voice notes",
    ],
  },
  {
    name: "Motherboard & Chip-Level Micro-Soldering",
    slug: "motherboard-repair",
    description:
      "Advanced micro-soldering for phones with power IC failures, short circuits, charging loop issues, or CPU reballing. Diagnosed and repaired by master technicians in our static-controlled lab.",
    estimatedTimeMinutes: 60,
    startingPrice: 1999,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone completely dead and not turning on",
      "Stuck on brand boot logo loop",
      "Short circuit causing extreme heating",
      "No network/Wi-Fi IC malfunction",
      "Audio IC malfunction (greyed-out speaker)",
    ],
  },
  {
    name: "Water Damage Ultrasonic Diagnostics",
    slug: "water-damage-recovery",
    description:
      "Ultrasonic chemical cleaning, corrosion removal, and circuit board component reflow for phones exposed to water, coffee, or rain. High success rate when treated promptly.",
    estimatedTimeMinutes: 60,
    startingPrice: 1299,
    warrantyDays: 30,
    isPopular: false,
    commonIssues: [
      "Phone dropped in water, sink, or pool",
      "Internal moisture causing reboot loops",
      "Short-circuited backlight after liquid contact",
      "Corrosion around motherboard flex connectors",
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
// 3. DEVICE MODELS DATA WITH REALISTIC MARKET PRICING
// ============================================================================
// Pricing estimates for tier categories:
// - Flagship: Screen 8k-18k, Battery 2.5k-3.5k, Port 1.2k, Back 2.5k-4.5k, Camera 3.5k-6k
// - Upper Mid: Screen 4k-7k, Battery 1.8k-2.2k, Port 899, Back 1.5k-2k, Camera 2k-3k
// - Budget: Screen 1.8k-3.2k, Battery 1.1k-1.4k, Port 699, Back 899-1.2k, Camera 1k-1.8k

interface ModelBlueprint {
  brandSlug: string;
  name: string;
  slug: string;
  releaseYear: number;
  isPopular: boolean;
  prices: {
    screen: number;
    battery: number;
    port: number;
    backGlass?: number;
    camera?: number;
    speaker?: number;
    motherboard?: number;
  };
}

const MODELS_DATA: ModelBlueprint[] = [
  // --- APPLE IPHONES ---
  {
    brandSlug: "apple",
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 18999, battery: 3999, port: 1699, backGlass: 4499, camera: 6499, speaker: 1299, motherboard: 3499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 16999, battery: 3699, port: 1599, backGlass: 3999, camera: 5999, speaker: 1199, motherboard: 3499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 16",
    slug: "iphone-16",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 12999, battery: 3299, port: 1499, backGlass: 3299, camera: 4999, speaker: 999, motherboard: 2999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 16499, battery: 3499, port: 1499, backGlass: 3899, camera: 5999, speaker: 1199, motherboard: 3499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 14999, battery: 3299, port: 1399, backGlass: 3499, camera: 5499, speaker: 1099, motherboard: 3499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 15",
    slug: "iphone-15",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 10999, battery: 2999, port: 1299, backGlass: 2899, camera: 4299, speaker: 999, motherboard: 2999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14 Pro Max",
    slug: "iphone-14-pro-max",
    releaseYear: 2022,
    isPopular: true,
    prices: { screen: 13999, battery: 2999, port: 1299, backGlass: 3299, camera: 4999, speaker: 999, motherboard: 2999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14 Pro",
    slug: "iphone-14-pro",
    releaseYear: 2022,
    isPopular: true,
    prices: { screen: 12499, battery: 2899, port: 1199, backGlass: 2999, camera: 4499, speaker: 999, motherboard: 2999 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 14",
    slug: "iphone-14",
    releaseYear: 2022,
    isPopular: true,
    prices: { screen: 7999, battery: 2699, port: 1099, backGlass: 2499, camera: 3699, speaker: 899, motherboard: 2699 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13 Pro Max",
    slug: "iphone-13-pro-max",
    releaseYear: 2021,
    isPopular: true,
    prices: { screen: 11499, battery: 2699, port: 1099, backGlass: 2899, camera: 4299, speaker: 899, motherboard: 2699 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 13",
    slug: "iphone-13",
    releaseYear: 2021,
    isPopular: true,
    prices: { screen: 6499, battery: 2499, port: 999, backGlass: 2199, camera: 3299, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 12",
    slug: "iphone-12",
    releaseYear: 2020,
    isPopular: true,
    prices: { screen: 5499, battery: 2199, port: 999, backGlass: 1899, camera: 2799, speaker: 799, motherboard: 2299 },
  },
  {
    brandSlug: "apple",
    name: "iPhone 11",
    slug: "iphone-11",
    releaseYear: 2019,
    isPopular: true,
    prices: { screen: 3499, battery: 1899, port: 899, backGlass: 1699, camera: 2199, speaker: 699, motherboard: 2199 },
  },

  // --- SAMSUNG GALAXY ---
  {
    brandSlug: "samsung",
    name: "Galaxy S24 Ultra",
    slug: "galaxy-s24-ultra",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 17999, battery: 3299, port: 1399, backGlass: 3499, camera: 5999, speaker: 1099, motherboard: 3499 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S24",
    slug: "galaxy-s24",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 10999, battery: 2699, port: 1199, backGlass: 2499, camera: 4299, speaker: 899, motherboard: 2999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23 Ultra",
    slug: "galaxy-s23-ultra",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 15499, battery: 2999, port: 1299, backGlass: 2999, camera: 5299, speaker: 999, motherboard: 3199 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S23",
    slug: "galaxy-s23",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 8999, battery: 2499, port: 1099, backGlass: 2199, camera: 3699, speaker: 899, motherboard: 2699 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy S22 Ultra",
    slug: "galaxy-s22-ultra",
    releaseYear: 2022,
    isPopular: true,
    prices: { screen: 13499, battery: 2699, port: 1199, backGlass: 2499, camera: 4499, speaker: 899, motherboard: 2799 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A55 5G",
    slug: "galaxy-a55-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4999, battery: 1899, port: 899, backGlass: 1499, camera: 2499, speaker: 699, motherboard: 2199 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A54 5G",
    slug: "galaxy-a54-5g",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 4499, battery: 1799, port: 899, backGlass: 1399, camera: 2199, speaker: 699, motherboard: 1999 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy A35 5G",
    slug: "galaxy-a35-5g",
    releaseYear: 2024,
    isPopular: false,
    prices: { screen: 3999, battery: 1699, port: 799, backGlass: 1299, camera: 1899, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "samsung",
    name: "Galaxy M34 5G",
    slug: "galaxy-m34-5g",
    releaseYear: 2023,
    isPopular: false,
    prices: { screen: 2899, battery: 1499, port: 699, backGlass: 999, camera: 1499, speaker: 699, motherboard: 1699 },
  },

  // --- ONEPLUS ---
  {
    brandSlug: "oneplus",
    name: "OnePlus 12",
    slug: "oneplus-12",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 7999, battery: 2499, port: 1099, backGlass: 2299, camera: 3899, speaker: 899, motherboard: 2899 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 12R",
    slug: "oneplus-12r",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 5999, battery: 2199, port: 999, backGlass: 1899, camera: 2999, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 11",
    slug: "oneplus-11",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 6999, battery: 2299, port: 999, backGlass: 2099, camera: 3499, speaker: 899, motherboard: 2699 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 11R",
    slug: "oneplus-11r",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 4999, battery: 1999, port: 899, backGlass: 1699, camera: 2499, speaker: 799, motherboard: 2299 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus 10 Pro",
    slug: "oneplus-10-pro",
    releaseYear: 2022,
    isPopular: false,
    prices: { screen: 6499, battery: 2199, port: 999, backGlass: 1899, camera: 3199, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord 4",
    slug: "oneplus-nord-4",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4499, battery: 1899, port: 899, backGlass: 1499, camera: 2199, speaker: 699, motherboard: 2099 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord CE 4",
    slug: "oneplus-nord-ce-4",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3499, battery: 1699, port: 799, backGlass: 1199, camera: 1799, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "oneplus",
    name: "OnePlus Nord CE 3 Lite 5G",
    slug: "oneplus-nord-ce-3-lite-5g",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 2699, battery: 1499, port: 699, backGlass: 999, camera: 1499, speaker: 699, motherboard: 1699 },
  },

  // --- XIAOMI & REDMI ---
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 14",
    slug: "xiaomi-14",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 8499, battery: 2499, port: 1099, backGlass: 2299, camera: 3999, speaker: 899, motherboard: 2799 },
  },
  {
    brandSlug: "xiaomi",
    name: "Xiaomi 13 Pro",
    slug: "xiaomi-13-pro",
    releaseYear: 2023,
    isPopular: false,
    prices: { screen: 7499, battery: 2299, port: 999, backGlass: 1999, camera: 3499, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 Pro+ 5G",
    slug: "redmi-note-13-pro-plus-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3899, battery: 1799, port: 799, backGlass: 1399, camera: 1999, speaker: 699, motherboard: 1999 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 Pro 5G",
    slug: "redmi-note-13-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3199, battery: 1599, port: 799, backGlass: 1199, camera: 1699, speaker: 699, motherboard: 1799 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi Note 13 5G",
    slug: "redmi-note-13-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 2399, battery: 1399, port: 699, backGlass: 999, camera: 1399, speaker: 699, motherboard: 1599 },
  },
  {
    brandSlug: "xiaomi",
    name: "Redmi 12 5G",
    slug: "redmi-12-5g",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 1999, battery: 1299, port: 699, backGlass: 899, camera: 1199, speaker: 699, motherboard: 1499 },
  },

  // --- GOOGLE PIXEL ---
  {
    brandSlug: "google-pixel",
    name: "Pixel 9 Pro XL",
    slug: "pixel-9-pro-xl",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 15999, battery: 3299, port: 1399, backGlass: 3499, camera: 5499, speaker: 1099, motherboard: 3299 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 9",
    slug: "pixel-9",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 10999, battery: 2899, port: 1199, backGlass: 2699, camera: 4299, speaker: 899, motherboard: 2899 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 8 Pro",
    slug: "pixel-8-pro",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 13499, battery: 2999, port: 1299, backGlass: 2999, camera: 4999, speaker: 999, motherboard: 2999 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 8",
    slug: "pixel-8",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 8999, battery: 2499, port: 1099, backGlass: 2199, camera: 3699, speaker: 899, motherboard: 2699 },
  },
  {
    brandSlug: "google-pixel",
    name: "Pixel 7a",
    slug: "pixel-7a",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 5499, battery: 1999, port: 999, backGlass: 1499, camera: 2499, speaker: 799, motherboard: 2199 },
  },

  // --- VIVO ---
  {
    brandSlug: "vivo",
    name: "Vivo X100 Pro",
    slug: "vivo-x100-pro",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 8999, battery: 2499, port: 1099, backGlass: 2399, camera: 4499, speaker: 899, motherboard: 2799 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V30 Pro",
    slug: "vivo-v30-pro",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4699, battery: 1899, port: 899, backGlass: 1499, camera: 2399, speaker: 699, motherboard: 2099 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo V30",
    slug: "vivo-v30",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3899, battery: 1699, port: 799, backGlass: 1299, camera: 1899, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "vivo",
    name: "Vivo T3 5G",
    slug: "vivo-t3-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 2499, battery: 1399, port: 699, backGlass: 999, camera: 1399, speaker: 699, motherboard: 1599 },
  },

  // --- OPPO ---
  {
    brandSlug: "oppo",
    name: "Oppo Reno 11 Pro 5G",
    slug: "oppo-reno-11-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4799, battery: 1899, port: 899, backGlass: 1599, camera: 2499, speaker: 699, motherboard: 2099 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo Reno 11 5G",
    slug: "oppo-reno-11-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3699, battery: 1699, port: 799, backGlass: 1299, camera: 1899, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "oppo",
    name: "Oppo F25 Pro 5G",
    slug: "oppo-f25-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 2999, battery: 1499, port: 699, backGlass: 1099, camera: 1499, speaker: 699, motherboard: 1699 },
  },

  // --- REALME ---
  {
    brandSlug: "realme",
    name: "Realme GT 6",
    slug: "realme-gt-6",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 5499, battery: 1999, port: 899, backGlass: 1699, camera: 2699, speaker: 799, motherboard: 2299 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12 Pro+ 5G",
    slug: "realme-12-pro-plus-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3999, battery: 1699, port: 799, backGlass: 1399, camera: 1999, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "realme",
    name: "Realme 12 5G",
    slug: "realme-12-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 2399, battery: 1399, port: 699, backGlass: 999, camera: 1299, speaker: 699, motherboard: 1599 },
  },

  // --- NOTHING ---
  {
    brandSlug: "nothing",
    name: "Nothing Phone (2)",
    slug: "nothing-phone-2",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 5999, battery: 2199, port: 999, backGlass: 2499, camera: 2999, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "nothing",
    name: "Nothing Phone (2a)",
    slug: "nothing-phone-2a",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3699, battery: 1699, port: 799, backGlass: 1499, camera: 1899, speaker: 699, motherboard: 1899 },
  },

  // --- MOTOROLA ---
  {
    brandSlug: "motorola",
    name: "Motorola Edge 50 Pro",
    slug: "motorola-edge-50-pro",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4899, battery: 1899, port: 899, backGlass: 1499, camera: 2399, speaker: 699, motherboard: 2099 },
  },
  {
    brandSlug: "motorola",
    name: "Moto G84 5G",
    slug: "moto-g84-5g",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 2499, battery: 1399, port: 699, backGlass: 999, camera: 1399, speaker: 699, motherboard: 1599 },
  },

  // --- IQOO ---
  {
    brandSlug: "iqoo",
    name: "iQOO 12 5G",
    slug: "iqoo-12-5g",
    releaseYear: 2023,
    isPopular: true,
    prices: { screen: 6999, battery: 2299, port: 999, backGlass: 1999, camera: 3299, speaker: 799, motherboard: 2499 },
  },
  {
    brandSlug: "iqoo",
    name: "iQOO Neo 9 Pro",
    slug: "iqoo-neo-9-pro",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4999, battery: 1899, port: 899, backGlass: 1599, camera: 2399, speaker: 699, motherboard: 2099 },
  },

  // --- POCO ---
  {
    brandSlug: "poco",
    name: "Poco X6 Pro 5G",
    slug: "poco-x6-pro-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 3699, battery: 1699, port: 799, backGlass: 1299, camera: 1799, speaker: 699, motherboard: 1899 },
  },
  {
    brandSlug: "poco",
    name: "Poco F6 5G",
    slug: "poco-f6-5g",
    releaseYear: 2024,
    isPopular: true,
    prices: { screen: 4499, battery: 1899, port: 899, backGlass: 1499, camera: 2199, speaker: 699, motherboard: 2099 },
  },
];

// ============================================================================
// SEED RUNNER
// ============================================================================
async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is not set in environment or .env file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
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
    console.log(`  ✓ Service: ${s.name} (Starting at ₹${s.startingPrice})`);
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

  // 3. Seed Models with Custom Pricing
  console.log("\nSeeding Device Models with Custom Pricing...");
  let modelCount = 0;

  for (const m of MODELS_DATA) {
    const brandId = brandMap.get(m.brandSlug);
    if (!brandId) {
      console.warn(`  ⚠ Warning: Brand slug "${m.brandSlug}" not found for model "${m.name}"`);
      continue;
    }

    const servicePricing: { service: mongoose.Types.ObjectId; price: number; estimatedTimeMinutes: number }[] = [];

    // Map prices to service IDs
    const screenServiceId = serviceMap.get("screen-replacement");
    if (screenServiceId && m.prices.screen) {
      servicePricing.push({ service: screenServiceId, price: m.prices.screen, estimatedTimeMinutes: 30 });
    }

    const batteryServiceId = serviceMap.get("battery-replacement");
    if (batteryServiceId && m.prices.battery) {
      servicePricing.push({ service: batteryServiceId, price: m.prices.battery, estimatedTimeMinutes: 25 });
    }

    const portServiceId = serviceMap.get("charging-port-repair");
    if (portServiceId && m.prices.port) {
      servicePricing.push({ service: portServiceId, price: m.prices.port, estimatedTimeMinutes: 30 });
    }

    const backGlassServiceId = serviceMap.get("back-glass-repair");
    if (backGlassServiceId && m.prices.backGlass) {
      servicePricing.push({ service: backGlassServiceId, price: m.prices.backGlass, estimatedTimeMinutes: 45 });
    }

    const cameraServiceId = serviceMap.get("camera-repair");
    if (cameraServiceId && m.prices.camera) {
      servicePricing.push({ service: cameraServiceId, price: m.prices.camera, estimatedTimeMinutes: 35 });
    }

    const speakerServiceId = serviceMap.get("speaker-mic-repair");
    if (speakerServiceId && m.prices.speaker) {
      servicePricing.push({ service: speakerServiceId, price: m.prices.speaker, estimatedTimeMinutes: 30 });
    }

    const motherboardServiceId = serviceMap.get("motherboard-repair");
    if (motherboardServiceId && m.prices.motherboard) {
      servicePricing.push({ service: motherboardServiceId, price: m.prices.motherboard, estimatedTimeMinutes: 60 });
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
  console.log(`  - Device Models with Custom Pricing: ${modelCount}`);
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
