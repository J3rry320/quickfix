import { connectDb } from "@/lib/mongodb";
import { Brand } from "@/models/Brand";
import { RepairService } from "@/models/RepairService";
import { DeviceModel } from "@/models/DeviceModel";
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
  icon?: string;
  image?: string;
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
  try {
    await connectDb();
    const brands = await Brand.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(brands));
  } catch (err) {
    console.error("Error fetching brands from db:", err);
    return [];
  }
}

/**
 * Fetch single brand by slug from MongoDB
 */
export async function getDbBrandBySlug(slug: string): Promise<DbBrandItem | null> {
  try {
    await connectDb();
    const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
    if (!brand) return null;
    return JSON.parse(JSON.stringify(brand));
  } catch (err) {
    console.error("Error fetching brand by slug from db:", err);
    return null;
  }
}

/**
 * Fetch all active services from MongoDB ordered by isPopular and name
 */
export async function getDbServices(): Promise<DbServiceItem[]> {
  try {
    await connectDb();
    const services = await RepairService.find({ isActive: true })
      .sort({ isPopular: -1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(services));
  } catch (err) {
    console.error("Error fetching services from db:", err);
    return [];
  }
}

/**
 * Fetch single service by slug from MongoDB
 */
export async function getDbServiceBySlug(slug: string): Promise<DbServiceItem | null> {
  try {
    await connectDb();
    const service = await RepairService.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
    if (!service) return null;
    return JSON.parse(JSON.stringify(service));
  } catch (err) {
    console.error("Error fetching service by slug from db:", err);
    return null;
  }
}

/**
 * Fetch all models for a specific brand slug from MongoDB
 */
export async function getDbModelsForBrand(brandSlug: string): Promise<DbDeviceModelItem[]> {
  try {
    await connectDb();
    const brand = await Brand.findOne({ slug: brandSlug.toLowerCase(), isActive: true }).lean();
    if (!brand) return [];

    const models = await DeviceModel.find({ brand: brand._id, isActive: true })
      .sort({ isPopular: -1, releaseYear: -1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(models));
  } catch (err) {
    console.error("Error fetching models for brand from db:", err);
    return [];
  }
}

/**
 * Fetch a specific device model by brand slug and model slug with populated service pricing
 */
export async function getDbModelBySlug(
  brandSlug: string,
  modelSlug: string
): Promise<{ brand: DbBrandItem; model: DbDeviceModelItem } | null> {
  try {
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
  } catch (err) {
    console.error("Error fetching model by slug from db:", err);
    return null;
  }
}

/**
 * Fetch all active models with brand populated
 */
export async function getAllDbModels(): Promise<Array<DbDeviceModelItem & { brand: DbBrandItem }>> {
  try {
    await connectDb();
    const models = await DeviceModel.find({ isActive: true })
      .populate("brand", "name slug logoUrl")
      .sort({ isPopular: -1, name: 1 })
      .lean();
    return JSON.parse(JSON.stringify(models));
  } catch (err) {
    console.error("Error fetching all db models:", err);
    return [];
  }
}

/**
 * Fetch brands that have models supporting a specific service
 */
export async function getBrandsForService(serviceSlug: string): Promise<DbBrandItem[]> {
  try {
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
  } catch (err) {
    console.error("Error fetching brands for service:", err);
    return [];
  }
}

/**
 * Static Params Helpers for dynamic routes
 */
export async function getStaticBrandSlugs(): Promise<string[]> {
  try {
    await connectDb();
    const brands = await Brand.find({ isActive: true }).select("slug").lean();
    return brands.map((b) => b.slug);
  } catch (err) {
    console.warn("Unable to fetch static brand slugs at build time, will render on demand:", err);
    return [];
  }
}

export async function getStaticServiceSlugs(): Promise<string[]> {
  try {
    await connectDb();
    const services = await RepairService.find({ isActive: true }).select("slug").lean();
    return services.map((s) => s.slug);
  } catch (err) {
    console.warn("Unable to fetch static service slugs at build time, will render on demand:", err);
    return [];
  }
}

export async function getStaticModelParams(): Promise<Array<{ slug: string; modelSlug: string }>> {
  try {
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
  } catch (err) {
    console.warn("Unable to fetch static model params at build time, will render on demand:", err);
    return [];
  }
}
