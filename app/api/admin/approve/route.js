import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { carId, action } = await req.json();
    await connectDB();

    if (action === 'approve') {
      await Car.findByIdAndUpdate(carId, { status: "AVAILABLE" });
      return NextResponse.json({ message: "Approved" });
    } 
    else if (action === 'reject') {
      await Car.findByIdAndDelete(carId);
      return NextResponse.json({ message: "Rejected" });
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}