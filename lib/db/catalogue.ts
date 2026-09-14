import { connectDb } from "@/lib/mongodb";
import { Brand, IBrand } from "@/models/Brand";
import { RepairService, IRepairService } from "@/models/RepairService";
import { DeviceModel, IDeviceModel } from "@/models/DeviceModel";
import localitiesData from "@/config/localities.json";

export interface DbBrandItem {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  isPopular: boolean;
  displayOrder: number;
}

export interface DbServiceItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  estimatedTimeMinutes: number;
  startingPrice: number;
  warrantyDays: number;
  isPopular: boolean;
  commonIssues: string[];
}

export interface DbPopulatedModelServicePrice {
  service: DbServiceItem;
  price: number;
  estimatedTimeMinutes: number;
}

export interface DbDeviceModelItem {
  _id: string;
  name: string;
  slug: string;
  brand: string | DbBrandItem;
  releaseYear?: number;
  imageUrl?: string;
  isPopular: boolean;
  servicePricing: DbPopulatedModelServicePrice[];
}

export interface LocalityItem {
  slug: string;
  name: string;
  zone: string;
  dispatchTime: string;
  pincode: string;
  landmark: string;
  popularNeighborhoods: string[];
}

export const LOCALITIES_CATALOG: LocalityItem[] = localitiesData as LocalityItem[];

/**
 * Fetch all active brands from MongoDB ordered by displayOrder and name
 */
export async function getDbBrands(): Promise<DbBrandItem[]> {
  await connectDb();
  const brands = await Brand.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(brands));
}

/**
 * Fetch single brand by slug from MongoDB
 */
export async function getDbBrandBySlug(slug: string): Promise<DbBrandItem | null> {
  await connectDb();
  const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
  if (!brand) return null;
  return JSON.parse(JSON.stringify(brand));
}

/**
 * Fetch all active services from MongoDB ordered by isPopular and name
 */
export async function getDbServices(): Promise<DbServiceItem[]> {
  await connectDb();
  const services = await RepairService.find({ isActive: true })
    .sort({ isPopular: -1, name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(services));
}

/**
 * Fetch single service by slug from MongoDB
 */
export async function getDbServiceBySlug(slug: string): Promise<DbServiceItem | null> {
  await connectDb();
  const service = await RepairService.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
  if (!service) return null;
  return JSON.parse(JSON.stringify(service));
}

/**
 * Fetch all models for a specific brand slug from MongoDB
 */
export async function getDbModelsForBrand(brandSlug: string): Promise<DbDeviceModelItem[]> {
  await connectDb();
  const brand = await Brand.findOne({ slug: brandSlug.toLowerCase(), isActive: true }).lean();
  if (!brand) return [];

  const models = await DeviceModel.find({ brand: brand._id, isActive: true })
    .sort({ isPopular: -1, releaseYear: -1, name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(models));
}

/**
 * Fetch a specific device model by brand slug and model slug with populated service pricing
 */
export async function getDbModelBySlug(
  brandSlug: string,
  modelSlug: string
): Promise<{ brand: DbBrandItem; model: DbDeviceModelItem } | null> {
  await connectDb();
  const brand = await Brand.findOne({ slug: brandSlug.toLowerCase(), isActive: true }).lean();
  if (!brand) return null;

  const model = await DeviceModel.findOne({
    brand: brand._id,
    slug: modelSlug.toLowerCase(),
    isActive: true,
  })
    .populate("servicePricing.service")
    .lean();

  if (!model) return null;

  return JSON.parse(
    JSON.stringify({
      brand,
      model,
    })
  );
}

/**
 * Fetch all active models with brand populated
 */
export async function getAllDbModels(): Promise<Array<DbDeviceModelItem & { brand: DbBrandItem }>> {
  await connectDb();
  const models = await DeviceModel.find({ isActive: true })
    .populate("brand", "name slug logoUrl")
    .sort({ isPopular: -1, name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(models));
}

/**
 * Fetch brands that have models supporting a specific service
 */
export async function getBrandsForService(serviceSlug: string): Promise<DbBrandItem[]> {
  await connectDb();
  const service = await RepairService.findOne({ slug: serviceSlug.toLowerCase(), isActive: true }).lean();
  if (!service) return getDbBrands();

  const brandIds = await DeviceModel.find({
    isActive: true,
    "servicePricing.service": service._id,
  }).distinct("brand");

  if (!brandIds || brandIds.length === 0) {
    return getDbBrands();
  }

  const brands = await Brand.find({ _id: { $in: brandIds }, isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(brands));
}

/**
 * Static Params Helpers for dynamic routes
 */
export async function getStaticBrandSlugs(): Promise<string[]> {
  await connectDb();
  const brands = await Brand.find({ isActive: true }).select("slug").lean();
  return brands.map((b) => b.slug);
}

export async function getStaticServiceSlugs(): Promise<string[]> {
  await connectDb();
  const services = await RepairService.find({ isActive: true }).select("slug").lean();
  return services.map((s) => s.slug);
}

export async function getStaticModelParams(): Promise<Array<{ slug: string; modelSlug: string }>> {
  await connectDb();
  const models = await DeviceModel.find({ isActive: true })
    .populate("brand", "slug")
    .select("slug brand")
    .lean();

  return models
    .filter((m) => m.brand && typeof (m.brand as unknown as { slug?: string }).slug === "string")
    .map((m) => ({
      slug: (m.brand as unknown as { slug: string }).slug,
      modelSlug: m.slug,
    }));
}
