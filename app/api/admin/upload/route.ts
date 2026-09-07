import { NextRequest } from "next/server";
import { withAdminAuth } from "@/lib/api/auth";
import { apiSuccess, apiError } from "@/lib/api/response";

export const POST = withAdminAuth(async (request: NextRequest) => {
  const apiKey =
    process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_imgbb_api_key_here") {
    return apiError(
      "ImgBB API key is not configured. Please add IMGBB_API_KEY to your environment variables (.env).",
      500,
      "CONFIG_MISSING"
    );
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return apiError(
        "No image file or image payload was provided in the upload request.",
        400,
        "IMAGE_REQUIRED"
      );
    }

    // Forward image to ImgBB API v1
    const imgbbPayload = new FormData();
    imgbbPayload.append("image", imageFile);

    const name = formData.get("name");
    if (typeof name === "string" && name.trim()) {
      imgbbPayload.append("name", name.trim());
    }

    const imgbbRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey.trim())}`,
      {
        method: "POST",
        body: imgbbPayload,
      }
    );

    const imgbbJson = await imgbbRes.json();

    if (!imgbbRes.ok || !imgbbJson.success) {
      const errorMsg =
        imgbbJson?.error?.message ||
        imgbbJson?.status_txt ||
        "Failed to upload image to ImgBB.";
      return apiError(errorMsg, 502, "IMGBB_UPLOAD_FAILED");
    }

    const data = imgbbJson.data;

    return apiSuccess({
      url: data.url,
      displayUrl: data.display_url,
      thumbUrl: data.thumb?.url || data.display_url,
      deleteUrl: data.delete_url,
      title: data.title || data.image?.name,
      width: data.width,
      height: data.height,
      size: data.size,
    });
  } catch (err) {
    console.error("[ImgBB Upload API Error]", err);
    return apiError(
      err instanceof Error ? err.message : "Error processing image upload",
      500,
      "INTERNAL_ERROR"
    );
  }
});
