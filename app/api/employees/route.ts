import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Employee from "@/lib/models/employee"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const employees = await Employee.find({}).sort({ empName: 1 })

    return NextResponse.json({ employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "An error occurred while fetching employees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { empId, empName, location } = await request.json()

    if (!empId || !empName || !location) {
      return NextResponse.json({ error: "Employee ID, name, and location are required" }, { status: 400 })
    }

    await connectDB()

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ empId })
    if (existingEmployee) {
      return NextResponse.json({ error: "Employee with this ID already exists" }, { status: 409 })
    }

    const employee = await Employee.create({
      empId,
      empName,
      location,
    })

    return NextResponse.json(
      {
        message: "Employee created successfully",
        employee,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "An error occurred while creating the employee" }, { status: 500 })
  }
}
