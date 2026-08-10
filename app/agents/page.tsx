import connectDB from "@/lib/db";
import User from "@/models/User";
import Property from "@/models/Property";
import Link from "next/link";

async function getAgents() {
  await connectDB();
  const agents = await User.find({ role: "agent" }).select("name email avatar agentProfile").lean();

  const agentsWithCounts = await Promise.all(
    agents.map(async (agent: any) => {
      const count = await Property.countDocuments({ agent: agent._id, status: "available" });
      return { ...agent, listingCount: count };
    })
  );

  return JSON.parse(JSON.stringify(agentsWithCounts.filter((a) => a.listingCount > 0)));
}
export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-ink mb-2">Our Agents</h1>
      <p className="text-slate mb-10">Meet the team behind EstateHub's listings.</p>

      {agents.length === 0 ? (
        <p className="text-slate">No agents yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent: any) => (
            <Link
              key={agent._id}
              href={`/agents/${agent._id}`}
              className="group bg-fog rounded-xl p-6 hover:bg-ink hover:text-paper transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-ink/10 group-hover:bg-paper/10 flex items-center justify-center text-2xl font-bold mb-4">
                {agent.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-bold mb-1">{agent.name}</h2>
              <p className="text-sm text-slate group-hover:text-paper/70 mb-3">
                {agent.agentProfile?.agency || "Independent Agent"}
              </p>
              <span className="text-xs font-semibold uppercase tracking-wide text-accent group-hover:text-paper">
                {agent.listingCount} active {agent.listingCount === 1 ? "listing" : "listings"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}