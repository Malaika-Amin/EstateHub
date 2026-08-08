"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AgentProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({ agency: "", bio: "", phone: "" });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/agent/profile")
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          agency: data.user?.agentProfile?.agency || "",
          bio: data.user?.agentProfile?.bio || "",
          phone: data.user?.phone || "",
        });
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [status]);

  if (status === "loading" || fetching) return <p className="p-8">Loading...</p>;

  if (!session || (session.user as any).role !== "agent") {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Only agents can access this page.</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/agent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-fog rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ink mb-2">Your Public Profile</h1>
      <p className="text-slate mb-8">
        This information appears on your public agent page for buyers to see.
      </p>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1">
            Agency Name
          </label>
          <input
            name="agency"
            placeholder="e.g. Prime Estates Islamabad"
            value={formData.agency}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            placeholder="A short introduction buyers will see on your profile..."
            value={formData.bio}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-1">
            WhatsApp Number
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="+92 300 1234567"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-ink text-paper py-2.5 rounded-full font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}