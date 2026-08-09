"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FavoriteButton from "@/components/FavoriteButton";

export default function PropertyCard({ property }: { property: any }) {
  const [activeImage, setActiveImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const images = property.images || [];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovering && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      setActiveImage(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovering, images.length]);

  return (
    <Link href={`/properties/${property._id}`} className="group block">
      <div
        className="relative h-64 rounded-xl overflow-hidden bg-fog mb-3"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {images.length > 0 ? (
          <AnimatePresence>
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={property.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate text-sm">
            No image
          </div>
        )}

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property._id} />
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_: string, i: number) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeImage ? "w-4 bg-paper" : "w-1 bg-paper/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      <h2 className="text-lg font-bold text-ink truncate mb-1">{property.title}</h2>
      <p className="text-slate text-sm truncate mb-2">
        {property.location?.address}, {property.location?.city}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-ink">
          PKR {property.price?.toLocaleString()}
        </span>
        <span className="text-xs text-slate">
          {property.bedrooms} bed · {property.bathrooms} bath
        </span>
      </div>
    </Link>
  );
}