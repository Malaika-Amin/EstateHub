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

 if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-fog rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-fog rounded-xl mb-3" />
              <div className="h-4 bg-fog rounded w-1/3 mb-2" />
              <div className="h-5 bg-fog rounded w-2/3 mb-2" />
              <div className="h-4 bg-fog rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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