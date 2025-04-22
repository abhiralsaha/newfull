"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addEmployeeData } from "@/lib/actions/employee-actions"
import { useToast } from "@/components/ui/use-toast"

interface Employee {
  _id: string
  empId: string
  empName: string
  location: string
}

interface EmployeeDataModalProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
}

export function EmployeeDataModal({ isOpen, onClose, employees }: EmployeeDataModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    collectionAmount: "",
    collectionDate: new Date().toISOString().split("T")[0],
    depositAmount: "",
    depositDate: new Date().toISOString().split("T")[0],
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataObj = new FormData()
    formDataObj.append("employeeId", formData.employeeId)
    formDataObj.append("collectionAmount", formData.collectionAmount)
    formDataObj.append("collectionDate", formData.collectionDate)
    formDataObj.append("depositAmount", formData.depositAmount)
    formDataObj.append("depositDate", formData.depositDate)

    try {
      const result = await addEmployeeData(formDataObj)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Employee data added successfully",
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Employee Data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Select Employee</Label>
              <Select value={formData.employeeId} onValueChange={(value) => handleChange("employeeId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.empName} ({employee.empId}) - {employee.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="collectionAmount">Collection Amount</Label>
                <Input
                  id="collectionAmount"
                  type="number"
                  min="0"
                  value={formData.collectionAmount}
                  onChange={(e) => handleChange("collectionAmount", e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Input
                  id="collectionDate"
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => handleChange("collectionDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  min="0"
                  value={formData.depositAmount}
                  onChange={(e) => handleChange("depositAmount", e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="depositDate">Deposit Date</Label>
                <Input
                  id="depositDate"
                  type="date"
                  value={formData.depositDate}
                  onChange={(e) => handleChange("depositDate", e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
