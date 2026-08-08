import connectDB from "@/lib/db";
import User from "@/models/User";
import Property from "@/models/Property";
import PropertyCard from "@/components/PropertyCard";
import { notFound } from "next/navigation";

async function getAgentData(id: string) {
  await connectDB();
  const agent = await User.findOne({ _id: id, role: "agent" })
    .select("name email phone avatar agentProfile createdAt")
    .lean();

  if (!agent) return null;

  const listings = await Property.find({ agent: id, status: "available" })
    .sort({ createdAt: -1 })
    .lean();

  return {
    agent: JSON.parse(JSON.stringify(agent)),
    listings: JSON.parse(JSON.stringify(listings)),
  };
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAgentData(id);

  if (!data) notFound();

  const { agent, listings } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center gap-6 mb-12 pb-10">
        <div className="w-24 h-24 rounded-full bg-fog flex items-center justify-center text-4xl font-bold text-ink shrink-0">
          {agent.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">{agent.name}</h1>
          <p className="text-slate mb-2">
            {agent.agentProfile?.agency || "Independent Agent"}
          </p>
          {agent.agentProfile?.bio && (
            <p className="text-slate max-w-xl">{agent.agentProfile.bio}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-ink mb-8">
        {listings.length} Active {listings.length === 1 ? "Listing" : "Listings"}
      </h2>

      {listings.length === 0 ? (
        <p className="text-slate">No active listings right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {listings.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}