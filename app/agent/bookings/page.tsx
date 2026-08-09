"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
  completed: "bg-fog text-slate",
};

export default function AgentBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      }
    } finally {
      setUpdatingId(null);
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
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-sm font-bold uppercase tracking-wide text-accent mb-2">Agent Dashboard</p>
      <h1 className="text-4xl font-bold text-ink mb-10">Viewing Requests</h1>

      {bookings.length === 0 ? (
        <p className="text-slate">No viewing requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-fog rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link
                    href={`/properties/${b.property?._id}`}
                    className="font-bold text-ink hover:text-accent transition-colors"
                  >
                    {b.property?.title}
                  </Link>
                  <p className="text-sm text-slate mt-1">
                    Requested by {b.buyer?.name} · {b.buyer?.email}
                  </p>
                  {b.buyer?.phone && (
                    <p className="text-sm text-slate">{b.buyer.phone}</p>
                  )}
                </div>
                <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>
                  {b.status}
                </span>
              </div>

              <p className="text-sm text-ink mb-1">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(b.requestedDate).toLocaleDateString()}
              </p>
              {b.message && (
                <p className="text-sm text-slate mb-3">"{b.message}"</p>
              )}

              {b.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(b._id, "confirmed")}
                    disabled={updatingId === b._id}
                    className="text-sm font-semibold bg-ink text-paper px-4 py-2 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "declined")}
                    disabled={updatingId === b._id}
                    className="text-sm font-semibold bg-paper text-red-600 px-4 py-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              )}

              {b.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(b._id, "completed")}
                  disabled={updatingId === b._id}
                  className="text-sm font-semibold bg-paper text-ink px-4 py-2 rounded-full hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 mt-2"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}