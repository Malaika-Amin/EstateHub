"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FavoriteButton({
  propertyId,
  className = "",
}: {
  propertyId: string;
  className?: string;
}) {
  const { data: session, status } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const favorites = data.favorites || [];
        setIsFavorited(favorites.some((id: string) => id === propertyId));
      })
      .catch(() => {});
  }, [status, propertyId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorited(data.favorited);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
      className={`flex items-center justify-center transition-colors ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorited ? "#B8925A" : "none"}
        stroke={isFavorited ? "#B8925A" : "currentColor"}
        strokeWidth="2"
      >
        <path d="M12 21s-6.716-4.35-9.428-8.06C.24 9.73 1.02 5.9 4.2 4.55c2.1-.9 4.4-.1 5.8 1.75C11.4 4.45 13.7 3.65 15.8 4.55c3.18 1.35 3.96 5.18 1.628 8.39C18.716 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}