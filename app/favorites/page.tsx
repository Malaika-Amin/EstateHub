"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PropertyCard from "@/components/PropertyCard";

export default function FavoritesPage() {
  const { status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) return <p className="p-8">Loading...</p>;

  if (status !== "authenticated") {
    return (
      <div className="p-8 text-center">
        <p className="text-slate">Please sign in to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ink mb-8">My Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-slate">
          You haven't saved any properties yet. Browse listings and tap the heart icon to save one.
        </p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {favorites
            .filter((property: any) => property && property._id)
            .map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
        </div>
      )}
    </div>
  );
}