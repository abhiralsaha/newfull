"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { X, FileText } from "lucide-react"
import { getPaymentReport } from "@/lib/actions/report-actions"
import { getEmployees } from "@/lib/actions/employee-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { EmployeeDataModal } from "@/components/employee-data-modal"

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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 p-4 md:p-6">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <Image src="/icons/bag-icon.png" alt="Total Collection Icon" width={32} height={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Collection (MM) Amount</p>
              <p className="text-2xl font-bold">₹{reportData.summary.totalCollection.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Image src="/icons/check-icon.png" alt="Total Deposit Icon" width={32} height={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Deposit Amount</p>
              <p className="text-2xl font-bold text-green-600">₹{reportData.summary.totalDeposit.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <Image src="/icons/coin-icon.png" alt="Difference Icon" width={32} height={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Difference Amount</p>
              <p className="text-2xl font-bold text-red-600">₹{reportData.summary.totalDifference.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-4 md:p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>MM Collection</TableHead>
                <TableHead>Cash Deposit</TableHead>
                <TableHead>Difference</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.empName}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>₹{row.collections?.toLocaleString() || "-"}</TableCell>
                    <TableCell>₹{row.cashDeposit?.toLocaleString() || "-"}</TableCell>
                    <TableCell className={row.difference !== "-" ? "text-red-500" : "text-green-600"}>
                      ₹{row.difference}
                    </TableCell>
                    <TableCell>{row.remarks || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 md:p-6 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modal for inserting employee data */}
      <EmployeeDataModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        employees={employees}
        refreshData={fetchData}
      />
    </div>
  )
}
