"use client";

import { useState, useEffect, useCallback } from "react";

export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images, goNext, goPrev]);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-ink/5 rounded-2xl flex items-center justify-center text-slate">
        No image available
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-96 bg-ink/5 rounded-2xl overflow-hidden mb-3 group">
        <img
          src={images[activeIndex]}
          alt={title}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-ink/60 hover:bg-ink/80 text-stone w-9 h-9 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink/60 hover:bg-ink/80 text-stone w-9 h-9 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
            >
              ›
            </button>

            <span className="absolute bottom-3 right-3 bg-ink/70 text-stone text-xs font-mono px-2 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActiveIndex(i)}
              className={`h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                activeIndex === i ? "border-brass" : "border-transparent"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}