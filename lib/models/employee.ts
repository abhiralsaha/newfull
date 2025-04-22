import mongoose from "mongoose"

const EmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "Please provide an employee ID"],
    unique: true,
  },
  empName: {
    type: String,
    required: [true, "Please provide an employee name"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema)
