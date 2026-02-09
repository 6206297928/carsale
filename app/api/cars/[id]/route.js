import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET Single Car
export async function GET(req, { params }) {
  // 🟢 FIX 1: Await params before using them
  const { id } = await params; 
  
  await connectDB();
  const car = await Car.findById(id);
  
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
  return NextResponse.json(car);
}

// PUT (Update) Car
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 🟢 FIX 1: Await params here too
  const { id } = await params;

  const body = await req.json();
  await connectDB();

  const updatedCar = await Car.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ message: "Car Updated", car: updatedCar });
}

// DELETE Car
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 🟢 FIX 1: Await params here too
  const { id } = await params;

  await connectDB();
  const car = await Car.findById(id);

  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });

  // Allow if Admin OR Seller
  if (session.user.role === 'admin' || car.sellerId === session.user.email) {
    await Car.findByIdAndDelete(id);
    return NextResponse.json({ message: "Car Deleted" });
  } else {
    return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
  }
}