import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectDB();

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    // Create User (Role will be 'customer' by default unless you send 'admin')
    // Security Note: In a real app, you wouldn't let the API set 'admin' role freely.
    await User.create({ 
      name, 
      email, 
      password, // In real app: await bcrypt.hash(password, 10)
      role: role || "customer" 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}