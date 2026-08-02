import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google OAuth users
    role: { type: String, enum: ["buyer", "agent", "admin"], default: "buyer" },
    avatar: { type: String },
    phone: { type: String },
    agentProfile: {
      agency: String,
      bio: String,
      licenseNumber: String,
      rating: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);