import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";

async function getProperties(searchParams: { [key: string]: string | undefined }) {
  await connectDB();

  const query: any = { status: "available" };
  if (searchParams.city) query["location.city"] = { $regex: searchParams.city, $options: "i" };
  if (searchParams.listingType) query.listingType = searchParams.listingType;
  if (searchParams.propertyType) query.propertyType = searchParams.propertyType;
  if (searchParams.bedrooms) query.bedrooms = { $gte: Number(searchParams.bedrooms) };
  if (searchParams.minPrice || searchParams.maxPrice) {
    query.price = {};
    if (searchParams.minPrice) query.price.$gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) query.price.$lte = Number(searchParams.maxPrice);
  }

  const properties = await Property.find(query)
    .populate("agent", "name email agentProfile")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(properties));
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const properties = await getProperties(params);
  const hasFilters = Object.keys(params).length > 0;

  return (
    <main>
      <Hero />
      <SearchFilters />

      <div id="listings" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-16">
        <h2 className="text-3xl font-bold text-ink mb-10">
          {hasFilters ? `${properties.length} properties found` : "Explore properties"}
        </h2>

        {properties.length === 0 ? (
          <p className="text-slate">
            {hasFilters ? "No properties match your filters." : "No properties listed yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}