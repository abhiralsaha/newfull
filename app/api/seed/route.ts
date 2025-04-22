import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"
import Employee from "@/lib/models/employee"
import Collection from "@/lib/models/collection"
import Deposit from "@/lib/models/deposit"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    await connectDB()

    // Clear existing data
    await User.deleteMany({})
    await Employee.deleteMany({})
    await Collection.deleteMany({})
    await Deposit.deleteMany({})

    // Create admin user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("admin123", salt)

    const admin = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    })

    // Create employees
    const employees = await Employee.insertMany([
      { empId: "1", empName: "Mayank", location: "BGRoad, Karnataka" },
      { empId: "2", empName: "Prasad", location: "BGRoad, Karnataka" },
      { empId: "3", empName: "Suman", location: "Bilaspur, Chhattisgarh" },
      { empId: "4", empName: "Rahul", location: "chennai.cdm01" },
      { empId: "5", empName: "Priya", location: "NaviMumbai" },
    ])

    // Create collections for Mayank (example from requirements)
    const mayank = employees[0]

    const collections = await Collection.insertMany([
      {
        employee: mayank._id,
        amount: 10000,
        date: new Date("2025-03-26"),
        createdBy: admin._id,
      },
      {
        employee: mayank._id,
        amount: 20000,
        date: new Date("2025-03-27"),
        createdBy: admin._id,
      },
    ])

    // Create deposits for Mayank
    const deposits = await Deposit.insertMany([
      {
        employee: mayank._id,
        amount: 5000,
        date: new Date("2025-03-28"),
        createdBy: admin._id,
      },
      {
        employee: mayank._id,
        amount: 7000,
        date: new Date("2025-03-29"),
        createdBy: admin._id,
      },
      {
        employee: mayank._id,
        amount: 8000,
        date: new Date("2025-03-30"),
        createdBy: admin._id,
      },
      {
        employee: mayank._id,
        amount: 15000,
        date: new Date("2025-03-31"),
        createdBy: admin._id,
      },
    ])

    // Create some sample data for other employees
    for (let i = 1; i < employees.length; i++) {
      const employee = employees[i]

      // Random collection amount between 3000 and 50000
      const collectionAmount = Math.floor(Math.random() * 47000) + 3000

      await Collection.create({
        employee: employee._id,
        amount: collectionAmount,
        date: new Date("2025-03-26"),
        createdBy: admin._id,
      })

      // Random deposit amount that might be less than collection
      const depositAmount = Math.floor(Math.random() * collectionAmount)

      await Deposit.create({
        employee: employee._id,
        amount: depositAmount,
        date: new Date("2025-03-28"),
        createdBy: admin._id,
      })
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      admin: { email: admin.email, name: admin.name },
      employeesCount: employees.length,
      collectionsCount: await Collection.countDocuments(),
      depositsCount: await Deposit.countDocuments(),
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "An error occurred while seeding the database" }, { status: 500 })
  }
}
