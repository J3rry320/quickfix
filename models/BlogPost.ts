import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogAuthor {
  name: string;
  role?: string;
  avatar?: string;
}

export interface IBlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: IBlogAuthor;
  category: string;
  tags: string[];
  language: "en" | "hi" | "mr";
  readingTimeMinutes: number;
  seo: IBlogSeo;
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    author: {
      name: {
        type: String,
        default: "QuickFix Tech Team",
        trim: true,
      },
      role: {
        type: String,
        default: "Smartphone Specialist",
        trim: true,
      },
      avatar: {
        type: String,
        trim: true,
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    language: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
      index: true,
    },
    readingTimeMinutes: {
      type: Number,
      default: 4,
      min: 1,
    },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: { type: [String], default: [] },
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
