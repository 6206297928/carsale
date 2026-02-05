import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Car from "@/models/Car";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { carId, amount } = await req.json();
    await connectDB();

    // 1. Double check if car is still available
    const car = await Car.findById(carId);
    if (!car || car.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Car is already booked!" }, { status: 400 });
    }

    // 2. Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: carId,
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}