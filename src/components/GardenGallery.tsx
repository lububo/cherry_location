"use client";

import { useEffect, useState } from "react";

type Image = {
  id: string;
  url: string;
};

export function GardenGallery({
  images,
  title,
}: {
  images: Image[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  if (images.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(i)}
            className="h-20 w-28 overflow-hidden rounded-lg border border-ink-100"
          >
            <img
              src={img.url}
              alt={title}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-ink-900"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-ink-900"
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="max-h-[80vh] max-w-[90vw] overflow-hidden rounded-xl bg-white">
            <img
              src={images[index].url}
              alt={title}
              className="h-full w-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-lg font-semibold text-ink-900"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
