import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Please Login to Book" }, { status: 401 });
  }

  try {
    const { carId, transactionId } = await req.json();
    
    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    await connectDB();

    // Check if car is still available
    const car = await Car.findById(carId);
    if (!car || car.status !== 'AVAILABLE') {
      return NextResponse.json({ error: "Car is already booked!" }, { status: 400 });
    }

    // Mark as BOOKED and save the Payment ID
    await Car.findByIdAndUpdate(carId, {
        status: "BOOKED",
        buyerId: session.user.email,
        transactionId: transactionId
    });

    // Refresh pages
    revalidatePath('/');
    revalidatePath('/profile');

    return NextResponse.json({ message: "Booking Successful", success: true });

  } catch (error) {
    return NextResponse.json({ error: "Booking Failed" }, { status: 500 });
  }
}