import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Import Auth

export async function POST(req) {
  try {
    const { orderId, paymentId, signature, carId } = await req.json();
    
    // 1. Get Logged In User
    const session = await getServerSession(authOptions);
    if (!session) {
       return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    // 2. Verify Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // 3. Update Database (Mark as BOOKED + Save Buyer)
    await connectDB();
    await Car.findByIdAndUpdate(carId, { 
        status: "BOOKED",
        buyerId: session.user.email // <--- SAVE THE BUYER HERE
    });

    return NextResponse.json({ message: "Payment Verified", success: true });

  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
}