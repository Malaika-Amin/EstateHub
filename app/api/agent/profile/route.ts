import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "agent") {
      return NextResponse.json({ error: "Only agents can update this" }, { status: 403 });
    }

    const { agency, bio, phone } = await req.json();

    await connectDB();
    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      {
        phone,
        "agentProfile.agency": agency,
        "agentProfile.bio": bio,
      },
      { new: true }
    );

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById((session.user as any).id).select(
      "name email phone agentProfile"
    );

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}