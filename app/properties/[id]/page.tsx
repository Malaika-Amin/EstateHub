import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import FavoriteButton from "@/components/FavoriteButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import BookingRequest from "@/components/BookingRequest";
import PropertyMap from "@/components/PropertyMap";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

function refCode(id: string) {
  return `EH-${id.slice(-4).toUpperCase()}`;
}

async function getSimilarProperties(currentId: string, city: string, propertyType: string) {
  const similar = await Property.find({
    _id: { $ne: currentId },
    status: "available",
    $or: [{ "location.city": city }, { propertyType }],
  })
    .limit(3)
    .lean();

  return JSON.parse(JSON.stringify(similar));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const property = await Property.findById(id)
    .populate("agent", "name email phone agentProfile avatar")
    .lean();

  if (!property) notFound();

  const p: any = JSON.parse(JSON.stringify(property));
  const similar = await getSimilarProperties(id, p.location?.city, p.propertyType);

  return (
    <main>
      {/* Full-width gallery */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="relative">
          <PropertyGallery images={p.images} title={p.title} />
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton propertyId={p._id} />
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: scrolling content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {p.listingType === "sale" ? "For Sale" : "For Rent"} · {p.propertyType}
            </span>
            <span className="text-xs text-slate">{refCode(p._id)}</span>
          </div>

          <h1 className="text-4xl font-bold text-ink mb-1">{p.title}</h1>
          <p className="text-slate mb-6">
            {p.location?.address}, {p.location?.city}
          </p>

          <div className="flex items-center gap-6 pb-6 mb-8 border-b border-ink/10">
            <div>
              <p className="text-xl font-bold text-ink">{p.bedrooms}</p>
              <p className="text-xs uppercase text-slate">Bedrooms</p>
            </div>
            <div className="w-px h-8 bg-ink/10" />
            <div>
              <p className="text-xl font-bold text-ink">{p.bathrooms}</p>
              <p className="text-xs uppercase text-slate">Bathrooms</p>
            </div>
            <div className="w-px h-8 bg-ink/10" />
            <div>
              <p className="text-xl font-bold text-ink">{p.areaSqft}</p>
              <p className="text-xs uppercase text-slate">Sqft</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-ink mb-2">Description</h2>
          <p className="text-slate leading-relaxed mb-10">{p.description}</p>

          <PropertyMap address={p.location?.address} city={p.location?.city} />

          {p.amenities?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-ink mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {p.amenities.map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink bg-fog rounded-md px-3 py-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-fog rounded-2xl p-6">
            <p className="text-3xl font-bold text-ink mb-1">PKR {p.price?.toLocaleString()}</p>
            <p className="text-sm text-slate mb-6">
              {p.listingType === "rent" ? "per month" : "asking price"}
            </p>

            <div className="pt-6 border-t border-ink/10">
              <p className="text-xs uppercase tracking-wide text-slate mb-2">Listed by</p>
              <Link href={`/agents/${p.agent?._id}`} className="text-lg font-bold text-ink hover:text-accent transition-colors">
                {p.agent?.name}
              </Link>
              <p className="text-sm text-slate mb-5">{p.agent?.email}</p>

              <div className="space-y-3">
                <WhatsAppButton
                  phone={p.agent?.phone}
                  propertyTitle={p.title}
                  refCode={refCode(p._id)}
                  email={p.agent?.email}
                />
                <BookingRequest propertyId={p._id} agentId={p.agent?._id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-ink mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
            {similar.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}