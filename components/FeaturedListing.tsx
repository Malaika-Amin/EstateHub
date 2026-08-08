"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function refCode(id: string) {
  return `EH-${id.slice(-4).toUpperCase()}`;
}

export default function FeaturedListing({ property }: { property: any }) {
  if (!property) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mb-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs uppercase tracking-widest text-brass-dark mb-6"
      >
        Featured This Week
      </motion.p>

      <Link href={`/properties/${property._id}`} className="group grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-3 h-[420px] rounded-2xl overflow-hidden bg-ink/5"
        >
          {property.images?.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate">
              No image
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <span
            className={`inline-block text-xs font-mono uppercase tracking-wide px-3 py-1 rounded-full mb-4 ${
              property.listingType === "sale"
                ? "bg-brass/15 text-brass-dark"
                : "bg-deep-green/15 text-deep-green"
            }`}
          >
            {property.listingType === "sale" ? "For Sale" : "For Rent"} · {refCode(property._id)}
          </span>

          <h2 className="font-display text-4xl text-ink leading-tight mb-3 group-hover:text-brass-dark transition-colors">
            {property.title}
          </h2>

          <p className="text-slate mb-5">
            {property.location?.address}, {property.location?.city}
          </p>

          <p className="text-slate leading-relaxed mb-6 line-clamp-3">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-slate mb-6 pb-6 border-b border-ink/10">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.areaSqft} sqft</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl text-ink">
              PKR {property.price?.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-ink group-hover:text-brass-dark transition-colors inline-flex items-center gap-1">
              View Property
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}