/**
 * Helper utility for uploading images to ImgBB via the QuickFix admin-protected API
 */

export interface UploadResult {
  url: string;
  displayUrl: string;
  thumbUrl: string;
  deleteUrl?: string;
  title?: string;
}

/**
 * Uploads a local image file to ImgBB and returns the hosted image URL.
 *
 * @param file The browser File object to upload
 * @returns The direct permanent URL of the uploaded image
 * @throws Error if upload fails or ImgBB key is missing
 */
export async function uploadToImgBB(file: File): Promise<string> {
  const result = await uploadImageFile(file);
  return result.url;
}

/**
 * Full details upload function returning URLs and metadata.
 */
export async function uploadImageFile(file: File): Promise<UploadResult> {
  // 1. Basic client-side validation
  if (!file) {
    throw new Error("No file selected for upload.");
  }

  const maxSizeBytes = 32 * 1024 * 1024; // 32MB max
  if (file.size > maxSizeBytes) {
    throw new Error(
      `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed 32MB.`
    );
  }

  // 2. Prepare multipart form data
  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", file.name.replace(/\.[^/.]+$/, ""));

  // 3. Post to protected admin endpoint
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      "X-QuickFix-CSRF": "1",
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(
      json?.error?.message || "Failed to upload image. Please try again."
    );
  }

  return json.data as UploadResult;
}
