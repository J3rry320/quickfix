import { cacheLife, cacheTag } from "next/cache";
import { connectDb } from "@/lib/mongodb";
import { BlogPost, type IBlogPost } from "@/models/BlogPost";

export type DbBlogPostItem = Omit<IBlogPost, "_id"> & {
  _id: string;
};

export interface GetBlogsOptions {
  category?: string;
  tag?: string;
  language?: string;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Fetch published blogs with pagination and filtering
 */
export async function getDbPublishedBlogs(options: GetBlogsOptions = {}): Promise<{
  posts: DbBlogPostItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    await connectDb();

    const { category, tag, language = "en", page = 1, limit = 10, search } = options;
    const skip = (Math.max(1, page) - 1) * limit;

    const filter: Record<string, unknown> = {
      isPublished: true,
    };

    if (language && ["en", "hi", "mr"].includes(language)) {
      filter.language = language;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { excerpt: { $regex: search.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(search.trim(), "i")] } },
      ];
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;
    const hasMore = page < totalPages;

    return {
      posts: JSON.parse(JSON.stringify(posts)),
      total,
      totalPages,
      page,
      limit,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching published blogs from DB:", error);
    return {
      posts: [],
      total: 0,
      totalPages: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    };
  }
}

/**
 * Fetch single published blog post by slug and increment view count
 */
export async function getDbBlogPostBySlug(slug: string): Promise<DbBlogPostItem | null> {
  "use cache";
  cacheLife("days");
  cacheTag("blogs", `blog-${slug}`);

  try {
    await connectDb();

    const post = await BlogPost.findOneAndUpdate(
      { slug: slug.toLowerCase(), isPublished: true },
      { $inc: { viewCount: 1 } },
      { returnDocument: "after" }
    ).lean();

    if (!post) return null;

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error(`Error fetching blog post by slug [${slug}]:`, error);
    return null;
  }
}

/**
 * Fetch static blog slugs for static generation
 */
export async function getStaticBlogSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("days");
  cacheTag("blogs");

  try {
    await connectDb();
    const posts = await BlogPost.find({ isPublished: true }).select("slug").lean();
    return posts.map((p) => p.slug);
  } catch (error) {
    console.warn("Unable to fetch static blog slugs at build time:", error);
    return [];
  }
}

/**
 * Fetch unique categories of published blogs
 */
export async function getDbBlogCategories(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    await connectDb();
    const categories = await BlogPost.find({ isPublished: true }).distinct("category");
    return categories.filter(Boolean);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}
