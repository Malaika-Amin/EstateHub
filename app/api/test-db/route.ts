import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "Connected to MongoDB!" });
  } catch (error) {
    return NextResponse.json({ status: "Connection failed", error: String(error) }, { status: 500 });
  }
}