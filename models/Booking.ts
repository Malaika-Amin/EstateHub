import mongoose, { Schema, models, model } from "mongoose";

const BookingSchema = new Schema(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedDate: { type: Date, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Booking || model("Booking", BookingSchema);