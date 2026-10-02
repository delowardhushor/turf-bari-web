"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { assetUrl } from "@/utils/assets";

/** The ground's photos: one large image with arrows and, when there are several, a thumbnail strip. */
export default function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const current = Math.min(index, images.length - 1);
  const step = (by: number) => setIndex((current + by + images.length) % images.length);
  const alt = (i: number) => t("ground.photoAlt", { name, number: i + 1 });

  return (
    <section aria-label={t("ground.photos")}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetUrl(images[current])} alt={alt(current)} className="h-full w-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("ground.photoPrev")}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("ground.photoNext")}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("ground.photoShow", { number: i + 1 })}
                aria-current={i === current}
                className={`block h-16 w-24 overflow-hidden rounded-lg border-2 transition-all ${
                  i === current ? "border-emerald-500" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={assetUrl(src)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
