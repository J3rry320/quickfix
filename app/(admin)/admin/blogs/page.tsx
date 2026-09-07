"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  Eye,
  FileText,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/ui/Skeleton";
import ImageUploadField from "@/components/admin/ImageUploadField";
import AdminImage from "@/components/admin/AdminImage";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  viewCount?: number;
  publishedAt?: string;
  createdAt: string;
}

const STATUS_TABS = [
  { label: "All Posts", value: "" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Repair Guides");
  const [tagsText, setTagsText] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");

  useEffect(() => {
    let isSubscribed = true;

    async function fetchBlogs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        params.set("limit", "50");

        const res = await fetch(`/api/admin/blogs?${params.toString()}`);
        const data = await res.json();
        if (isSubscribed) {
          if (data.success && Array.isArray(data.data?.blogs)) {
            setBlogs(data.data.blogs);
          } else {
            setBlogs([]);
          }
        }
      } catch (err) {
        console.error("Failed to load blog posts", err);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      isSubscribed = false;
    };
  }, [statusFilter, search, refreshIndex]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setCategory("Repair Guides");
    setTagsText("");
    setStatus("draft");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (b: BlogItem) => {
    setEditingBlog(b);
    setTitle(b.title);
    setSlug(b.slug);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setCoverImage(b.coverImage || "");
    setCategory(b.category);
    setTagsText((b.tags || []).join(", "));
    setStatus(b.status);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim() || undefined,
        category: category.trim(),
        tags,
        status,
      };

      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : "/api/admin/blogs";
      const method = editingBlog ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-QuickFix-CSRF": "1",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setRefreshIndex((k) => k + 1);
      } else {
        setFormError(data.error?.message || "Failed to save blog post");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete post "${postTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { "X-QuickFix-CSRF": "1" },
      });
      if (res.ok) {
        setRefreshIndex((k) => k + 1);
      }
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "archived":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <AdminShell
      title="Blog & Resource Management"
      subtitle="Create smartphone maintenance guides, SEO articles, and brand repair tutorials"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            title="Refresh articles"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            title="New Article"
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Article</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-clean-white border border-zinc-200 shadow-2xs">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-tech-slate text-clean-white shadow-2xs"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-tech-slate"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search blog articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-clean-white pl-9 pr-3 py-2 text-xs text-tech-slate placeholder-zinc-400 focus:border-flash-orange focus:outline-hidden"
            />
          </div>
        </div>

        {/* Blogs Table */}
        <div className="rounded-2xl border border-zinc-200 bg-clean-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5">Title & Excerpt</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Views</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Published Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-5 py-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-zinc-400">
                      No blog articles found.
                    </td>
                  </tr>
                ) : (
                  blogs.map((b) => (
                    <tr key={b._id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-5 py-4 max-w-md">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={b.coverImage}
                            alt={b.title}
                            fallbackIcon={FileText}
                            containerClassName="h-10 w-14 shrink-0 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-2xs overflow-hidden"
                            className="h-full w-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-tech-slate truncate">{b.title}</div>
                            <div className="text-[11px] text-zinc-400 truncate mt-0.5">{b.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-tech-slate">
                          {b.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-zinc-600">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3 text-zinc-400" />
                          {b.viewCount ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-zinc-500">
                        {b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-tech-slate cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(b._id, b.title)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Blog Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-2xl bg-clean-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <h3 className="font-heading text-lg font-bold text-tech-slate">
                  {editingBlog ? "Edit Blog Article" : "Create Blog Article"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Warning Signs Your iPhone Battery Needs Immediate Replacement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Slug (optional auto-generated)</label>
                    <input
                      type="text"
                      placeholder="e.g. iphone-battery-warning-signs"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Repair Guides, Battery Care, Tech Tips"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Short Excerpt *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Brief 1-2 sentence preview shown in blog highlights and meta description..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Full Article Content (Markdown / Text) *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write your article content here in Markdown format..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <ImageUploadField
                  label="Cover Image (Optional)"
                  value={coverImage}
                  onChange={setCoverImage}
                  placeholder="https://.../cover.jpg or click Upload"
                  helperText="Upload article banner to ImgBB or paste a direct image URL"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Publishing Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs font-bold text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-700">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="iPhone, Battery, Doorstep Repair, Pune"
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-flash-orange px-5 py-2.5 text-xs font-bold text-clean-white hover:bg-orange-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{editingBlog ? "Update Post" : "Publish Article"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
