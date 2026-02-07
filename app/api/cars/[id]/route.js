import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET Single Car (For Details Page)
export async function GET(req, { params }) {
  await connectDB();
  const car = await Car.findById(params.id);
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
  return NextResponse.json(car);
}

// DELETE Car (Admin or Owner)
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const car = await Car.findById(params.id);

  // Allow if user is Admin OR if user is the Seller
  if (session.user.role === 'admin' || car.sellerId === session.user.email) {
    await Car.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Car Deleted" });
  } else {
    return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
  }
}

// PUT (Update) Car
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  // Update logic here...
  await Car.findByIdAndUpdate(params.id, body);
  return NextResponse.json({ message: "Car Updated" });
}