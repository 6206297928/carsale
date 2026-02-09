import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 🔴 REPLACE THIS WITH YOUR EXACT EMAIL ADDRESS
    const myEmail = "sushilpoddar90@gmail.com"; 

    // Find your user and force-update role to 'admin'
    const updatedUser = await User.findOneAndUpdate(
      { email: myEmail },
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ 
        error: "User not found! Please Login to the site first so your account is created." 
      });
    }

    return NextResponse.json({ 
      message: "🎉 Success! You are now an Admin.", 
      user: updatedUser 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}