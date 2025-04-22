import mongoose from "mongoose"

const CollectionSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Please provide an employee"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide a collection amount"],
    min: 0,
  },
  date: {
    type: Date,
    required: [true, "Please provide a collection date"],
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

export default mongoose.models.Collection || mongoose.model("Collection", CollectionSchema)
