import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Collection from "@/lib/models/collection"
import Deposit from "@/lib/models/deposit"
import Employee from "@/lib/models/employee"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get all employees
    const employees = await Employee.find({})

    // Process data for each employee
    const reportData = []

    let totalCollectionAllLocations = 0
    let totalDepositAllLocations = 0
    let totalDifferenceAllLocations = 0

    for (const employee of employees) {
      // Get all collections for this employee
      const collections = await Collection.find({
        employee: employee._id,
      }).sort({ date: -1 })

      // Get all deposits for this employee
      const deposits = await Deposit.find({
        employee: employee._id,
      }).sort({ date: -1 })

      // Calculate total collection and deposit amounts
      const totalCollection = collections.reduce((sum, col) => sum + col.amount, 0)
      const totalDeposit = deposits.reduce((sum, dep) => sum + dep.amount, 0)

      // Calculate difference
      const difference = totalCollection - totalDeposit

      // Get most recent transaction date
      const allTransactions = [...collections, ...deposits].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      const mostRecentDate =
        allTransactions.length > 0
          ? new Date(allTransactions[0].date).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-"

      // Add to totals
      totalCollectionAllLocations += totalCollection
      totalDepositAllLocations += totalDeposit
      totalDifferenceAllLocations += difference

      // Format difference for display
      let formattedDifference = "-"
      if (difference !== 0) {
        formattedDifference =
          difference < 0 ? `(-)${Math.abs(difference).toLocaleString()}` : difference.toLocaleString()
      }

      reportData.push({
        location: employee.location,
        empId: employee.empId,
        empName: employee.empName,
        collection: totalCollection.toLocaleString(),
        date: mostRecentDate,
        difference: formattedDifference,
      })
    }

    return NextResponse.json({
      report: reportData,
      summary: {
        totalCollection: totalCollectionAllLocations,
        totalDeposit: totalDepositAllLocations,
        totalDifference: totalDifferenceAllLocations,
      },
    })
  } catch (error) {
    console.error("Error generating outstanding report:", error)
    return NextResponse.json({ error: "An error occurred while generating the outstanding report" }, { status: 500 })
  }
}
