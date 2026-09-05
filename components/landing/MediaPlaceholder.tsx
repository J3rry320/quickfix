import Image from "next/image";
import { Image as ImageIcon, Play } from "lucide-react";

interface MediaPlaceholderProps {
  src?: string;
  alt: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
  type?: "image" | "video";
  label?: string;
  badge?: string;
  className?: string;
}

export default function MediaPlaceholder({
  src = "",
  alt,
  aspectRatio = "16/9",
  type = "image",
  label,
  badge,
  className = "",
}: MediaPlaceholderProps) {
  const aspectClass = {
    "16/9": "aspect-video",
    "4/3": "aspect-4/3",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
  }[aspectRatio];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-mist-gray border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center group ${aspectClass} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center select-none">
          {type === "video" ? (
            <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-flash-orange text-clean-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 fill-current ml-0.5" />
              <span className="absolute -inset-1 rounded-full bg-flash-orange/30 animate-ping pointer-events-none" />
            </div>
          ) : (
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-200/80 text-zinc-600 shadow-inner">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}

          {badge && (
            <span className="mb-1 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-tech-slate">
              {badge}
            </span>
          )}

          {label && (
            <span className="text-xs font-semibold text-zinc-600 max-w-xs leading-snug">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
