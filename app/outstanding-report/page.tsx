"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import { getOutstandingReport } from "@/lib/actions/report-actions"
import { getEmployees } from "@/lib/actions/employee-actions"
import { EmployeeDataModal } from "@/components/employee-data-modal"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function OutstandingReport() {
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
      const [reportResult, employeesResult] = await Promise.all([getOutstandingReport(), getEmployees()])

      if (reportResult.error) {
        toast({
          title: "Error",
          description: reportResult.error,
          variant: "destructive",
        })
      } else {
        setReportData(reportResult)
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

  const paginatedData = reportData.report.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const totalPages = Math.ceil(reportData.report.length / rowsPerPage)

  return (
    <div className="bg-[#f8fafc] min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm hidden md:flex flex-col">
        <div className="p-6">
          <div className="text-[#664895] font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
            Outstanding Report
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white p-4 md:p-6 flex justify-between items-center border-b shadow-sm">
          <h1 className="text-xl font-semibold text-[#664895]">Outstanding Report (All Locations)</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Outstanding Report</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* KPI Cards and Button */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-[#f1f5f9] p-3 rounded-full">
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
                  <p className="text-sm text-gray-500">
                    Total Collection (MM)
                    <br /> (All Locations)
                  </p>
                  <p className="text-lg font-semibold text-black">
                    ₹{reportData.summary.totalCollection.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
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
                  <p className="text-sm text-gray-500">
                    Total Deposit Amount
                    <br /> (All Locations)
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{reportData.summary.totalDeposit.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-full">
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
                  <p className="text-sm text-gray-500">
                    Difference Amount
                    <br /> (All Locations)
                  </p>
                  <p className="text-lg font-semibold text-red-600">
                    ₹{reportData.summary.totalDifference.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="text-right flex items-center justify-end">
              {session?.user?.role === "admin" && (
                <Button
                  variant="outline"
                  className="text-red-500 border-white hover:bg-red-50"
                  onClick={() => setIsModalOpen(true)}
                >
                  Insert Employee Data
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <Card className="border-white">
            <CardContent className="p-4 overflow-x-auto">
              <Table className="bg-white border-white">
                <TableHeader className="bg-white text-black">
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Emp. ID</TableHead>
                    <TableHead>Emp. Name</TableHead>
                    <TableHead>Collections (MM)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Difference</TableHead>
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
                    paginatedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.empId}</TableCell>
                        <TableCell>{item.empName}</TableCell>
                        <TableCell>{item.collection}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell
                          className={`font-medium ${
                            item.difference.includes("-")
                              ? "text-red-500"
                              : item.difference.includes("+")
                                ? "text-green-600"
                                : "text-black"
                          }`}
                        >
                          {item.difference}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Rows dropdown + Centered Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-gray-500">
              Show
              <select
                className="mx-2 border rounded px-2 py-1"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              Rows
            </div>
            <div className="flex justify-center w-full md:w-auto">
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors duration-200
                        ${
                          page === currentPage
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-orange-500 border-orange-400 hover:bg-orange-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                })}

                {totalPages > 5 && (
                  <>
                    <span className="px-2 py-1 text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors duration-200
                        ${
                          totalPages === currentPage
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-orange-500 border-orange-400 hover:bg-orange-100"
                        }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-4">Powered by Aestriks</div>
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
