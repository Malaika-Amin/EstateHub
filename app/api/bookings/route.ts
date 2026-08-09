import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { propertyId, agentId, requestedDate, message } = await req.json();

    if (!propertyId || !agentId || !requestedDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const booking = await Booking.create({
      property: propertyId,
      buyer: (session.user as any).id,
      agent: agentId,
      requestedDate,
      message,
    });

    return NextResponse.json({ booking }, { status: 201 });
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
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const filter = role === "agent" ? { agent: userId } : { buyer: userId };

    const bookings = await Booking.find(filter)
      .populate("property", "title images location price")
      .populate("buyer", "name email phone")
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}