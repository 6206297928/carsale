import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";

// 🛑 SERVER-SIDE: Force Dynamic
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    
    // Get all 'AVAILABLE' cars + Sort by newest
    const cars = await Car.find({ status: "AVAILABLE" }).sort({ createdAt: -1 });
    
    // 🛑 HEADERS: Explicitly forbid caching
    const response = NextResponse.json(cars);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}