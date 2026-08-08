import connectDB from "@/lib/db";
import Property from "@/models/Property";
import Link from "next/link";

async function getCityCounts() {
  await connectDB();

  const results = await Property.aggregate([
    { $match: { status: "available" } },
    { $group: { _id: "$location.city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  return results.map((r) => ({ city: r._id, count: r.count }));
}

export default async function BrowseByCity() {
  const cities = await getCityCounts();

  if (cities.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <p className="text-lg font-bold uppercase tracking-wide text-accent mb-4">
        Browse by City
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-14 max-w-xl leading-tight">
        Find properties in the cities you know.
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cities.map((c) => (
          <Link
            key={c.city}
            href={`/?city=${encodeURIComponent(c.city)}#listings`}
            className="group relative h-40 rounded-xl overflow-hidden bg-ink flex flex-col justify-end p-5"
          >
            <div className="absolute inset-0 bg-ink group-hover:bg-accent transition-colors" />
            <div className="relative">
              <h3 className="text-xl font-bold text-paper mb-1">{c.city}</h3>
              <p className="text-sm text-paper/60 group-hover:text-paper/80 transition-colors">
                {c.count} {c.count === 1 ? "listing" : "listings"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}