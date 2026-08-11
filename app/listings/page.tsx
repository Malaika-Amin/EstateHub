import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
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

export default async function AllListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const properties = await getProperties(params);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ink mb-8">All Properties</h1>

      <div className="mb-10">
        <SearchFilters />
      </div>

      {properties.length === 0 ? (
        <p className="text-slate">No properties match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {properties.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </main>
  );
}