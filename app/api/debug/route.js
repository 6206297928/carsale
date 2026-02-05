import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch EVERYTHING (No filters)
    const allCars = await Car.find({});
    
    // Log to your terminal so you can see it there too
    console.log("--------------- DEBUG DB START ---------------");
    console.log(`Found ${allCars.length} total cars.`);
    allCars.forEach(c => console.log(`- ${c.title} | Status: ${c.status} | Seller: ${c.sellerId}`));
    console.log("--------------- DEBUG DB END -----------------");

    return NextResponse.json({
      count: allCars.length,
      cars: allCars
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}