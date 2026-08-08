"use client";

import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

export default function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/properties/${property._id}`} className="group block">
      <div className="relative h-64 rounded-xl overflow-hidden bg-fog mb-3">
        {property.images?.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate text-sm">
            No image
          </div>
        )}

        <div className="absolute top-3 right-3">
          <FavoriteButton propertyId={property._id} />
        </div>

        {property.images?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-ink/80 text-paper text-xs font-medium px-2 py-1 rounded-full">
            +{property.images.length - 1}
          </span>
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