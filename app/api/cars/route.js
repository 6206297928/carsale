import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. GET ALL CARS (For the Showroom)
export async function GET(req) {
  await connectDB();
  // Fetch only AVAILABLE cars for the public showroom
  const cars = await Car.find({ status: 'AVAILABLE' }).sort({ createdAt: -1 });
  return NextResponse.json(cars);
}

// 2. ADD NEW CAR (The Logic You Requested)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  // Check if user is logged in
  if (!session) {
    return NextResponse.json({ error: "Please Login first" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    // 👑 ADMIN LOGIC: 
    // If Admin -> Status is 'AVAILABLE' (Instantly Live)
    // If Customer -> Status is 'PENDING' (Needs Approval)
    const isAdmin = session.user.role === 'admin';
    const initialStatus = isAdmin ? 'AVAILABLE' : 'PENDING';

    const newCar = await Car.create({
      ...body,
      sellerId: session.user.email, 
      status: initialStatus,        // <--- This sets the status automatically
    });

    return NextResponse.json({ 
      message: isAdmin ? "Car Added to Showroom Instantly! 🚀" : "Submitted for Approval ⏳", 
      success: true, 
      car: newCar 
    });

  } catch (error) {
    console.error("Add Car Error:", error);
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
  }
}