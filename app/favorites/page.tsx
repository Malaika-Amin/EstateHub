"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

function refCode(id: string) {
  return `EH-${id.slice(-4).toUpperCase()}`;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/favorites")
      .then((res) => res.json())
      .then(async (data) => {
        const ids: string[] = data.favorites || [];
        if (ids.length === 0) {
          setProperties([]);
          return;
        }

        const allRes = await fetch("/api/properties");
        const allData = await allRes.json();
        const matched = (allData.properties || []).filter((p: any) =>
          ids.includes(p._id)
        );
        setProperties(matched);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) return <p className="p-8">Loading...</p>;

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate">
          Please{" "}
          <Link href="/login" className="text-brass-dark font-medium">
            sign in
          </Link>{" "}
          to view your saved properties.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-dark mb-2">
        Your Shortlist
      </p>
      <h1 className="font-display text-3xl text-ink mb-8">Saved Properties</h1>

      {properties.length === 0 ? (
        <p className="text-slate">
          You haven't saved any properties yet. Browse listings and tap the heart icon to save
          your favorites.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property._id}
              href={`/properties/${property._id}`}
              className="group border border-ink/10 rounded-xl overflow-hidden bg-white/40 hover:border-brass transition-colors"
            >
              <div className="relative h-48 bg-ink/5 flex items-center justify-center text-slate text-sm">
                {property.images?.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>No image</span>
                )}
                <FavoriteButton
                  propertyId={property._id}
                  className="absolute top-2 right-2 bg-stone/90 hover:bg-stone w-8 h-8 rounded-full"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-mono uppercase tracking-wide ${
                      property.listingType === "sale" ? "text-brass-dark" : "text-deep-green"
                    }`}
                  >
                    {property.listingType === "sale" ? "For Sale" : "For Rent"}
                  </span>
                  <span className="text-xs font-mono text-slate">{refCode(property._id)}</span>
                </div>

                <h2 className="font-display text-lg text-ink truncate">{property.title}</h2>
                <p className="text-slate text-sm truncate">
                  {property.location?.city}
                </p>

                <div className="mt-3 pt-3 border-t border-brass/30">
                  <span className="font-mono font-medium text-ink">
                    PKR {property.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}