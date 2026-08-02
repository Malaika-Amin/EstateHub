import connectDB from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET - fetch all properties (public, with optional filters later)
export async function GET(req: Request) {
  try {
    await connectDB();
    const properties = await Property.find({ status: "available" })
      .populate("agent", "name email avatar agentProfile")
      .sort({ createdAt: -1 });

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST - create a new property (agent only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "agent" && role !== "admin") {
      return NextResponse.json({ error: "Only agents can create listings" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    const property = await Property.create({
      ...body,
      agent: (session.user as any).id,
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}