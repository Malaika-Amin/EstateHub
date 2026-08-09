"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function BookingRequest({
  propertyId,
  agentId,
}: {
  propertyId: string;
  agentId: string;
}) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (status !== "authenticated") {
    return (
      <a
        href="/login"
        className="inline-flex items-center justify-center gap-2 bg-fog text-ink px-5 py-3 rounded-full font-medium hover:bg-ink hover:text-paper transition-colors w-full"
      >
        Sign in to request a viewing
      </a>
    );
  }

  if ((session.user as any).id === agentId) return null;

  if (submitted) {
    return (
      <div className="bg-fog rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-ink">
          Viewing request sent. The agent will confirm soon.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          agentId,
          requestedDate: date,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request viewing");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-fog text-ink px-5 py-3 rounded-full font-medium hover:bg-ink hover:text-paper transition-colors"
      >
        Request a Viewing
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-fog rounded-xl p-4 space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1">
          Preferred Date
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1">
          Message (optional)
        </label>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Any questions or preferred time..."
          className="w-full bg-paper rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-paper py-2.5 rounded-full font-semibold hover:bg-accent transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}