import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Car from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // 1. Find cars I sold
  const myListings = await Car.find({ sellerId: session.user.email }).sort({ createdAt: -1 });

  // 2. Find cars I bought
  const myOrders = await Car.find({ buyerId: session.user.email }).sort({ createdAt: -1 });

  return NextResponse.json({ myListings, myOrders });
}