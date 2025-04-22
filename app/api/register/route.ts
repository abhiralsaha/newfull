import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role: "user", // Default role
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
