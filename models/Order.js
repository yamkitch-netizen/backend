import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mealSlot: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    orderType: {
      type: String,
      enum: ["subscription", "corporate", "custom"],
      default: "subscription",
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, default: "", trim: true },
      organisation: { type: String, default: "", trim: true },
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    mealsScheduled: {
      type: [String],
      default: [],
    },
    corporateDetails: {
      programType: { type: String, default: "" },
      guestsCount: { type: Number, default: 0 },
      serviceStyle: { type: String, default: "" },
    },
    customMealDetails: {
      items: { type: [String], default: [] },
      plates: { type: Number, default: 1 },
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPayable: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
