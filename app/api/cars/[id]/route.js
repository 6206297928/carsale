import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(req, props) {
  const params = await props.params; // <--- 1. AWAIT PARAMS
  await connectDB();
  const car = await Car.findById(params.id);
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
  return NextResponse.json(car);
}

export async function PUT(req, props) {
  const params = await props.params; // <--- 2. AWAIT PARAMS HERE TOO
  
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Remove _id from body to prevent immutable field error
    delete body._id; 

    await connectDB();

    const updatedCar = await Car.findByIdAndUpdate(
      params.id, 
      { ...body }, 
      { new: true }
    );
    
    // Force cache clear
    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}