import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ride from "@/models/Ride";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    // 1. Check if user is logged in (Optional)
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || "Guest"; // 🟢 Default to Guest

    const body = await req.json();
    
    // 2. Validation (Phone is mandatory, Login is NOT)
    if (!body.source || !body.destination || !body.userPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // 3. Create Ride (Works for both User and Guest)
    const newRide = await Ride.create({
        ...body,
        userId: userEmail, // Saves Email or "Guest"
        status: 'PENDING'
    });

    return NextResponse.json({ message: "Request Saved", success: true, rideId: newRide._id });

  } catch (error) {
    console.error("Ride Booking Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}