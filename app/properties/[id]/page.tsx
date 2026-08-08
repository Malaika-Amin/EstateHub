import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import FavoriteButton from "@/components/FavoriteButton";
import WhatsAppButton from "@/components/WhatsAppButton";

function refCode(id: string) {
  return `EH-${id.slice(-4).toUpperCase()}`;
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative">
        <PropertyGallery images={p.images} title={p.title} />
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton propertyId={p._id} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          {p.listingType === "sale" ? "For Sale" : "For Rent"} · {p.propertyType}
        </span>
        <span className="text-xs text-slate">{refCode(p._id)}</span>
      </div>

      <h1 className="text-4xl font-bold text-ink mb-1">{p.title}</h1>
      <p className="text-slate mb-6">
        {p.location?.address}, {p.location?.city}
      </p>

      <p className="text-3xl font-bold text-ink mb-8">PKR {p.price?.toLocaleString()}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center bg-fog rounded-xl py-4">
          <p className="text-xl font-bold text-ink">{p.bedrooms}</p>
          <p className="text-xs uppercase text-slate mt-1">Bedrooms</p>
        </div>
        <div className="text-center bg-fog rounded-xl py-4">
          <p className="text-xl font-bold text-ink">{p.bathrooms}</p>
          <p className="text-xs uppercase text-slate mt-1">Bathrooms</p>
        </div>
        <div className="text-center bg-fog rounded-xl py-4">
          <p className="text-xl font-bold text-ink">{p.areaSqft}</p>
          <p className="text-xs uppercase text-slate mt-1">Sqft</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-ink mb-2">Description</h2>
      <p className="text-slate leading-relaxed mb-8">{p.description}</p>

      <div className="bg-fog rounded-2xl p-5">
        <p className="text-xs uppercase tracking-wide text-slate mb-2">Listed by</p>
        <p className="text-lg font-bold text-ink">{p.agent?.name}</p>
        <p className="text-sm text-slate mb-4">{p.agent?.email}</p>

        <WhatsAppButton phone={p.agent?.phone} propertyTitle={p.title} refCode={refCode(p._id)} />
      </div>
    </main>
  );
}