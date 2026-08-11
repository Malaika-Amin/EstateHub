import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";
import StatsBar from "@/components/StatsBar";
import WhyEstateHub from "@/components/WhyEstateHub";
import BrowseByCity from "@/components/BrowseByCity";
import Link from "next/link";

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
  const allProperties = await getProperties(params);
  const hasFilters = Object.keys(params).length > 0;
  const properties = hasFilters ? allProperties : allProperties.slice(0, 6);
  const showExploreMore = !hasFilters && allProperties.length > 6;

  return (
   <main>
      <Hero />
      <SearchFilters />
      <StatsBar />

      <div id="listings" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-16">
        <h2 className="text-3xl font-bold text-ink mb-10">
          {hasFilters ? `${properties.length} properties found` : "Explore properties"}
        </h2>

     {properties.length === 0 ? (
          <p className="text-slate">
            {hasFilters ? "No properties match your filters." : "No properties listed yet."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {properties.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {showExploreMore && (
              <div className="flex justify-center mt-12">
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 border border-ink/15 text-ink px-6 py-3 rounded-full font-semibold hover:bg-ink hover:text-paper transition-colors"
                >
                  Explore All Properties
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <BrowseByCity /> 
      <WhyEstateHub />
    </main>
  );
}