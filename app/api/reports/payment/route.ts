import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/db"
import Collection from "@/lib/models/collection"
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

    // Build query based on parameters
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

    // Get all employees if no specific employee is requested
    let employees
    if (employeeId) {
      employees = await Employee.find({ _id: employeeId })
    } else {
      employees = await Employee.find({})
    }

    // Process data for each employee
    const reportData = []

    for (const employee of employees) {
      // Get collections for this employee
      const collections = await Collection.find({
        ...query,
        employee: employee._id,
      }).sort({ date: 1 })

      // Get deposits for this employee
      const deposits = await Deposit.find({
        ...query,
        employee: employee._id,
      }).sort({ date: 1 })

      // Calculate total collection and deposit amounts
      const totalCollection = collections.reduce((sum, col) => sum + col.amount, 0)
      const totalDeposit = deposits.reduce((sum, dep) => sum + dep.amount, 0)

      // Calculate difference
      const difference = totalCollection - totalDeposit

      // Process collections and deposits to create report rows
      const reportRows = processPaymentReport(collections, deposits, employee)

      reportData.push({
        employee: {
          id: employee._id,
          empId: employee.empId,
          empName: employee.empName,
          location: employee.location,
        },
        totalCollection,
        totalDeposit,
        difference,
        rows: reportRows,
      })
    }

    return NextResponse.json({
      report: reportData,
    })
  } catch (error) {
    console.error("Error generating payment report:", error)
    return NextResponse.json({ error: "An error occurred while generating the payment report" }, { status: 500 })
  }
}

// Helper function to process collections and deposits into report rows
function processPaymentReport(collections, deposits, employee) {
  const rows = []
  const remainingCollections = [...collections]
  const remainingDeposits = [...deposits]

  // Process each collection
  for (const collection of collections) {
    const collectionDate = new Date(collection.date)
    const formattedCollectionDate = collectionDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })

    // Find deposits for this collection
    const relatedDeposits = []
    let remainingCollectionAmount = collection.amount

    // Process deposits that should be applied to this collection
    for (let i = 0; i < remainingDeposits.length; i++) {
      const deposit = remainingDeposits[i]
      const depositDate = new Date(deposit.date)

      // Only consider deposits that are on or after the collection date
      if (depositDate >= collectionDate) {
        const amountToApply = Math.min(remainingCollectionAmount, deposit.amount)

        if (amountToApply > 0) {
          relatedDeposits.push({
            amount: amountToApply,
            date: depositDate,
            formattedDate: depositDate.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          })

          remainingCollectionAmount -= amountToApply
          remainingDeposits[i] = {
            ...deposit,
            amount: deposit.amount - amountToApply,
          }

          // If deposit is fully used, remove it
          if (remainingDeposits[i].amount === 0) {
            remainingDeposits.splice(i, 1)
            i--
          }

          // If collection is fully covered, break
          if (remainingCollectionAmount === 0) {
            break
          }
        }
      }
    }

    // Add row for this collection
    rows.push({
      location: employee.location,
      empId: employee.empId,
      empName: employee.empName,
      collections: collection.amount,
      date: formattedCollectionDate,
      cashDeposit: relatedDeposits.length > 0 ? relatedDeposits[0].amount : null,
      depositDate: relatedDeposits.length > 0 ? relatedDeposits[0].formattedDate : null,
      difference: remainingCollectionAmount > 0 ? remainingCollectionAmount.toString() : "-",
    })

    // Add additional rows for remaining deposits
    for (let i = 1; i < relatedDeposits.length; i++) {
      rows.push({
        location: employee.location,
        empId: employee.empId,
        empName: employee.empName,
        collections: null,
        date: null,
        cashDeposit: relatedDeposits[i].amount,
        depositDate: relatedDeposits[i].formattedDate,
        difference: "-",
      })
    }
  }

  // Add rows for any remaining deposits
  for (const deposit of remainingDeposits) {
    if (deposit.amount > 0) {
      const depositDate = new Date(deposit.date)
      const formattedDepositDate = depositDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })

      rows.push({
        location: employee.location,
        empId: employee.empId,
        empName: employee.empName,
        collections: null,
        date: null,
        cashDeposit: deposit.amount,
        depositDate: formattedDepositDate,
        difference: "-",
      })
    }
  }

  return rows
}
