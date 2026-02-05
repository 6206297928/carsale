import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const pendingCars = await Car.find({ status: "PENDING" }).sort({ createdAt: -1 });
    
    return NextResponse.json(pendingCars);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}