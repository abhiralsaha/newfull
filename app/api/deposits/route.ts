import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Deposit from "@/lib/models/deposit"
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

    const deposits = await Deposit.find(query).populate("employee", "empId empName location").sort({ date: -1 })

    return NextResponse.json({ deposits })
  } catch (error) {
    console.error("Error fetching deposits:", error)
    return NextResponse.json({ error: "An error occurred while fetching deposits" }, { status: 500 })
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

    const deposit = await Deposit.create({
      employee: employeeId,
      amount,
      date: new Date(date),
      createdBy: session.user.id,
    })

    return NextResponse.json(
      {
        message: "Deposit recorded successfully",
        deposit,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error recording deposit:", error)
    return NextResponse.json({ error: "An error occurred while recording the deposit" }, { status: 500 })
  }
}
