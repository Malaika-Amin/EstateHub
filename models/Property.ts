import mongoose, { Schema, models, model } from "mongoose";

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ["sale", "rent"], required: true },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "land", "commercial"],
      required: true,
    },
    location: {
      address: String,
      city: String,
      coordinates: { type: [Number], index: "2dsphere" }, // [lng, lat]
    },
    bedrooms: Number,
    bathrooms: Number,
    areaSqft: Number,
    amenities: [String],
    images: [String],
    agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["available", "pending", "sold", "rented"],
      default: "available",
    },
    featured: { type: Boolean, default: false },
    featuredUntil: Date,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Property || model("Property", PropertySchema);