"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Loader2,
  X,
  ExternalLink,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { uploadToImgBB } from "@/lib/admin/upload";

export interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function ImageUploadField({
  label = "Image URL",
  value,
  onChange,
  placeholder = "https://i.ibb.co/... or paste image URL",
  helperText,
  required = false,
  disabled = false,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setImageLoadError(false);

    try {
      const uploadedUrl = await uploadToImgBB(file);
      onChange(uploadedUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload image. Please check your ImgBB configuration.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      // Reset input value so re-selecting the same file fires onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    onChange("");
    setUploadError(null);
    setUploadSuccess(false);
    setImageLoadError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasValue = Boolean(value && value.trim());

  return (
    <div className="space-y-1.5">
      {/* Label and Upload CTA */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {uploadSuccess && (
          <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="h-3 w-3" /> Uploaded to ImgBB
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Input Group: URL text input + Upload Button */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setImageLoadError(false);
              setUploadError(null);
            }}
            placeholder={placeholder}
            disabled={disabled || isUploading}
            className="w-full rounded-xl border border-zinc-200 bg-clean-white px-3 py-2 text-xs text-tech-slate focus:border-flash-orange focus:outline-hidden disabled:bg-zinc-50 disabled:text-zinc-400 transition-colors"
          />
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-bold text-clean-white hover:bg-zinc-800 disabled:opacity-50 transition-all shrink-0 cursor-pointer shadow-2xs"
          title="Upload image directly to ImgBB"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-flash-orange" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>

      {/* Live Preview Thumbnail */}
      {hasValue && (
        <div className="flex items-center gap-3 p-2 bg-zinc-50 border border-zinc-200 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-clean-white border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
            {!imageLoadError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt="Preview"
                onError={() => setImageLoadError(true)}
                className="h-full w-full object-contain p-0.5"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-zinc-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-2xs font-semibold text-zinc-700 truncate">
              {imageLoadError ? "Could not preview image URL" : "Preview image"}
            </p>
            <p className="text-2xs text-zinc-400 truncate">{value}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-md text-zinc-400 hover:text-tech-slate hover:bg-zinc-200 transition-colors cursor-pointer"
              title="Open image in new tab"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      {helperText && !uploadError && (
        <p className="text-2xs text-zinc-500">{helperText}</p>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-2xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{uploadError}</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
