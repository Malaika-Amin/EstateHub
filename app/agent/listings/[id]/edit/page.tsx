"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const AMENITY_OPTIONS = ["Parking", "Garden", "Security", "Generator", "Elevator", "Gym", "Pool", "Balcony", "Furnished"];

const inputClass =
  "w-full bg-paper rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
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
    status: "available",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setError("No property ID found in URL");
      setFetching(false);
      return;
    }

    fetch(`/api/properties/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.property;
        setFormData({
          title: p.title || "",
          description: p.description || "",
          price: String(p.price || ""),
          listingType: p.listingType || "sale",
          propertyType: p.propertyType || "house",
          city: p.location?.city || "",
          address: p.location?.address || "",
          bedrooms: String(p.bedrooms || ""),
          bathrooms: String(p.bathrooms || ""),
          areaSqft: String(p.areaSqft || ""),
          status: p.status || "available",
        });
        setImages(p.images || []);
        setAmenities(p.amenities || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [params.id]);

  if (status === "loading" || fetching) return <p className="p-8">Loading...</p>;

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

  const toggleAmenity = (item: string, checked: boolean) => {
    if (checked) setAmenities((prev) => [...prev, item]);
    else setAmenities((prev) => prev.filter((a) => a !== item));
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
      const res = await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          listingType: formData.listingType,
          propertyType: formData.propertyType,
          location: { city: formData.city, address: formData.address, coordinates: [0, 0] },
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          areaSqft: Number(formData.areaSqft),
          images,
          amenities,
          status: formData.status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update listing");

      router.push("/agent/listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sectionAnim = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm font-bold uppercase tracking-wide text-accent mb-2">Agent Dashboard</p>
        <h1 className="text-4xl font-bold text-ink mb-2">Edit Listing</h1>
        <p className="text-slate mb-10">Update your listing details below.</p>
      </motion.div>

      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div {...sectionAnim(0.05)} className="bg-fog rounded-2xl p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate">Basic Details</p>

          <input
            name="title"
            placeholder="Title"
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

          <div className="grid grid-cols-2 gap-4">
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass}>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </motion.div>

        <motion.div {...sectionAnim(0.1)} className="bg-fog rounded-2xl p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate">Location & Size</p>

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
        </motion.div>

        <motion.div {...sectionAnim(0.15)} className="bg-fog rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate mb-4">Amenities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITY_OPTIONS.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-sm bg-paper rounded-md px-3 py-2.5 cursor-pointer hover:bg-ink/5 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={(e) => toggleAmenity(item, e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                {item}
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div {...sectionAnim(0.2)} className="bg-fog rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate mb-4">Property Images</p>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/15 rounded-xl py-10 cursor-pointer hover:border-accent hover:bg-paper transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate">
              <path d="M12 16V4m0 0L7 9m5-5l5 5" />
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <span className="text-sm text-slate">
              {uploading ? "Uploading..." : "Click to upload photos"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {images.map((url) => (
                <div key={url} className="relative group aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1.5 right-1.5 bg-ink text-paper text-xs w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.button
          {...sectionAnim(0.25)}
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-ink text-paper py-3.5 rounded-full font-semibold hover:bg-accent transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </form>
    </div>
  );
}