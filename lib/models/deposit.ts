import mongoose from "mongoose"

const DepositSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Please provide an employee"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide a deposit amount"],
    min: 0,
  },
  date: {
    type: Date,
    required: [true, "Please provide a deposit date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

export default mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema)
