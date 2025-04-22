"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Check, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EmployeePaymentReport() {
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data for the table
  const tableData = [
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: 10000,
      date: "26 Mar 2025",
      cashDeposit: 5000,
      depositDate: "28 Mar 2025",
      difference: "-",
    },
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: null,
      date: null,
      cashDeposit: 5000,
      depositDate: "29 Mar 2025",
      difference: "-",
    },
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: 20000,
      date: "27 Mar 2025",
      cashDeposit: 2000,
      depositDate: "29 Mar 2025",
      difference: "-",
    },
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: null,
      date: null,
      cashDeposit: 8000,
      depositDate: "30 Mar 2025",
      difference: "-",
    },
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: null,
      date: null,
      cashDeposit: 10000,
      depositDate: "31 Mar 2025",
      difference: "-",
    },
    {
      location: "BGRoad, Karnataka",
      empId: "1",
      empName: "Mayank",
      collections: null,
      date: null,
      cashDeposit: 5000,
      depositDate: "31 Mar 2025",
      difference: "5,000",
    },
  ]

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b">
          <h1 className="text-xl font-semibold text-[#664895]">Employee Payment Report</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#664895] text-[#664895] hover:bg-[#664895] hover:text-white"
              asChild
            >
              <Link href="/outstanding-report">
                <FileText className="h-4 w-4" />
                Outstanding Report
              </Link>
            </Button>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {/* Total Collection Card */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <path d="M18 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
                <path d="M12 12v8" />
                <path d="M8 16h8" />
                <path d="M3 10h3" />
                <path d="M3 14h3" />
                <path d="M3 18h3" />
                <path d="M21 10h-3" />
                <path d="M21 14h-3" />
                <path d="M21 18h-3" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Collection (MM) Amount</p>
              <p className="text-2xl font-bold">₹87,000</p>
            </div>
          </div>

          {/* Total Deposit Card */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Deposit Amount</p>
              <p className="text-2xl font-bold text-green-600">₹55,000</p>
            </div>
          </div>

          {/* Difference Card */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <circle cx="8" cy="8" r="6" />
                <circle cx="16" cy="16" r="6" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Difference Amount</p>
              <p className="text-2xl font-bold text-red-600">₹32,000</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-4 md:p-6">
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-600 font-medium">Location</TableHead>
                  <TableHead className="text-gray-600 font-medium">Emp. ID</TableHead>
                  <TableHead className="text-gray-600 font-medium">Emp. Name</TableHead>
                  <TableHead className="text-gray-600 font-medium">Collections (MM)</TableHead>
                  <TableHead className="text-gray-600 font-medium">Date</TableHead>
                  <TableHead className="text-gray-600 font-medium">Cash Deposit</TableHead>
                  <TableHead className="text-gray-600 font-medium">Deposit Date</TableHead>
                  <TableHead className="text-gray-600 font-medium">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.empId}</TableCell>
                    <TableCell>{row.empName}</TableCell>
                    <TableCell>{row.collections?.toLocaleString() || ""}</TableCell>
                    <TableCell>{row.date || ""}</TableCell>
                    <TableCell>{row.cashDeposit?.toLocaleString()}</TableCell>
                    <TableCell>{row.depositDate}</TableCell>
                    <TableCell>{row.difference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">Rows</span>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  page === currentPage ? "bg-[#ee632b] text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <span className="text-gray-400">...</span>

            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700">
              10
            </button>

            <button className="p-1 rounded hover:bg-gray-100 text-gray-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
