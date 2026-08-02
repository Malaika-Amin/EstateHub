import WhatsAppButton from "@/components/WhatsAppButton";
import connectDB from "@/lib/db";
import Property from "@/models/Property";
import "@/models/User";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import FavoriteButton from "@/components/FavoriteButton";

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
        <FavoriteButton
          propertyId={p._id}
          className="absolute top-4 right-4 bg-stone/90 hover:bg-stone w-10 h-10 rounded-full z-10"
        />
      </div>

      <div className="flex items-center justify-between mb-2 mt-6">
        <span
          className={`text-xs font-mono uppercase tracking-wide ${
            p.listingType === "sale" ? "text-brass-dark" : "text-deep-green"
          }`}
        >
          {p.listingType === "sale" ? "For Sale" : "For Rent"} · {p.propertyType}
        </span>
        <span className="text-xs font-mono text-slate">{refCode(p._id)}</span>
      </div>

      <h1 className="font-display text-3xl text-ink mb-1">{p.title}</h1>
      <p className="text-slate mb-6">
        {p.location?.address}, {p.location?.city}
      </p>

      <div className="pb-6 mb-6 border-b border-brass/30">
        <p className="font-mono text-2xl text-ink">PKR {p.price?.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center border border-ink/10 rounded-xl py-4">
          <p className="font-display text-xl text-ink">{p.bedrooms}</p>
          <p className="text-xs font-mono uppercase text-slate mt-1">Bedrooms</p>
        </div>
        <div className="text-center border border-ink/10 rounded-xl py-4">
          <p className="font-display text-xl text-ink">{p.bathrooms}</p>
          <p className="text-xs font-mono uppercase text-slate mt-1">Bathrooms</p>
        </div>
        <div className="text-center border border-ink/10 rounded-xl py-4">
          <p className="font-display text-xl text-ink">{p.areaSqft}</p>
          <p className="text-xs font-mono uppercase text-slate mt-1">Sqft</p>
        </div>
      </div>

      <h2 className="font-display text-lg text-ink mb-2">Description</h2>
      <p className="text-slate leading-relaxed mb-8">{p.description}</p>

     <div className="border border-ink/10 rounded-2xl p-5">
        <p className="text-xs font-mono uppercase tracking-wide text-slate mb-2">Listed by</p>
        <p className="font-display text-lg text-ink">{p.agent?.name}</p>
        <p className="text-sm text-slate mb-4">{p.agent?.email}</p>

        <WhatsAppButton
          phone={p.agent?.phone}
          propertyTitle={p.title}
          refCode={refCode(p._id)}
        />
      </div>
    </main>
  );
}