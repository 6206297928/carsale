import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ride from "@/models/Ride";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.source || !body.destination || !body.userPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    const newRide = await Ride.create({
        ...body,
        status: 'PENDING'
    });

    return NextResponse.json({ message: "Request Saved", success: true, rideId: newRide._id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}