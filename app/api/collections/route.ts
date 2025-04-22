import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Collection from "@/lib/models/collection"
import Employee from "@/lib/models/employee"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    await connectDB()

    const query: any = {}

    if (employeeId) {
      query.employee = employeeId
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) }
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) }
    }

    const collections = await Collection.find(query).populate("employee", "empId empName location").sort({ date: -1 })

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "An error occurred while fetching collections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { employeeId, amount, date } = await request.json()

    if (!employeeId || !amount || !date) {
      return NextResponse.json({ error: "Employee ID, amount, and date are required" }, { status: 400 })
    }

    await connectDB()

    // Find employee
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    const collection = await Collection.create({
      employee: employeeId,
      amount,
      date: new Date(date),
      createdBy: session.user.id,
    })

    return NextResponse.json(
      {
        message: "Collection recorded successfully",
        collection,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error recording collection:", error)
    return NextResponse.json({ error: "An error occurred while recording the collection" }, { status: 500 })
  }
}
