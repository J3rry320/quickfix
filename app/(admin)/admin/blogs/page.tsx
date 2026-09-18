"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Edit2, Trash2, BookOpen, Eye } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import AdminImage from "@/components/admin/AdminImage";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api";
import AdminTable, { AdminTableColumn } from "@/components/admin/ui/AdminTable";
import AdminFilterBar, { FilterTab } from "@/components/admin/ui/AdminFilterBar";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import AdminModal from "@/components/admin/ui/AdminModal";
import AdminConfirmModal from "@/components/admin/ui/AdminConfirmModal";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  language: "en" | "hi" | "mr";
  readingTimeMinutes: number;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  isPublished: boolean;
  publishedAt?: string;
  viewCount?: number;
  createdAt: string;
}

const STATUS_TABS: FilterTab[] = [
  { label: "All Posts", value: "" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
];

const COLUMNS: AdminTableColumn[] = [
  { key: "post", label: "Article Title & Category" },
  { key: "language", label: "Language" },
  { key: "views", label: "Views" },
  { key: "status", label: "Status" },
  { key: "date", label: "Published / Created" },
  { key: "actions", label: "Actions", align: "right" },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Confirmation State
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Repair Guides");
  const [language, setLanguage] = useState<"en" | "hi" | "mr">("en");
  const [readingTime, setReadingTime] = useState<number | string>(4);
  const [authorName, setAuthorName] = useState("QuickFix Tech Team");
  const [authorRole, setAuthorRole] = useState("Smartphone Specialist");
  const [tagsText, setTagsText] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    async function fetchBlogs() {
      setLoading(true);
      try {
        const data = await adminFetch<{
          blogs: BlogItem[];
          pagination: { page: number; limit: number; total: number; totalPages: number };
        }>("/api/admin/blogs", {
          params: {
            status: statusFilter,
            search,
            page,
            limit: 20,
          },
        });

        if (isSubscribed) {
          setBlogs(data.blogs || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalRecords(data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Failed to load blog posts", err);
        if (isSubscribed) {
          setBlogs([]);
        }
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
  }, [statusFilter, search, page, refreshIndex]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setCategory("Repair Guides");
    setLanguage("en");
    setReadingTime(4);
    setAuthorName("QuickFix Tech Team");
    setAuthorRole("Smartphone Specialist");
    setTagsText("");
    setIsPublished(false);
    setPreviewMode(false);
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
    setLanguage(b.language || "en");
    setReadingTime(b.readingTimeMinutes || 4);
    setAuthorName(b.author?.name || "QuickFix Tech Team");
    setAuthorRole(b.author?.role || "Smartphone Specialist");
    setTagsText((b.tags || []).join(", "));
    setIsPublished(b.isPublished);
    setPreviewMode(false);
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
        language,
        readingTimeMinutes: Number(readingTime) || 4,
        author: {
          name: authorName.trim() || "QuickFix Tech Team",
          role: authorRole.trim() || "Smartphone Specialist",
        },
        tags,
        isPublished,
      };

      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : "/api/admin/blogs";
      const method = editingBlog ? "PATCH" : "POST";

      await adminFetch(url, {
        method,
        body: payload,
      });

      setIsModalOpen(false);
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error saving blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      await adminFetch(`/api/admin/blogs/${blogToDelete._id}?permanent=true`, {
        method: "DELETE",
      });
      setRefreshIndex((k) => k + 1);
    } catch (err) {
      console.error("Failed to delete blog post", err);
    }
  };

  return (
    <AdminShell
      title="Blog & Articles"
      subtitle="Publish smartphone repair guides, maintenance tips, and local news"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setRefreshIndex((k) => k + 1)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-clean-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-text-secondary hover:bg-mist-gray cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-flash-orange px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-clean-white hover:bg-flash-orange-hover shadow-md shadow-flash-orange/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Write Article</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Controls & Search */}
        <AdminFilterBar
          tabs={STATUS_TABS}
          activeTab={statusFilter}
          onTabChange={(tab) => {
            setStatusFilter(tab);
            setPage(1);
          }}
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder="Search articles..."
        />

        {/* Blogs Table */}
        <AdminTable
          columns={COLUMNS}
          tableClassName="min-w-[640px]"
          loading={loading}
          empty={blogs.length === 0}
          emptyTitle="No blog posts found"
          emptyDescription="There are no blog posts matching your active filters."
        >
          {blogs.map((b) => (
            <tr key={b._id} className="hover:bg-mist-gray/80 transition-colors">
              {/* Post Title & Category */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <AdminImage
                    src={b.coverImage}
                    alt={b.title}
                    fallbackIcon={BookOpen}
                    containerClassName="h-10 w-14 rounded-lg bg-mist-gray border border-border-default overflow-hidden shrink-0 shadow-2xs"
                    className="h-full w-full object-cover"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-tech-slate block truncate max-w-sm">
                      {b.title}
                    </span>
                    <span className="text-[11px] text-text-muted">{b.category}</span>
                  </div>
                </div>
              </td>

              {/* Language */}
              <td className="px-5 py-4 uppercase font-bold text-xs text-text-secondary">
                {b.language || "en"}
              </td>

              {/* Views */}
              <td className="px-5 py-4 text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3 text-text-muted" />
                  <span>{b.viewCount ?? 0}</span>
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4 whitespace-nowrap">
                <AdminStatusBadge status={b.isPublished ? "published" : "draft"} />
              </td>

              {/* Date */}
              <td className="px-5 py-4 whitespace-nowrap text-text-muted">
                {b.publishedAt
                  ? new Date(b.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date(b.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => openEditModal(b)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-mist-gray hover:text-tech-slate cursor-pointer"
                  title="Edit Article"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setBlogToDelete(b)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-error-light hover:text-error cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>

        {/* Pagination */}
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={totalRecords}
          limit={20}
          onPageChange={setPage}
        />

        {/* Create / Edit Article Modal */}
        {isModalOpen && (
          <AdminModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingBlog ? "Edit Article" : "Write New Article"}
            subtitle="Publish tips, repair guides, and Pune doorstep service announcements"
            maxWidth="2xl"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={formError}
            submitText={editingBlog ? "Update Article" : "Publish Article"}
          >
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Signs Your iPhone Battery Needs Immediate Replacement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  >
                    <option value="Repair Guides">Repair Guides</option>
                    <option value="Battery & Charging">Battery & Charging</option>
                    <option value="Display & Screens">Display & Screens</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="Company News">Company News</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Language</label>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as "en" | "hi" | "mr")
                    }
                    className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  >
                    <option value="en">English (en)</option>
                    <option value="hi">Hindi (hi)</option>
                    <option value="mr">Marathi (mr)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Reading Time (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Slug (optional auto-generated)</label>
                  <input
                    type="text"
                    placeholder="e.g. iphone-battery-replacement-guide"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs font-mono text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-secondary">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. QuickFix Tech Team"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Cover Image"
                value={coverImage}
                onChange={setCoverImage}
                placeholder="https://.../article-cover.jpg or click Upload"
                helperText="Upload a high quality landscape 16:9 banner image"
              />

              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of the article for blog cards and search engine previews..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white p-3 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-text-secondary">Article Content * (Markdown)</label>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="inline-flex items-center gap-1 text-2xs font-bold text-flash-orange hover:text-flash-orange-hover cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>{previewMode ? "Switch to Editor" : "Live Markdown Preview"}</span>
                  </button>
                </div>

                {previewMode ? (
                  <div className="max-h-72 overflow-y-auto rounded-xl border border-border-default bg-mist-gray/50 p-4 text-xs text-tech-slate">
                    {content ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <p className="italic text-text-muted">No markdown content entered yet. Switch back to editor to write your article.</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    required
                    placeholder="Full article content in markdown format (# Heading, ## Section, tables, lists, > [!NOTE] callouts)..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-border-default bg-clean-white p-3 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden font-mono leading-relaxed"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="iphone, battery, pune, doorstep repair"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  className="w-full rounded-xl border border-border-default bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 font-bold text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-border-strong text-flash-orange focus:ring-flash-orange"
                  />
                  <span>Publish Article immediately</span>
                </label>
              </div>
            </div>
          </AdminModal>
        )}

        {/* Delete Confirmation Modal */}
        {blogToDelete && (
          <AdminConfirmModal
            isOpen={Boolean(blogToDelete)}
            onClose={() => setBlogToDelete(null)}
            onConfirm={handleDelete}
            title="Delete Article"
            message={`Are you sure you want to permanently delete "${blogToDelete.title}"? This action cannot be undone.`}
            confirmText="Delete Article"
            isDestructive={true}
          />
        )}
      </div>
    </AdminShell>
  );
}
