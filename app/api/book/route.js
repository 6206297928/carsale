import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please Login" }, { status: 401 });

  try {
    const { carId, transactionId, phone } = await req.json(); // <--- Receive Phone
    
    if (!transactionId || !phone) {
      return NextResponse.json({ error: "Transaction ID and Phone are required" }, { status: 400 });
    }

    await connectDB();
    
    await Car.findByIdAndUpdate(carId, {
        status: "BOOKED",
        buyerId: session.user.email,
        buyerPhone: phone, // <--- Save Phone
        transactionId: transactionId
    });

    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ message: "Booking Successful", success: true });
  } catch (error) {
    return NextResponse.json({ error: "Booking Failed" }, { status: 500 });
  }
}