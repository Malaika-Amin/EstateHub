import Link from "next/link";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import Hero from "@/components/Hero";
import SearchFilters from "@/components/SearchFilters";
import FavoriteButton from "@/components/FavoriteButton";

async function getProperties(searchParams: { [key: string]: string | undefined }) {
  await connectDB();

  const query: any = { status: "available" };

  if (searchParams.city) {
    query["location.city"] = { $regex: searchParams.city, $options: "i" };
  }
  if (searchParams.listingType) {
    query.listingType = searchParams.listingType;
  }
  if (searchParams.propertyType) {
    query.propertyType = searchParams.propertyType;
  }
  if (searchParams.bedrooms) {
    query.bedrooms = { $gte: Number(searchParams.bedrooms) };
  }
  if (searchParams.minPrice || searchParams.maxPrice) {
    query.price = {};
    if (searchParams.minPrice) query.price.$gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) query.price.$lte = Number(searchParams.maxPrice);
  }

  const properties = await Property.find(query)
    .populate("agent", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(properties));
}

function refCode(id: string) {
  return `EH-${id.slice(-4).toUpperCase()}`;
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

      <div id="listings" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-16">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-brass-dark mb-2">
            Listings
          </p>
          <h2 className="font-display text-3xl text-ink">
            {hasFilters ? `${properties.length} properties found` : "Current properties"}
          </h2>
        </div>

        {properties.length === 0 ? (
          <p className="text-slate">
            {hasFilters
              ? "No properties match your filters. Try adjusting your search."
              : "No properties listed yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <Link
                key={property._id}
                href={`/properties/${property._id}`}
                className="group border border-ink/10 rounded-xl overflow-hidden bg-white/40 hover:border-brass transition-colors"
              >
                <div className="relative h-48 bg-ink/5 flex items-center justify-center text-slate text-sm">
                  {property.images?.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                  {property.images?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-ink/80 text-stone text-xs font-mono px-2 py-1 rounded-full">
                      +{property.images.length - 1}
                    </span>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton propertyId={property._id} />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-mono uppercase tracking-wide ${
                        property.listingType === "sale" ? "text-brass-dark" : "text-deep-green"
                      }`}
                    >
                      {property.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="text-xs font-mono text-slate">{refCode(property._id)}</span>
                  </div>

                  <h2 className="font-display text-lg text-ink truncate">{property.title}</h2>
                  <p className="text-slate text-sm truncate">
                    {property.location?.address}, {property.location?.city}
                  </p>

                  <div className="mt-3 pt-3 border-t border-brass/30">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-ink">
                        PKR {property.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate">
                        {property.bedrooms} bed · {property.bathrooms} bath
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}