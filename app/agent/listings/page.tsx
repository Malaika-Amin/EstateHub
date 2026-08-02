"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        const mine = (data.properties || []).filter(
          (p: any) => p.agent?._id === (session?.user as any).id
        );
        setListings(mine);
      })
      .catch((err) => {
        console.error("Failed to load listings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status, session]);

const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setListings((prev) => prev.filter((l) => l._id !== id));
      } else {
        alert(`Failed to delete listing: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || loading) return <p className="p-8">Loading...</p>;

  if (!session || (session.user as any).role !== "agent") {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Only agents can access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass-dark mb-2">
            Agent Dashboard
          </p>
          <h1 className="font-display text-3xl text-ink">My Listings</h1>
        </div>
        <Link
          href="/agent/listings/new"
          className="bg-ink text-stone px-5 py-2.5 rounded-full font-medium hover:bg-brass-dark transition-colors"
        >
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-slate">You haven't posted any listings yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center gap-4 border border-ink/10 rounded-xl p-4"
            >
              <div className="w-20 h-20 bg-ink/5 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-slate">
                {listing.images?.length > 0 ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "No image"
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg text-ink truncate">{listing.title}</h2>
                <p className="text-sm text-slate truncate">
                  {listing.location?.city} · PKR {listing.price?.toLocaleString()}
                </p>
                <span className="text-xs font-mono uppercase text-slate">{listing.status}</span>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/agent/listings/${listing._id}/edit`}
                  className="text-sm font-medium text-ink border border-ink/15 px-4 py-2 rounded-full hover:bg-ink/5 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(listing._id)}
                  disabled={deletingId === listing._id}
                  className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === listing._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}