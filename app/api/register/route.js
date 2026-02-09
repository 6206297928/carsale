import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, secretKey } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 🕵️ SECRET KEY CHECK
    // If they typed 'admin123', they become Admin. Otherwise, simple User.
    const role = secretKey === "admin123" ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role, 
    });

    return NextResponse.json({ 
        message: role === "admin" ? "Admin Account Created! 👑" : "Account Created Successfully" 
    });

  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}