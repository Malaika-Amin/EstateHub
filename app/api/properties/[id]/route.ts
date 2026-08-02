import connectDB from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET - fetch a single property
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT - update a property (only the owning agent, or admin)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (property.agent.toString() !== userId && role !== "admin") {
      return NextResponse.json({ error: "Not authorized to edit this listing" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await Property.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ property: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE - remove a property (only the owning agent, or admin)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (property.agent.toString() !== userId && role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this listing" }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ message: "Listing deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}