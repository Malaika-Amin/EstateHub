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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goNext, goPrev]);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-ink/5 rounded-2xl flex items-center justify-center text-slate">
        No image available
      </div>
    );
  }

  const openAt = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const thumbs = images.slice(1, 5);
  const extraCount = images.length - 5;

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
        <button onClick={() => openAt(0)} className="col-span-4 row-span-2 sm:col-span-2 relative">
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
        </button>

        {thumbs.map((url, i) => (
          <button key={url} onClick={() => openAt(i + 1)} className="hidden sm:block relative col-span-1 row-span-1">
            <img src={url} alt="" className="w-full h-full object-cover" />
            {i === 3 && extraCount > 0 && (
              <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                <span className="text-paper font-bold text-lg">+{extraCount}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-ink/95">
          {/* backdrop, click to close */}
          <div
            className="absolute inset-0"
            onClick={() => setLightboxOpen(false)}
          />

          {/* image, centered, clicks don't close */}
          <img
            src={images[activeIndex]}
            alt={title}
            className="pointer-events-none absolute inset-0 m-auto max-w-[85%] max-h-[85vh] object-contain"
          />

          {/* controls, always on top */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 text-paper text-3xl w-11 h-11 rounded-full bg-paper/10 hover:bg-paper/20 flex items-center justify-center"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-paper/10 hover:bg-paper/20 text-paper w-11 h-11 rounded-full flex items-center justify-center text-2xl"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-paper/10 hover:bg-paper/20 text-paper w-11 h-11 rounded-full flex items-center justify-center text-2xl"
              >
                ›
              </button>
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-paper/70 text-sm font-mono">
                {activeIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
}