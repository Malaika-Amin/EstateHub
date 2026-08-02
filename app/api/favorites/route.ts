import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET - fetch current user's favorite property IDs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById((session.user as any).id).select("favorites");

    return NextResponse.json({ favorites: user?.favorites || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// POST - toggle a property in favorites (add if not present, remove if present)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById((session.user as any).id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFavorited = user.favorites.some((id: any) => id.toString() === propertyId);

    if (isFavorited) {
      user.favorites = user.favorites.filter((id: any) => id.toString() !== propertyId);
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();

    return NextResponse.json(
      { favorites: user.favorites, favorited: !isFavorited },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}