"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import Employee from "@/lib/models/employee"
import Collection from "@/lib/models/collection"
import Deposit from "@/lib/models/deposit"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function addEmployeeData(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    const employeeId = formData.get("employeeId") as string
    const collectionAmount = Number.parseFloat(formData.get("collectionAmount") as string)
    const collectionDate = formData.get("collectionDate") as string
    const depositAmount = Number.parseFloat(formData.get("depositAmount") as string)
    const depositDate = formData.get("depositDate") as string

    if (!employeeId || isNaN(collectionAmount) || !collectionDate || isNaN(depositAmount) || !depositDate) {
      return { error: "All fields are required" }
    }

    await connectDB()

    // Find employee
    const employee = await Employee.findById(employeeId)
    if (!employee) {
      return { error: "Employee not found" }
    }

    // Record collection if amount > 0
    if (collectionAmount > 0) {
      await Collection.create({
        employee: employeeId,
        amount: collectionAmount,
        date: new Date(collectionDate),
        createdBy: session.user.id,
      })
    }

    // Record deposit if amount > 0
    if (depositAmount > 0) {
      await Deposit.create({
        employee: employeeId,
        amount: depositAmount,
        date: new Date(depositDate),
        createdBy: session.user.id,
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/outstanding-report")

    return { success: true }
  } catch (error) {
    console.error("Error adding employee data:", error)
    return { error: "An error occurred while adding employee data" }
  }
}

export async function getEmployees() {
  try {
    await connectDB()

    const employees = await Employee.find({}).sort({ empName: 1 })

    return { employees: JSON.parse(JSON.stringify(employees)) }
  } catch (error) {
    console.error("Error fetching employees:", error)
    return { error: "An error occurred while fetching employees" }
  }
}
