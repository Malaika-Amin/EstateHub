"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    listingType: "sale",
    propertyType: "house",
    city: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    areaSqft: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return <p className="p-8">Loading...</p>;

  if (!session || (session.user as any).role !== "agent") {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Only agents can access this page.</p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploadedUrls.push(data.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          listingType: formData.listingType,
          propertyType: formData.propertyType,
          location: {
            city: formData.city,
            address: formData.address,
            coordinates: [0, 0],
          },
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          areaSqft: Number(formData.areaSqft),
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create listing");

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-fog rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ink mb-6">Create New Listing</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title (e.g. Modern 3-bed apartment in DHA)"
          required
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={inputClass}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            required
            value={formData.price}
            onChange={handleChange}
            className={inputClass}
          />
          <select name="listingType" value={formData.listingType} onChange={handleChange} className={inputClass}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass}>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input
            name="bedrooms"
            type="number"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="bathrooms"
            type="number"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="areaSqft"
            type="number"
            placeholder="Area (sqft)"
            value={formData.areaSqft}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate mb-2">
            Property Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full text-sm"
          />
          {uploading && <p className="text-sm text-slate mt-2">Uploading...</p>}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="" className="w-full h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-ink/80 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-ink text-paper py-2.5 rounded-full font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}