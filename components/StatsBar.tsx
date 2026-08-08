import connectDB from "@/lib/db";
import Property from "@/models/Property";
import User from "@/models/User";

export default async function StatsBar() {
  await connectDB();

  const [listingCount, agentCount, cities] = await Promise.all([
    Property.countDocuments({ status: "available" }),
    User.countDocuments({ role: "agent" }),
    Property.distinct("location.city", { status: "available" }),
  ]);

  const stats = [
    { value: listingCount, label: "Active Listings" },
    { value: agentCount, label: "Verified Agents" },
    { value: cities.length, label: "Cities Covered" },
  ];

  return (
    <div className="border-y border-ink/10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-bold text-ink">{stat.value}</p>
            <p className="text-xs sm:text-sm text-slate mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}