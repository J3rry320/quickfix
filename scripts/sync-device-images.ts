/**
 * Cross-Database Image Synchronization Script
 * 
 * Fetches phone models and brands with their image URLs from the source MongoDB database
 * (online-mobile-repair-shop), intelligently matches them against the equivalent models
 * and brands in the target MongoDB database (quick_fix), and updates imageUrl / logoUrl.
 * 
 * Usage:
 *   node --experimental-strip-types scripts/sync-device-images.ts --source="<source_mongo_uri>" --target="<target_mongo_uri>" [options]
 * 
 * Or via environment variables:
 *   SOURCE_MONGODB_URI="..." TARGET_MONGODB_URI="..." npm run sync:images
 * 
 * Options:
 *   --source, --source-uri, --source-url  Source MongoDB connection string
 *   --target, --target-uri, --target-url  Target MongoDB connection string (falls back to MONGODB_URI)
 *   --dry-run                             Simulate match and updates without modifying the database
 *   --no-brands, --models-only            Only update phone models, do not update brand logos
 *   --no-overwrite                        Do not overwrite if target already has an imageUrl/logoUrl
 *   --verbose                             Print detailed matching decisions
 *   --help, -h                            Show help information
 */

import mongoose from "mongoose";

// ============================================================================
// Types
// ============================================================================
interface CliOptions {
  sourceUri: string;
  targetUri: string;
  dryRun: boolean;
  updateBrands: boolean;
  overwrite: boolean;
  verbose: boolean;
  help: boolean;
}

interface SourceCompany {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  logoUrl?: string;
}

interface SourcePhoneModel {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  slug?: string;
  company?: string | mongoose.Types.ObjectId;
  imageUrl?: string;
}

interface TargetBrand {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface TargetDeviceModel {
  _id: string | mongoose.Types.ObjectId;
  brand: string | mongoose.Types.ObjectId;
  name: string;
  slug: string;
  imageUrl?: string;
}

interface MatchResult {
  sourceModel: SourcePhoneModel;
  targetModel: TargetDeviceModel;
  sourceBrandName?: string;
  targetBrandName?: string;
  strategy: string;
  imageUrl: string;
  status: "updated" | "skipped_has_image" | "dry_run";
}

interface BrandMatchResult {
  sourceCompany: SourceCompany;
  targetBrand: TargetBrand;
  logoUrl: string;
  status: "updated" | "skipped_has_logo" | "dry_run";
}

// ============================================================================
// CLI Parsing & Configuration
// ============================================================================
function parseArguments(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    sourceUri: process.env.SOURCE_MONGODB_URI || process.env.SOURCE_MONGO_URL || "",
    targetUri: process.env.TARGET_MONGODB_URI || process.env.TARGET_MONGO_URL || process.env.MONGODB_URI || "",
    dryRun: false,
    updateBrands: true,
    overwrite: true,
    verbose: false,
    help: false,
  };

  const positionalArgs: string[] = [];

  for (const arg of args) {
    if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-brands" || arg === "--models-only") {
      options.updateBrands = false;
    } else if (arg === "--no-overwrite") {
      options.overwrite = false;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg.startsWith("--source-uri=")) {
      options.sourceUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (arg.startsWith("--source=")) {
      options.sourceUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (arg.startsWith("--source-url=")) {
      options.sourceUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (arg.startsWith("--target-uri=")) {
      options.targetUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (arg.startsWith("--target=")) {
      options.targetUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (arg.startsWith("--target-url=")) {
      options.targetUri = arg.split("=")[1].replace(/^["']|["']$/g, "").trim();
    } else if (!arg.startsWith("--")) {
      positionalArgs.push(arg.replace(/^["']|["']$/g, "").trim());
    }
  }

  // Handle positional arguments: script.ts [sourceUri] [targetUri]
  if (!options.sourceUri && positionalArgs.length > 0) {
    options.sourceUri = positionalArgs[0];
  }
  if (!options.targetUri && positionalArgs.length > 1) {
    options.targetUri = positionalArgs[1];
  }

  return options;
}

function printHelp(): void {
  console.log(`
Cross-Database Image Synchronization Script
===========================================
Transfers model pictures and brand logos from 'online-mobile-repair-shop' MongoDB
to 'quick_fix' MongoDB.

USAGE:
  node --experimental-strip-types scripts/sync-device-images.ts [OPTIONS]
  npm run sync:images -- [OPTIONS]

OPTIONS:
  --source="<URI>"          Source MongoDB connection URI (online-mobile-repair-shop)
  --target="<URI>"          Target MongoDB connection URI (quick_fix)
  --dry-run                 Simulate matching and preview updates without writing to DB
  --no-brands               Only update phone models, skip brand logos
  --models-only             Alias for --no-brands
  --no-overwrite            Skip models or brands that already have an imageUrl / logoUrl
  --verbose                 Display detailed match decisions and comparisons
  -h, --help                Show this help screen

ENVIRONMENT VARIABLES:
  SOURCE_MONGODB_URI, SOURCE_MONGO_URL   Source MongoDB connection string
  TARGET_MONGODB_URI, TARGET_MONGO_URL   Target MongoDB connection string
  MONGODB_URI                            Fallback target MongoDB connection string

EXAMPLES:
  # 1. Preview matching in dry-run mode
  node --experimental-strip-types scripts/sync-device-images.ts \\
    --source="mongodb+srv://user:pass@cluster.../sourceDb" \\
    --target="mongodb+srv://user:pass@cluster.../targetDb" \\
    --dry-run

  # 2. Execute full sync with environment variables
  export SOURCE_MONGODB_URI="mongodb+srv://..."
  export TARGET_MONGODB_URI="mongodb+srv://..."
  npm run sync:images

  # 3. Direct execution with positional args
  node --experimental-strip-types scripts/sync-device-images.ts \\
    "mongodb+srv://...source..." \\
    "mongodb+srv://...target..."
`);
}

function maskMongoUri(uri: string): string {
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, "$1****$3");
  } catch {
    return "<configured-uri>";
  }
}

// ============================================================================
// Normalization & Matching Utilities
// ============================================================================
const BRAND_ALIASES: Record<string, string> = {
  "google": "google-pixel",
  "google pixel": "google-pixel",
  "pixel": "google-pixel",
  "moto": "motorola",
  "mi": "xiaomi",
  "redmi": "xiaomi",
};

function normalizeBrand(nameOrSlug: string): string {
  const clean = nameOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BRAND_ALIASES[clean] || BRAND_ALIASES[nameOrSlug.toLowerCase()] || clean;
}

function normalizeModelName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[()[\]{}\-_,./\\:;]/g, " ")
    .replace(/\b(3rd|3|third)\s*gen(eration)?\b/g, " 3 ")
    .replace(/\b(2nd|2|second)\s*gen(eration)?\b/g, " 2 ")
    .replace(/\b(1st|1|first)\s*gen(eration)?\b/g, " 1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripBrandPrefix(normalizedName: string, brandName: string): string {
  const brandNorm = brandName.toLowerCase();
  let result = normalizedName;
  if (result.startsWith(brandNorm + " ")) {
    result = result.substring(brandNorm.length).trim();
  }
  return result;
}

/**
 * Strip network/connectivity badges like "5g", "4g", "lte" from slugs.
 * E.g. "oneplus-11-5g" -> "oneplus-11", "galaxy-a54-5g" -> "galaxy-a54"
 */
function stripConnectivitySlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/-(5g|4g|lte)(-uw|-uc)?$/i, "")
    .trim();
}

/**
 * Strip network/connectivity badges from normalized model names.
 * E.g. "oneplus 11 5g" -> "oneplus 11", "galaxy a54 5g" -> "galaxy a54"
 */
function stripConnectivityName(norm: string): string {
  return norm
    .replace(/\b(5g|4g|lte)(\s*(uw|uc))?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract all standalone numbers from string (e.g. "15", "24", "7")
function extractNumbers(str: string): string[] {
  const matches = str.match(/\b\d+\b/g);
  return matches ? matches : [];
}

// Critical model modifier tokens that MUST match
const CRITICAL_MODIFIERS = [
  "pro",
  "max",
  "plus",
  "mini",
  "ultra",
  "fe",
  "lite",
  "neo",
  "fold",
  "flip",
  "play",
  "power",
  "edge",
  "se",
];

function extractModifiers(str: string): Set<string> {
  const tokens = str.toLowerCase().split(/\s+/);
  const found = new Set<string>();
  for (const token of tokens) {
    if (CRITICAL_MODIFIERS.includes(token)) {
      found.add(token);
    }
  }
  return found;
}

function setsAreEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const item of a) {
    if (!b.has(item)) return false;
  }
  return true;
}

/**
 * Match a source model to target models.
 * Prioritizes target models of the same brand, then applies matching tiers.
 */
function findTargetModelMatch(
  source: SourcePhoneModel,
  sourceBrandName: string | undefined,
  targetModels: TargetDeviceModel[],
  targetBrandMap: Map<string, TargetBrand>,
  verbose: boolean
): { target: TargetDeviceModel; strategy: string } | null {
  const sourceName = source.name.trim();
  const sourceSlug = (source.slug || "").toLowerCase().trim();
  const sourceNorm = normalizeModelName(sourceName);
  const sourceNumbers = extractNumbers(sourceNorm);
  const sourceModifiers = extractModifiers(sourceNorm);

  const sourceBrandNorm = sourceBrandName ? normalizeBrand(sourceBrandName) : "";

  // Filter target models to those in matching brand if source brand is known
  let candidates = targetModels;
  if (sourceBrandNorm) {
    const brandCandidates = targetModels.filter((tm) => {
      const brand = targetBrandMap.get(String(tm.brand));
      if (!brand) return false;
      return (
        normalizeBrand(brand.name) === sourceBrandNorm ||
        normalizeBrand(brand.slug) === sourceBrandNorm
      );
    });

    // If we found brand-matching candidates, restrict to them
    if (brandCandidates.length > 0) {
      candidates = brandCandidates;
    }
  }

  // Tier 1: Exact Slug Match
  if (sourceSlug) {
    const slugMatch = candidates.find((tm) => tm.slug.toLowerCase().trim() === sourceSlug);
    if (slugMatch) {
      return { target: slugMatch, strategy: "exact_slug" };
    }
  }

  // Tier 2: Exact Name Match (case-insensitive)
  const exactNameMatch = candidates.find(
    (tm) => tm.name.toLowerCase().trim() === sourceName.toLowerCase()
  );
  if (exactNameMatch) {
    return { target: exactNameMatch, strategy: "exact_name" };
  }

  // Tier 3: Normalized Name Match
  const normMatch = candidates.find((tm) => {
    const targetNorm = normalizeModelName(tm.name);
    return targetNorm === sourceNorm;
  });
  if (normMatch) {
    return { target: normMatch, strategy: "normalized_name" };
  }

  // Tier 4: Brand-Stripped Match
  // E.g. "Samsung Galaxy S24 Ultra" vs "Galaxy S24 Ultra"
  const strippedSource = sourceBrandName ? stripBrandPrefix(sourceNorm, sourceBrandName) : sourceNorm;
  for (const candidate of candidates) {
    const targetBrand = targetBrandMap.get(String(candidate.brand));
    const targetBrandName = targetBrand?.name || "";
    const targetNorm = normalizeModelName(candidate.name);
    const strippedTarget = targetBrandName ? stripBrandPrefix(targetNorm, targetBrandName) : targetNorm;

    if (strippedSource === strippedTarget && strippedSource.length > 0) {
      // Guard: modifiers and numbers must match
      const targetNumbers = extractNumbers(targetNorm);
      const targetModifiers = extractModifiers(targetNorm);
      if (
        sourceNumbers.join(",") === targetNumbers.join(",") &&
        setsAreEqual(sourceModifiers, targetModifiers)
      ) {
        return { target: candidate, strategy: "brand_stripped_name" };
      }
    }
  }

  // Tier 5: Token Set Equality with Strict Guard
  // Tokens must contain all core identifiers, identical numbers, and identical modifiers
  const sourceTokens = new Set(sourceNorm.split(" ").filter((t) => t.length > 0));
  if (sourceBrandName) {
    sourceTokens.delete(sourceBrandName.toLowerCase());
  }

  for (const candidate of candidates) {
    const targetBrand = targetBrandMap.get(String(candidate.brand));
    const targetBrandName = targetBrand?.name || "";
    const targetNorm = normalizeModelName(candidate.name);
    const targetTokens = new Set(targetNorm.split(" ").filter((t) => t.length > 0));
    if (targetBrandName) {
      targetTokens.delete(targetBrandName.toLowerCase());
    }

    const targetNumbers = extractNumbers(targetNorm);
    const targetModifiers = extractModifiers(targetNorm);

    // Strict number check: numbers in model names must match exactly
    if (sourceNumbers.join(",") !== targetNumbers.join(",")) {
      continue;
    }

    // Strict modifier check: pro, max, plus, ultra, etc. must match exactly
    if (!setsAreEqual(sourceModifiers, targetModifiers)) {
      continue;
    }

    // Token check: either identical token set or candidate tokens subset/superset
    if (setsAreEqual(sourceTokens, targetTokens)) {
      return { target: candidate, strategy: "token_set_match" };
    }
  }

  // Tier 6: Complementary Connectivity Slug Match (e.g. oneplus-11 <-> oneplus-11-5g)
  if (sourceSlug) {
    const cleanSourceSlug = stripConnectivitySlug(sourceSlug);
    if (cleanSourceSlug.length > 0) {
      const slugConnMatch = candidates.find((tm) => {
        const cleanTargetSlug = stripConnectivitySlug(tm.slug);
        return cleanTargetSlug === cleanSourceSlug;
      });
      if (slugConnMatch) {
        return { target: slugConnMatch, strategy: "connectivity_slug" };
      }
    }
  }

  // Tier 7: Complementary Connectivity Name Match (e.g. "OnePlus 11" <-> "OnePlus 11 5G")
  const connStrippedSource = stripConnectivityName(sourceNorm);
  const connSourceNumbers = extractNumbers(connStrippedSource);
  const connSourceModifiers = extractModifiers(connStrippedSource);

  if (connStrippedSource.length > 0) {
    for (const candidate of candidates) {
      const targetNorm = normalizeModelName(candidate.name);
      const connStrippedTarget = stripConnectivityName(targetNorm);

      if (connStrippedSource === connStrippedTarget) {
        const targetNumbers = extractNumbers(connStrippedTarget);
        const targetModifiers = extractModifiers(connStrippedTarget);
        if (
          connSourceNumbers.join(",") === targetNumbers.join(",") &&
          setsAreEqual(connSourceModifiers, targetModifiers)
        ) {
          return { target: candidate, strategy: "connectivity_name" };
        }
      }
    }

    // Tier 8: Complementary Connectivity Brand-Stripped Match
    for (const candidate of candidates) {
      const targetBrand = targetBrandMap.get(String(candidate.brand));
      const targetBrandName = targetBrand?.name || "";
      const targetNorm = normalizeModelName(candidate.name);
      const connStrippedTarget = stripConnectivityName(targetNorm);

      const strippedSourceConn = sourceBrandName ? stripBrandPrefix(connStrippedSource, sourceBrandName) : connStrippedSource;
      const strippedTargetConn = targetBrandName ? stripBrandPrefix(connStrippedTarget, targetBrandName) : connStrippedTarget;

      if (strippedSourceConn === strippedTargetConn && strippedSourceConn.length > 0) {
        const targetNumbers = extractNumbers(connStrippedTarget);
        const targetModifiers = extractModifiers(connStrippedTarget);
        if (
          connSourceNumbers.join(",") === targetNumbers.join(",") &&
          setsAreEqual(connSourceModifiers, targetModifiers)
        ) {
          return { target: candidate, strategy: "connectivity_brand_stripped" };
        }
      }
    }
  }

  if (verbose) {
    console.log(`[VERBOSE] No match found for: "${sourceName}" (Brand: ${sourceBrandName || "Unknown"})`);
  }

  return null;
}

// ============================================================================
// Main Synchronization Routine
// ============================================================================
async function runSync(): Promise<void> {
  const options = parseArguments();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log("==================================================================");
  console.log("        QuickFix Database Image Synchronization Script            ");
  console.log("==================================================================");

  if (!options.sourceUri) {
    console.error("\n❌ ERROR: Source MongoDB URI is missing!");
    console.error("Please provide it via --source=\"<uri>\" or SOURCE_MONGODB_URI environment variable.");
    console.error("Run with --help to view detailed usage options.\n");
    process.exit(1);
  }

  if (!options.targetUri) {
    console.error("\n❌ ERROR: Target MongoDB URI is missing!");
    console.error("Please provide it via --target=\"<uri>\" or TARGET_MONGODB_URI / MONGODB_URI environment variable.");
    console.error("Run with --help to view detailed usage options.\n");
    process.exit(1);
  }

  console.log(`\n• Source DB:     ${maskMongoUri(options.sourceUri)}`);
  console.log(`• Target DB:     ${maskMongoUri(options.targetUri)}`);
  console.log(`• Mode:          ${options.dryRun ? "🔍 DRY-RUN (Preview Only - No DB writes)" : "⚡ LIVE EXECUTION (Writing changes)"}`);
  console.log(`• Sync Brands:   ${options.updateBrands ? "Yes (Models + Brand Logos)" : "No (Models Only)"}`);
  console.log(`• Overwrite:     ${options.overwrite ? "Yes (Update existing images)" : "No (Keep existing images)"}`);
  console.log(`• Verbose:       ${options.verbose ? "Yes" : "No"}\n`);

  let sourceConn: mongoose.Connection | null = null;
  let targetConn: mongoose.Connection | null = null;

  try {
    // 1. Establish connections
    console.log("Connecting to Source MongoDB...");
    sourceConn = mongoose.createConnection(options.sourceUri);
    await sourceConn.asPromise();
    console.log(" Connected to Source MongoDB.");

    console.log("Connecting to Target MongoDB...");
    targetConn = mongoose.createConnection(options.targetUri);
    await targetConn.asPromise();
    console.log(" Connected to Target MongoDB.\n");

    // 2. Discover collection names dynamically
    const sourceCollections = await sourceConn.db!.listCollections().toArray();

    const companyColName =
      sourceCollections.find((c) => ["companies", "company"].includes(c.name.toLowerCase()))?.name ||
      "companies";
    const phoneModelColName =
      sourceCollections.find((c) => ["phonemodels", "phonemodel", "models"].includes(c.name.toLowerCase()))?.name ||
      "phonemodels";

    const targetCollections = await targetConn.db!.listCollections().toArray();
    const brandColName =
      targetCollections.find((c) => ["brands", "brand"].includes(c.name.toLowerCase()))?.name ||
      "brands";
    const deviceModelColName =
      targetCollections.find((c) => ["devicemodels", "devicemodel", "models"].includes(c.name.toLowerCase()))?.name ||
      "devicemodels";

    // 3. Fetch data from Source DB
    console.log(`Fetching records from Source DB collections ('${companyColName}', '${phoneModelColName}')...`);
    const sourceCompaniesRaw = await sourceConn.db!.collection(companyColName).find({}).toArray();
    const sourceModelsRaw = await sourceConn.db!.collection(phoneModelColName).find({}).toArray();

    const sourceCompanies: SourceCompany[] = sourceCompaniesRaw.map((c) => ({
      _id: c._id,
      name: String(c.name || ""),
      slug: c.slug ? String(c.slug) : undefined,
      logoUrl: c.logoUrl ? String(c.logoUrl).trim() : undefined,
    }));

    const sourceModels: SourcePhoneModel[] = sourceModelsRaw.map((m) => ({
      _id: m._id,
      name: String(m.name || ""),
      slug: m.slug ? String(m.slug) : undefined,
      company: m.company,
      imageUrl: m.imageUrl ? String(m.imageUrl).trim() : undefined,
    }));

    const sourceCompanyMap = new Map<string, SourceCompany>();
    for (const c of sourceCompanies) {
      sourceCompanyMap.set(String(c._id), c);
    }

    const sourceModelsWithImage = sourceModels.filter(
      (m) => m.imageUrl && m.imageUrl.length > 0
    );

    console.log(` Found ${sourceCompanies.length} companies and ${sourceModels.length} models (${sourceModelsWithImage.length} have images) in Source DB.`);

    // 4. Fetch data from Target DB
    console.log(`Fetching records from Target DB collections ('${brandColName}', '${deviceModelColName}')...`);
    const targetBrandsRaw = await targetConn.db!.collection(brandColName).find({}).toArray();
    const targetModelsRaw = await targetConn.db!.collection(deviceModelColName).find({}).toArray();

    const targetBrands: TargetBrand[] = targetBrandsRaw.map((b) => ({
      _id: b._id,
      name: String(b.name || ""),
      slug: String(b.slug || ""),
      logoUrl: b.logoUrl ? String(b.logoUrl).trim() : undefined,
    }));

    const targetModels: TargetDeviceModel[] = targetModelsRaw.map((m) => ({
      _id: m._id,
      brand: m.brand,
      name: String(m.name || ""),
      slug: String(m.slug || ""),
      imageUrl: m.imageUrl ? String(m.imageUrl).trim() : undefined,
    }));

    const targetBrandMap = new Map<string, TargetBrand>();
    for (const b of targetBrands) {
      targetBrandMap.set(String(b._id), b);
    }

    console.log(` Found ${targetBrands.length} brands and ${targetModels.length} device models in Target DB.\n`);

    // 5. Match and update Brands (if enabled)
    const brandMatches: BrandMatchResult[] = [];
    if (options.updateBrands) {
      console.log("------------------------------------------------------------------");
      console.log("1. Matching & Updating Brand Logos");
      console.log("------------------------------------------------------------------");

      for (const sourceCompany of sourceCompanies) {
        if (!sourceCompany.logoUrl) continue;

        const sourceBrandNorm = normalizeBrand(sourceCompany.name);
        const matchedBrand = targetBrands.find((tb) => {
          return (
            normalizeBrand(tb.name) === sourceBrandNorm ||
            normalizeBrand(tb.slug) === sourceBrandNorm ||
            tb.name.toLowerCase().trim() === sourceCompany.name.toLowerCase().trim()
          );
        });

        if (matchedBrand) {
          const hasLogo = Boolean(matchedBrand.logoUrl && matchedBrand.logoUrl.length > 0);
          if (hasLogo && !options.overwrite) {
            brandMatches.push({
              sourceCompany,
              targetBrand: matchedBrand,
              logoUrl: sourceCompany.logoUrl,
              status: "skipped_has_logo",
            });
            console.log(`  [SKIP LOGO] ${matchedBrand.name} already has a logo`);
          } else {
            if (!options.dryRun) {
              await targetConn.db!.collection(brandColName).updateOne(
                { _id: new mongoose.Types.ObjectId(String(matchedBrand._id)) },
                { $set: { logoUrl: sourceCompany.logoUrl, updatedAt: new Date() } }
              );
            }
            brandMatches.push({
              sourceCompany,
              targetBrand: matchedBrand,
              logoUrl: sourceCompany.logoUrl,
              status: options.dryRun ? "dry_run" : "updated",
            });
            const tag = options.dryRun ? "[DRY-RUN LOGO]" : "[UPDATED LOGO]";
            console.log(`  ${tag} ${sourceCompany.name} -> ${matchedBrand.name} (${sourceCompany.logoUrl})`);
          }
        }
      }
      console.log(`Brand logos matched: ${brandMatches.length}\n`);
    }

    // 6. Match and update Phone Models
    console.log("------------------------------------------------------------------");
    console.log("2. Matching & Updating Phone Model Images");
    console.log("------------------------------------------------------------------");

    const modelMatches: MatchResult[] = [];
    const unmatchedSourceModels: SourcePhoneModel[] = [];

    for (const sourceModel of sourceModelsWithImage) {
      const sourceBrand = sourceModel.company
        ? sourceCompanyMap.get(String(sourceModel.company))
        : undefined;

      const match = findTargetModelMatch(
        sourceModel,
        sourceBrand?.name,
        targetModels,
        targetBrandMap,
        options.verbose
      );

      if (match) {
        const targetModel = match.target;
        const targetBrand = targetBrandMap.get(String(targetModel.brand));
        const hasImage = Boolean(targetModel.imageUrl && targetModel.imageUrl.length > 0);

        if (hasImage && !options.overwrite) {
          modelMatches.push({
            sourceModel,
            targetModel,
            sourceBrandName: sourceBrand?.name,
            targetBrandName: targetBrand?.name,
            strategy: match.strategy,
            imageUrl: sourceModel.imageUrl!,
            status: "skipped_has_image",
          });
          console.log(`  [SKIP IMAGE] "${targetModel.name}" already has an image (strategy: ${match.strategy})`);
        } else {
          if (!options.dryRun) {
            await targetConn.db!.collection(deviceModelColName).updateOne(
              { _id: new mongoose.Types.ObjectId(String(targetModel._id)) },
              { $set: { imageUrl: sourceModel.imageUrl, updatedAt: new Date() } }
            );
          }
          modelMatches.push({
            sourceModel,
            targetModel,
            sourceBrandName: sourceBrand?.name,
            targetBrandName: targetBrand?.name,
            strategy: match.strategy,
            imageUrl: sourceModel.imageUrl!,
            status: options.dryRun ? "dry_run" : "updated",
          });

          const tag = options.dryRun ? "[DRY-RUN]" : "[UPDATED]";
          console.log(
            `  ${tag} [${targetBrand?.name || "Device"}] "${sourceModel.name}" -> "${targetModel.name}" via ${match.strategy}`
          );
          if (options.verbose) {
            console.log(`           Image URL: ${sourceModel.imageUrl}`);
          }
        }
      } else {
        unmatchedSourceModels.push(sourceModel);
      }
    }

    // 7. Summary Report
    console.log("\n==================================================================");
    console.log("                        Sync Summary Report                       ");
    console.log("==================================================================");

    const updatedModelsCount = modelMatches.filter(
      (m) => m.status === "updated" || m.status === "dry_run"
    ).length;
    const skippedModelsCount = modelMatches.filter(
      (m) => m.status === "skipped_has_image"
    ).length;

    const updatedBrandsCount = brandMatches.filter(
      (b) => b.status === "updated" || b.status === "dry_run"
    ).length;

    console.log(`• Source models with images:       ${sourceModelsWithImage.length}`);
    console.log(`• Successfully matched models:     ${modelMatches.length}`);
    console.log(`  - ${options.dryRun ? "Would update" : "Updated"}:                     ${updatedModelsCount}`);
    console.log(`  - Skipped (already had image):   ${skippedModelsCount}`);
    console.log(`• Unmatched source models:         ${unmatchedSourceModels.length}`);
    if (options.updateBrands) {
      console.log(`• Brand logos updated:             ${updatedBrandsCount}`);
    }

    // Detail unmatched source models
    if (unmatchedSourceModels.length > 0) {
      console.log("\nUnmatched Source Models with Images:");
      for (const m of unmatchedSourceModels) {
        const brand = m.company ? sourceCompanyMap.get(String(m.company))?.name : "Unknown";
        console.log(`  - [${brand}] "${m.name}" (Slug: ${m.slug || "n/a"})`);
      }
    }

    // Check remaining target models without image
    const matchedTargetIds = new Set(modelMatches.map((m) => String(m.targetModel._id)));
    const targetModelsStillWithoutImage = targetModels.filter(
      (tm) => !tm.imageUrl && !matchedTargetIds.has(String(tm._id))
    );

    if (targetModelsStillWithoutImage.length > 0) {
      console.log(`\nTarget Models Still Without Image (${targetModelsStillWithoutImage.length}):`);
      const preview = targetModelsStillWithoutImage.slice(0, 10);
      for (const tm of preview) {
        const brand = targetBrandMap.get(String(tm.brand))?.name || "Unknown";
        console.log(`  - [${brand}] "${tm.name}" (Slug: ${tm.slug})`);
      }
      if (targetModelsStillWithoutImage.length > 10) {
        console.log(`  ... and ${targetModelsStillWithoutImage.length - 10} more.`);
      }
    }

    if (options.dryRun) {
      console.log("\n💡 Note: Running in DRY-RUN mode. No changes were committed to the database.");
      console.log("   To perform live updates, run without --dry-run.\n");
    } else {
      console.log("\n✅ Synchronization completed successfully!\n");
    }
  } catch (error) {
    console.error("\n❌ An error occurred during database image synchronization:", error);
    process.exit(1);
  } finally {
    if (sourceConn) {
      await sourceConn.close();
    }
    if (targetConn) {
      await targetConn.close();
    }
  }
}

runSync();
