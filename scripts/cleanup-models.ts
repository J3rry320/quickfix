/**
 * QuickFixMobile.in - Model Catalogue Deduplication, Normalization & Service Pricing Script
 *
 * This script automates catalogue hygiene across MongoDB collections:
 * 1. Fetches all Brands, DeviceModels, and RepairServices.
 * 2. Identifies duplicate / near-duplicate models under each brand using widened
 *    fuzzy matching (casing, punctuation, spacing, brand-prefix redundancies, connectivity variants).
 * 3. Dry-run mode by default:
 *    - Prints an inspection report of duplicate clusters.
 *    - In execute mode: Deletes duplicates with NO services first (Phase 1),
 *      then migrates any unique services from remaining duplicates before deleting them (Phase 2).
 * 4. Normalizes and standardizes model names and slugs in line with smartphone conventions.
 * 5. Automatically attaches all active repair services at authentic Indian market rates (tier-based)
 *    to models that currently have zero services configured.
 *
 * Usage:
 *   Dry Run (Safe preview):
 *     node --env-file=.env --experimental-strip-types scripts/cleanup-models.ts
 *     OR
 *     npm run cleanup:models
 *
 *   Execute Mode (Applies DB mutations):
 *     node --env-file=.env --experimental-strip-types scripts/cleanup-models.ts --execute
 *     OR
 *     npm run cleanup:models -- --execute
 *
 *   Filter by brand:
 *     node --env-file=.env --experimental-strip-types scripts/cleanup-models.ts --brand=apple --execute
 */

import mongoose, { Types } from "mongoose";
import { connectDb } from "../lib/mongodb.ts";
import { Brand, type IBrand } from "../models/Brand.ts";
import { DeviceModel, type IDeviceModel, type IModelServicePrice } from "../models/DeviceModel.ts";
import { RepairService, type IRepairService } from "../models/RepairService.ts";

// ============================================================================
// CLI OPTIONS & ARGUMENT PARSING
// ============================================================================
interface CliConfig {
  dryRun: boolean;
  brandFilter?: string;
  threshold: number;
  verbose: boolean;
  help: boolean;
}

function parseCliArgs(): CliConfig {
  const args = process.argv.slice(2);
  const config: CliConfig = {
    dryRun: true, // Default to dry-run for safety
    threshold: 0.85,
    verbose: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === "--execute" || arg === "--apply" || arg === "--no-dry-run") {
      config.dryRun = false;
    } else if (arg === "--dry-run") {
      config.dryRun = true;
    } else if (arg.startsWith("--brand=")) {
      config.brandFilter = arg.split("=")[1].trim().toLowerCase();
    } else if (arg.startsWith("--threshold=")) {
      const val = parseFloat(arg.split("=")[1]);
      if (!isNaN(val) && val > 0 && val <= 1) {
        config.threshold = val;
      }
    } else if (arg === "--verbose" || arg === "-v") {
      config.verbose = true;
    } else if (arg === "--help" || arg === "-h") {
      config.help = true;
    }
  }

  // Also check environment variable DRY_RUN=false
  if (process.env.DRY_RUN === "false" || process.env.EXECUTE === "true") {
    config.dryRun = false;
  }

  return config;
}

function printHelp(): void {
  console.log(`
📱 QuickFix Mobile - Model Catalogue Cleanup & Pricing Tool

Usage:
  node --env-file=.env --experimental-strip-types scripts/cleanup-models.ts [options]

Options:
  --dry-run               Preview changes without modifying the database (Default)
  --execute, --apply      Perform actual deletions, renaming, and service attachments
  --brand=<slug>          Filter execution to a single brand slug (e.g. apple, samsung)
  --threshold=<0.0-1.0>   Fuzzy similarity threshold (Default: 0.85)
  --verbose, -v           Print in-depth comparisons and logs
  --help, -h              Show this help message
`);
}

// ============================================================================
// MARKET PRICING BLUEPRINTS (Authentic Indian Market Rates)
// ============================================================================
type DeviceTier = "flagship_ultra" | "flagship" | "upper_mid" | "mid" | "budget";

const MARKET_TIER_PRICES: Record<DeviceTier, Record<string, number>> = {
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

/**
 * Determines device tier based on brand and model keywords.
 */
function detectDeviceTier(modelName: string, brandSlug: string): DeviceTier {
  const lower = modelName.toLowerCase();

  // 1. Flagship Ultra
  if (
    lower.includes("pro max") ||
    lower.includes("ultra") ||
    lower.includes("fold") ||
    lower.includes("z fold") ||
    lower.includes("find x") ||
    lower.includes("magic pro")
  ) {
    return "flagship_ultra";
  }

  // 2. Apple logic
  if (brandSlug === "apple") {
    if (lower.includes("pro")) return "flagship_ultra";
    if (lower.includes("se") || lower.includes("mini")) return "upper_mid";
    return "flagship"; // Base iPhones (11, 12, 13, 14, 15, 16, Plus)
  }

  // 3. Samsung logic
  if (brandSlug === "samsung") {
    if (lower.includes("flip") || lower.includes("z flip")) return "flagship";
    if (/s2[0-9]|s10/i.test(lower)) {
      if (lower.includes("fe")) return "upper_mid";
      return "flagship";
    }
    if (/a[5-7][0-9]/i.test(lower)) return "upper_mid"; // A54, A73
    if (/a[2-3][0-9]|m[3-5][0-9]|f[3-5][0-9]/i.test(lower)) return "mid"; // A34, M34, F54
    return "budget"; // A04, A14, M14, F14
  }

  // 4. Google Pixel logic
  if (brandSlug === "google-pixel" || brandSlug === "google") {
    if (lower.includes("pro")) return "flagship_ultra";
    if (/[0-9]a\b/i.test(lower)) return "upper_mid"; // 6a, 7a, 8a
    return "flagship"; // Pixel 6, 7, 8, 9
  }

  // 5. OnePlus logic
  if (brandSlug === "oneplus") {
    if (lower.includes("open")) return "flagship_ultra";
    if (/oneplus\s+[0-9]+(\s+pro)?/i.test(lower) || /^[0-9]+(\s+pro)?/i.test(lower)) {
      return "flagship"; // OnePlus 9, 10, 11, 12
    }
    if (lower.includes("nord ce")) return "mid";
    if (lower.includes("nord")) return "upper_mid";
    return "mid";
  }

  // 6. Generic flagship / mid keywords
  if (
    lower.includes("gt 5") ||
    lower.includes("gt 2") ||
    lower.includes("neo 9") ||
    lower.includes("neo 7") ||
    lower.includes("f5 pro") ||
    lower.includes("f6 pro")
  ) {
    return "upper_mid";
  }

  if (
    lower.includes("pro+") ||
    lower.includes("pro plus") ||
    lower.includes("note") ||
    lower.includes("edge")
  ) {
    return "mid";
  }

  if (
    lower.includes("lite") ||
    lower.includes("play") ||
    lower.includes("narzo") ||
    lower.includes("prime") ||
    lower.includes("power")
  ) {
    return "budget";
  }

  // Fallback default
  return "mid";
}

// ============================================================================
// STRING SIMILARITY & NORMALIZATION ALGORITHMS
// ============================================================================

/**
 * Strips brand name prefix, punctuation, whitespace, and connectivity noise
 * to create a canonical fingerprint key for exact matching.
 */
function createCompactKey(
  text: string,
  brandName: string,
  brandSlug: string,
  stripConnectivity: boolean = false
): string {
  let normalized = text.toLowerCase();

  // Remove brand name variations from the start
  const brandKeywords = [
    brandName.toLowerCase(),
    brandSlug.toLowerCase(),
    brandSlug.replace(/-/g, " ").toLowerCase(),
  ];

  for (const bk of brandKeywords) {
    if (normalized.startsWith(bk)) {
      normalized = normalized.slice(bk.length).trim();
    }
  }

  // Common replacements
  normalized = normalized.replace(/\+/g, "plus");
  normalized = normalized.replace(/&/g, "and");

  // Strip duplicate indicator suffixes from slugs/names (e.g. -1, -2, -copy, _1, (1))
  normalized = normalized.replace(/[-_ ]?(?:copy|duplicate|\d+)$/i, "");
  normalized = normalized.replace(/\(\d+\)$/, "");

  if (stripConnectivity) {
    // Strip trailing connectivity markers
    normalized = normalized.replace(/\b(5g|4g|lte)\b/gi, "");
  }

  // Keep only alphanumeric characters
  return normalized.replace(/[^a-z0-9]/gi, "").trim();
}

/**
 * Cleans a model slug for duplicate comparisons.
 */
function cleanSlugForComparison(slug: string, brandSlug: string): string {
  let s = slug.toLowerCase();
  if (s.startsWith(`${brandSlug}-`)) {
    s = s.slice(brandSlug.length + 1);
  }
  // Remove duplicate markers (-1, -copy, -duplicate)
  s = s.replace(/-(?:copy|duplicate|\d+)$/i, "");
  return s.replace(/[^a-z0-9]/gi, "");
}

/**
 * Computes Levenshtein distance between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Returns normalized Levenshtein similarity score between 0.0 and 1.0.
 */
function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(a, b);
  return 1 - dist / maxLen;
}

/**
 * Tokenizes, sorts words, and computes token similarity.
 */
function tokenSortSimilarity(a: string, b: string): number {
  const tokensA = a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean).sort().join(" ");
  const tokensB = b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean).sort().join(" ");
  return levenshteinSimilarity(tokensA, tokensB);
}

/**
 * Comprehensive similarity check between two models under the same brand.
 */
function areModelsSimilar(
  m1: IDeviceModel,
  m2: IDeviceModel,
  brand: IBrand,
  threshold: number = 0.85
): { isSimilar: boolean; reason: string; score: number } {
  // If exact same database document, not a duplicate of itself
  if (m1._id.toString() === m2._id.toString()) {
    return { isSimilar: false, reason: "Same ID", score: 1.0 };
  }

  const name1 = m1.name.trim();
  const name2 = m2.name.trim();
  const slug1 = m1.slug.trim().toLowerCase();
  const slug2 = m2.slug.trim().toLowerCase();

  // 1. Exact Name (case-insensitive)
  if (name1.toLowerCase() === name2.toLowerCase()) {
    return { isSimilar: true, reason: "Exact case-insensitive name match", score: 1.0 };
  }

  // 2. Exact Slug
  if (slug1 === slug2) {
    return { isSimilar: true, reason: "Identical slug match", score: 1.0 };
  }

  // 3. Compact Key match (stripping all whitespace, hyphens, punctuation, brand prefix)
  const key1 = createCompactKey(name1, brand.name, brand.slug);
  const key2 = createCompactKey(name2, brand.name, brand.slug);
  if (key1.length > 0 && key1 === key2) {
    return { isSimilar: true, reason: "Normalized compact name match", score: 0.99 };
  }

  // 4. Cleaned Slug match (stripping -1, -copy duplicate suffixes)
  const cleanSlug1 = cleanSlugForComparison(slug1, brand.slug);
  const cleanSlug2 = cleanSlugForComparison(slug2, brand.slug);
  if (cleanSlug1.length > 0 && cleanSlug1 === cleanSlug2) {
    return { isSimilar: true, reason: "Normalized slug match (duplicate suffix stripped)", score: 0.98 };
  }

  // 5. Connectivity variation match (e.g. "Realme 11 Pro" vs "Realme 11 Pro 5G")
  const keyNoConn1 = createCompactKey(name1, brand.name, brand.slug, true);
  const keyNoConn2 = createCompactKey(name2, brand.name, brand.slug, true);
  if (keyNoConn1.length > 3 && keyNoConn1 === keyNoConn2) {
    return { isSimilar: true, reason: "Matches without 5G/4G connectivity suffix", score: 0.94 };
  }

  // 6. Token Sort similarity (reordered or subtle words)
  const tokenScore = tokenSortSimilarity(name1, name2);
  if (tokenScore >= threshold) {
    return { isSimilar: true, reason: `Token sort similarity (${(tokenScore * 100).toFixed(1)}%)`, score: tokenScore };
  }

  // 7. Levenshtein similarity on cleaned names
  const levScore = levenshteinSimilarity(key1, key2);
  if (levScore >= threshold && key1.length >= 5 && key2.length >= 5) {
    return { isSimilar: true, reason: `Fuzzy character similarity (${(levScore * 100).toFixed(1)}%)`, score: levScore };
  }

  return { isSimilar: false, reason: "Below similarity threshold", score: Math.max(tokenScore, levScore) };
}

// ============================================================================
// MODEL NAME STANDARDIZATION & FORMATTING
// ============================================================================

/**
 * Standardizes smartphone model naming according to manufacturer and industry standards.
 */
function standardizeModelName(rawName: string, brandName: string, brandSlug: string): string {
  let name = rawName.trim().replace(/\s+/g, " ");

  // 1. Remove redundant brand prefixes if conventional for the brand
  // For Apple, Samsung, Google Pixel: models are named "iPhone 14", "Galaxy S23", "Pixel 8"
  if (brandSlug === "apple") {
    name = name.replace(/^apple\s+/i, "");
  } else if (brandSlug === "samsung") {
    name = name.replace(/^samsung\s+/i, "");
  } else if (brandSlug === "google-pixel" || brandSlug === "google") {
    name = name.replace(/^google\s+/i, "");
  } else if (brandSlug === "oneplus") {
    // Ensure OnePlus is capitalized properly
    name = name.replace(/^oneplus\s+/i, "OnePlus ");
    if (!name.startsWith("OnePlus ")) {
      name = `OnePlus ${name}`;
    }
  } else if (brandSlug === "poco") {
    name = name.replace(/^poco\s+/i, "POCO ");
    if (!name.startsWith("POCO ")) {
      name = `POCO ${name}`;
    }
  }

  // 2. Token-level dictionary replacements
  const words = name.split(" ");
  const formattedWords = words.map((w) => {
    const lower = w.toLowerCase();

    // Specific Acronyms & Terms
    switch (lower) {
      case "5g":
        return "5G";
      case "4g":
        return "4G";
      case "lte":
        return "LTE";
      case "pro":
        return "Pro";
      case "pro+":
      case "proplus":
        return "Pro+";
      case "max":
        return "Max";
      case "plus":
      case "+":
        return "Plus";
      case "mini":
        return "mini";
      case "se":
        return "SE";
      case "fe":
        return "FE";
      case "gt":
        return "GT";
      case "ce":
        return "CE";
      case "ultra":
        return "Ultra";
      case "fold":
        return "Fold";
      case "flip":
        return "Flip";
      case "lite":
        return "Lite";
      case "prime":
        return "Prime";
      case "neo":
        return "Neo";
      case "narzo":
        return "Narzo";
      case "note":
        return "Note";
      case "galaxy":
        return "Galaxy";
      case "pixel":
        return "Pixel";
      case "iphone":
        return "iPhone";
      case "ipad":
        return "iPad";
      case "iqoo":
        return "iQOO";
      case "oneplus":
        return "OnePlus";
      case "redmi":
        return "Redmi";
      case "xiaomi":
        return "Xiaomi";
      case "moto":
        return "Moto";
      case "edge":
        return "Edge";
      case "razr":
        return "Razr";
      default:
        break;
    }

    // Series alphanumeric patterns (e.g., s23 -> S23, a54 -> A54, z50 -> Z50, c65 -> C65)
    if (/^[a-z][0-9]+$/i.test(w)) {
      return w.toUpperCase();
    }

    // Google Pixel 'a' series (e.g. 7a, 8a, 6a)
    if (/^[0-9]+a$/i.test(w)) {
      return w.toLowerCase();
    }

    // Default Title Case
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  let result = formattedWords.join(" ");

  // Final sanity polish
  result = result.replace(/\bIphone\b/g, "iPhone");
  result = result.replace(/\bIpad\b/g, "iPad");
  result = result.replace(/\bIqoo\b/g, "iQOO");
  result = result.replace(/\bPoco\b/g, "POCO");

  return result;
}

/**
 * Generates a clean URL slug from model name.
 */
function generateCleanSlug(name: string, brandSlug: string): string {
  let s = name.toLowerCase();

  // Replace symbols
  s = s.replace(/\+/g, "-plus");
  s = s.replace(/&/g, "-and");
  s = s.replace(/[^a-z0-9]+/g, "-");
  s = s.replace(/^-+|-+$/g, "");

  // If brand is not already in slug, consider whether to prepend
  if (brandSlug === "apple" && !s.startsWith("iphone") && !s.startsWith("ipad")) {
    s = `iphone-${s}`;
  }

  return s;
}

// ============================================================================
// CANONICAL MODEL SELECTION & CLUSTERING
// ============================================================================

interface DuplicateCluster {
  canonical: IDeviceModel;
  phase1Duplicates: IDeviceModel[]; // No services attached (delete 1st)
  phase2Duplicates: IDeviceModel[]; // Has services attached (merge & delete 2nd)
  similarityReasons: string[];
}

/**
 * Scores a model to pick the best master/canonical record to keep.
 */
function scoreModelCandidate(m: IDeviceModel): number {
  let score = 0;

  // 1. Attached services is the highest value
  const serviceCount = Array.isArray(m.servicePricing) ? m.servicePricing.length : 0;
  score += serviceCount * 100;

  // 2. Metadata completeness
  if (m.imageUrl && m.imageUrl.trim().length > 0) score += 25;
  if (m.releaseYear && m.releaseYear > 2000) score += 15;
  if (m.isPopular) score += 10;
  if (m.isActive) score += 5;

  // 3. Clean slug penalty for duplicate markers (-1, -copy, etc.)
  if (/-(?:copy|duplicate|\d+)$/i.test(m.slug)) score -= 30;

  // 4. Name casing quality (penalize all-lowercase or all-uppercase)
  if (m.name === m.name.toLowerCase() || m.name === m.name.toUpperCase()) {
    score -= 10;
  }

  return score;
}

/**
 * Groups models under a brand into duplicate clusters using Disjoint-Set (Union-Find).
 */
function findDuplicateClusters(
  models: IDeviceModel[],
  brand: IBrand,
  threshold: number
): DuplicateCluster[] {
  const n = models.length;
  if (n <= 1) return [];

  // Union-Find parent array
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const reasons: Map<string, string[]> = new Map();

  function find(i: number): number {
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]);
    return parent[i];
  }

  function union(i: number, j: number, reason: string): void {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      const key = `${Math.min(rootI, rootJ)}-${Math.max(rootI, rootJ)}`;
      if (!reasons.has(key)) reasons.set(key, []);
      reasons.get(key)!.push(reason);
    }
  }

  // Compare all pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const match = areModelsSimilar(models[i], models[j], brand, threshold);
      if (match.isSimilar) {
        union(i, j, `${models[i].name} ≈ ${models[j].name} (${match.reason})`);
      }
    }
  }

  // Group by root representative
  const groups: Map<number, IDeviceModel[]> = new Map();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(models[i]);
  }

  const clusters: DuplicateCluster[] = [];

  for (const [, groupModels] of groups) {
    if (groupModels.length <= 1) continue; // No duplicates

    // Sort models by quality score descending
    groupModels.sort((a, b) => scoreModelCandidate(b) - scoreModelCandidate(a));

    const canonical = groupModels[0];
    const duplicates = groupModels.slice(1);

    const phase1Duplicates: IDeviceModel[] = [];
    const phase2Duplicates: IDeviceModel[] = [];

    for (const dup of duplicates) {
      const sCount = Array.isArray(dup.servicePricing) ? dup.servicePricing.length : 0;
      if (sCount === 0) {
        phase1Duplicates.push(dup);
      } else {
        phase2Duplicates.push(dup);
      }
    }

    clusters.push({
      canonical,
      phase1Duplicates,
      phase2Duplicates,
      similarityReasons: reasons.get(find(0).toString()) || ["Fuzzy similarity match"],
    });
  }

  return clusters;
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

async function runCleanupScript(): Promise<void> {
  const config = parseCliArgs();

  if (config.help) {
    printHelp();
    return;
  }

  console.log("\n================================================================================");
  console.log("🛠️   QUICKFIX MOBILE: MODEL CATALOGUE CLEANUP & SERVICE PRICING SCRIPT");
  console.log("================================================================================");
  console.log(` Mode:        ${config.dryRun ? "🔍 DRY RUN (Preview only, no DB writes)" : "⚡ EXECUTE MODE (Applying live DB mutations)"}`);
  console.log(` Threshold:   ${config.threshold}`);
  if (config.brandFilter) {
    console.log(` Brand:       ${config.brandFilter}`);
  }
  console.log("================================================================================\n");

  // 1. Connect to Database
  console.log("📡 Connecting to MongoDB via connectDb()...");
  await connectDb();
  console.log("✅ Database connection established.\n");

  // 2. Fetch all Brands, Repair Services, and Models
  console.log("📦 Fetching catalogue data from MongoDB...");
  const brandQuery = config.brandFilter ? { slug: config.brandFilter } : {};
  const brands = await Brand.find(brandQuery).sort({ displayOrder: 1, name: 1 });
  const services = await RepairService.find({ isActive: true }).sort({ isPopular: -1, name: 1 });
  const allModels = await DeviceModel.find({});

  console.log(`   - Brands found:          ${brands.length}`);
  console.log(`   - Active Services found: ${services.length}`);
  console.log(`   - Total Device Models:   ${allModels.length}\n`);

  if (brands.length === 0) {
    console.log("⚠️  No matching brands found. Exiting.");
    await mongoose.disconnect();
    return;
  }

  const serviceMap = new Map<string, IRepairService>();
  for (const s of services) {
    serviceMap.set(s.slug, s);
  }

  // Statistics trackers
  let totalClustersFound = 0;
  let totalPhase1Deleted = 0;
  let totalPhase2Deleted = 0;
  let totalServicesMerged = 0;
  let totalNamesStandardized = 0;
  let totalMarketServicesAttached = 0;

  // Process Brand by Brand
  for (const brand of brands) {
    const brandModels = allModels.filter(
      (m) => m.brand && m.brand.toString() === brand._id.toString()
    );

    console.log(`--------------------------------------------------------------------------------`);
    console.log(`🏢 Brand: ${brand.name.toUpperCase()} (${brand.slug}) - ${brandModels.length} models`);
    console.log(`--------------------------------------------------------------------------------`);

    if (brandModels.length === 0) {
      console.log(`   No models registered under ${brand.name}.\n`);
      continue;
    }

    // ------------------------------------------------------------------------
    // STEP 1 & 2: FIND SIMILAR MODELS UNDER BRAND
    // ------------------------------------------------------------------------
    const clusters = findDuplicateClusters(brandModels, brand, config.threshold);

    if (clusters.length === 0) {
      console.log(`   ✓ No duplicate models detected under ${brand.name}.`);
    } else {
      console.log(`   ⚠️  Found ${clusters.length} duplicate cluster(s) under ${brand.name}:`);

      for (let idx = 0; idx < clusters.length; idx++) {
        const cluster = clusters[idx];
        totalClustersFound++;

        const canonicalSvcCount = cluster.canonical.servicePricing?.length || 0;
        console.log(`\n   [Cluster #${idx + 1}]`);
        console.log(`     👑 CANONICAL (KEEP): "${cluster.canonical.name}" (Slug: ${cluster.canonical.slug}) [${canonicalSvcCount} services, ID: ${cluster.canonical._id}]`);

        // Phase 1 Duplicates (No services)
        if (cluster.phase1Duplicates.length > 0) {
          console.log(`     🗑️  Phase 1 (Delete 1st - Zero Services):`);
          for (const d of cluster.phase1Duplicates) {
            console.log(`        - "${d.name}" (Slug: ${d.slug}) [0 services, ID: ${d._id}]`);
          }
        }

        // Phase 2 Duplicates (With services)
        if (cluster.phase2Duplicates.length > 0) {
          console.log(`     🔄 Phase 2 (Merge & Delete 2nd - Has Services):`);
          for (const d of cluster.phase2Duplicates) {
            const dCount = d.servicePricing?.length || 0;
            console.log(`        - "${d.name}" (Slug: ${d.slug}) [${dCount} services, ID: ${d._id}]`);
          }
        }

        // --------------------------------------------------------------------
        // STEP 3: DELETING / MERGING DUPLICATES
        // --------------------------------------------------------------------
        if (config.dryRun) {
          totalPhase1Deleted += cluster.phase1Duplicates.length;
          totalPhase2Deleted += cluster.phase2Duplicates.length;
          console.log(`     [DRY RUN] Would delete ${cluster.phase1Duplicates.length} empty duplicate(s) first, then merge & remove ${cluster.phase2Duplicates.length} service duplicate(s).`);
        } else {
          // --- Phase 1: Delete duplicates with NO services attached 1st ---
          for (const p1 of cluster.phase1Duplicates) {
            await DeviceModel.deleteOne({ _id: p1._id });
            totalPhase1Deleted++;
            console.log(`     ⚡ [Deleted Phase 1]: "${p1.name}" (${p1._id})`);
          }

          // --- Phase 2: Merge unique services & remove remaining duplicates ---
          const canonicalDoc = await DeviceModel.findById(cluster.canonical._id);
          if (canonicalDoc) {
            let updatedPricing = [...(canonicalDoc.servicePricing || [])];
            let servicesMergedForCluster = 0;

            for (const p2 of cluster.phase2Duplicates) {
              if (Array.isArray(p2.servicePricing)) {
                for (const item of p2.servicePricing) {
                  const alreadyExists = updatedPricing.some(
                    (existing) => existing.service.toString() === item.service.toString()
                  );
                  if (!alreadyExists) {
                    updatedPricing.push(item);
                    servicesMergedForCluster++;
                    totalServicesMerged++;
                  }
                }
              }

              // Also copy image or releaseYear if canonical was missing it
              if (!canonicalDoc.imageUrl && p2.imageUrl) {
                canonicalDoc.imageUrl = p2.imageUrl;
              }
              if (!canonicalDoc.releaseYear && p2.releaseYear) {
                canonicalDoc.releaseYear = p2.releaseYear;
              }

              // Delete the phase 2 duplicate after merging
              await DeviceModel.deleteOne({ _id: p2._id });
              totalPhase2Deleted++;
              console.log(`     ⚡ [Deleted Phase 2]: "${p2.name}" (${p2._id})`);
            }

            if (servicesMergedForCluster > 0) {
              canonicalDoc.servicePricing = updatedPricing;
              await canonicalDoc.save();
              console.log(`     ✓ Migrated ${servicesMergedForCluster} unique service pricing items to canonical "${canonicalDoc.name}".`);
            }
          }
        }
      }
    }

    // ------------------------------------------------------------------------
    // STEP 4: ENSURE MODEL NAMES ARE IN LINE WITH REST OF MODELS
    // ------------------------------------------------------------------------
    console.log(`\n   📐 Checking model naming consistency for ${brand.name}...`);
    // Re-fetch or filter surviving models for this brand
    const survivingModels = config.dryRun
      ? brandModels.filter((m) => {
          // In dry-run, pretend duplicates are removed so we inspect surviving canonical + non-duplicates
          for (const c of clusters) {
            if (
              c.phase1Duplicates.some((d) => d._id.toString() === m._id.toString()) ||
              c.phase2Duplicates.some((d) => d._id.toString() === m._id.toString())
            ) {
              return false;
            }
          }
          return true;
        })
      : await DeviceModel.find({ brand: brand._id });

    for (const model of survivingModels) {
      const standardizedName = standardizeModelName(model.name, brand.name, brand.slug);
      const targetSlug = generateCleanSlug(standardizedName, brand.slug);

      const needsNameUpdate = model.name !== standardizedName;
      const hasDuplicateSlugSuffix = /-(?:copy|duplicate|\d+)$/i.test(model.slug);
      const needsSlugUpdate = hasDuplicateSlugSuffix && model.slug !== targetSlug;

      if (needsNameUpdate || needsSlugUpdate) {
        totalNamesStandardized++;
        console.log(`     ✨ [Name Format] "${model.name}" -> "${standardizedName}" (Slug: ${model.slug} -> ${targetSlug})`);

        if (!config.dryRun) {
          // Check if targetSlug is taken by another model
          let finalSlug = model.slug;
          if (needsSlugUpdate) {
            const slugCollision = await DeviceModel.findOne({
              slug: targetSlug,
              _id: { $ne: model._id },
            });
            finalSlug = slugCollision ? `${targetSlug}-${Date.now().toString().slice(-4)}` : targetSlug;
          }

          await DeviceModel.updateOne(
            { _id: model._id },
            {
              $set: {
                name: standardizedName,
                slug: finalSlug,
              },
            }
          );
        }
      }
    }

    // ------------------------------------------------------------------------
    // STEP 5: ATTACH SERVICES AT MARKET RATE FOR MODELS WITH NO SERVICES
    // ------------------------------------------------------------------------
    console.log(`\n   💰 Checking models with NO services attached for ${brand.name}...`);
    for (const model of survivingModels) {
      const serviceCount = model.servicePricing?.length || 0;

      if (serviceCount === 0) {
        totalMarketServicesAttached++;
        const tier = detectDeviceTier(model.name, brand.slug);
        const tierRates = MARKET_TIER_PRICES[tier];

        const newServicePricing: IModelServicePrice[] = [];

        for (const s of services) {
          const marketPrice = tierRates[s.slug] ?? s.startingPrice ?? 999;
          newServicePricing.push({
            service: s._id as Types.ObjectId,
            price: marketPrice,
            estimatedTimeMinutes: s.estimatedTimeMinutes || 30,
          });
        }

        console.log(`     🛠️  [Attach Market Rates] "${model.name}" -> Tier: [${tier.toUpperCase()}], attaching ${newServicePricing.length} services (e.g. Screen: ₹${tierRates["screen-replacement"] || 2499}, Battery: ₹${tierRates["battery-replacement"] || 1299})`);

        if (!config.dryRun) {
          await DeviceModel.updateOne(
            { _id: model._id },
            {
              $set: {
                servicePricing: newServicePricing,
              },
            }
          );
        }
      }
    }

    console.log("");
  }

  // ============================================================================
  // SUMMARY REPORT
  // ============================================================================
  console.log("================================================================================");
  console.log("📊 EXECUTION SUMMARY REPORT");
  console.log("================================================================================");
  console.log(` Execution Mode:                   ${config.dryRun ? "🔍 DRY RUN (Simulated)" : "⚡ LIVE EXECUTION (Applied)"}`);
  console.log(` Brands Processed:                 ${brands.length}`);
  console.log(` Duplicate Clusters Detected:      ${totalClustersFound}`);
  console.log(` Phase 1 Duplicates (No services): ${totalPhase1Deleted} ${config.dryRun ? "to delete" : "deleted"}`);
  console.log(` Phase 2 Duplicates (Has services):${totalPhase2Deleted} ${config.dryRun ? "to merge & remove" : "merged & removed"}`);
  if (!config.dryRun) {
    console.log(` Service Items Migrated to Master: ${totalServicesMerged}`);
  }
  console.log(` Model Names Standardized:         ${totalNamesStandardized} ${config.dryRun ? "to update" : "updated"}`);
  console.log(` Models Attached with Market Rates:${totalMarketServicesAttached} ${config.dryRun ? "to populate" : "populated"}`);
  console.log("================================================================================");

  if (config.dryRun) {
    console.log("\n💡 NOTE: This was a DRY RUN. No database modifications were committed.");
    console.log("To apply the deletions, name formatting, and service attachments, re-run with:");
    console.log("\n   npm run cleanup:models -- --execute");
    console.log("   OR");
    console.log("   node --env-file=.env --experimental-strip-types scripts/cleanup-models.ts --execute\n");
  } else {
    console.log("\n✨ Database cleanup and service attachment completed successfully!\n");
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
}

// Run script
runCleanupScript().catch((err) => {
  console.error("\n❌ Fatal script error:", err);
  process.exit(1);
});
