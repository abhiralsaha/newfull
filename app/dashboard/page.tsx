"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getPaymentReport } from "@/lib/actions/report-actions"
import { getEmployees } from "@/lib/actions/employee-actions"
import { EmployeeDataModal } from "@/components/employee-data-modal"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [reportData, setReportData] = useState({
    report: [],
    summary: {
      totalCollection: 0,
      totalDeposit: 0,
      totalDifference: 0,
    },
  })
  const [tableData, setTableData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [reportResult, employeesResult] = await Promise.all([getPaymentReport(), getEmployees()])

      if (reportResult.error) {
        toast({
          title: "Error",
          description: reportResult.error,
          variant: "destructive",
        })
      } else {
        setReportData(reportResult)

        // Flatten the report data for the table
        const flattenedData = []
        reportResult.report.forEach((employeeReport) => {
          employeeReport.rows.forEach((row) => {
            flattenedData.push(row)
          })
        })

        setTableData(flattenedData)
      }

      if (employeesResult.error) {
        toast({
          title: "Error",
          description: employeesResult.error,
          variant: "destructive",
        })
      } else {
        setEmployees(employeesResult.employees)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(tableData.length / rowsPerPage)
  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

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
            {session?.user?.role === "admin" && (
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => setIsModalOpen(true)}
              >
                Insert Employee Data
              </Button>
            )}
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
              <p className="text-2xl font-bold">₹{reportData.summary.totalCollection.toLocaleString()}</p>
            </div>
          </div>

          {/* Total Deposit Card */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
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
                className="text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Deposit Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{reportData.summary.totalDeposit.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-red-600">₹{reportData.summary.totalDifference.toLocaleString()}</p>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.empId}</TableCell>
                      <TableCell>{row.empName}</TableCell>
                      <TableCell>{row.collections?.toLocaleString() || ""}</TableCell>
                      <TableCell>{row.date || ""}</TableCell>
                      <TableCell>{row.cashDeposit?.toLocaleString() || ""}</TableCell>
                      <TableCell>{row.depositDate || ""}</TableCell>
                      <TableCell>{row.difference}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue placeholder={rowsPerPage.toString()} />
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
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-400"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <button
                  key={pageNumber}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    pageNumber === currentPage ? "bg-[#ee632b] text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            })}

            {totalPages > 5 && (
              <>
                <span className="text-gray-400">...</span>

                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-700"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-700"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Employee Data Modal */}
      {isModalOpen && (
        <EmployeeDataModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            fetchData() // Refresh data after modal closes
          }}
          employees={employees}
        />
      )}
    </div>
  )
}
