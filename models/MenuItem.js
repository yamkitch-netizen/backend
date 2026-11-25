import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    desc: {
      type: String,
      default: "",
      trim: true,
    },
    isBase: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
