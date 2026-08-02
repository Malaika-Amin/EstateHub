"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/?${params.toString()}#listings`);
  };

  const handleClear = () => {
    setFilters({
      city: "",
      listingType: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    });
    router.push("/#listings");
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-ink/10 rounded-2xl p-5 -mt-16 relative z-10 mx-4 max-w-5xl sm:mx-auto shadow-lg"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
          className="col-span-2 sm:col-span-1 border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <select
          name="listingType"
          value={filters.listingType}
          onChange={handleChange}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="">Sale or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="land">Land</option>
          <option value="commercial">Commercial</option>
        </select>

        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        />

        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
        >
          <option value="">Any Beds</option>
          <option value="1">1+ Bed</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="5">5+ Beds</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          className="bg-ink text-stone px-6 py-2 rounded-full text-sm font-medium hover:bg-brass-dark transition-colors"
        >
          Search
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-slate hover:text-ink transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </form>
  );
}