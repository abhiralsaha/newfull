"use server"

import { redirect } from "next/navigation"
import { signIn } from "next-auth/react"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
      return { error: "All fields are required" }
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Create new user
    await User.create({
      email,
      password,
      name,
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "An error occurred during registration" }
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      return { error: result.error }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An error occurred during login" }
  }
}

export async function logout() {
  redirect("/login")
}
