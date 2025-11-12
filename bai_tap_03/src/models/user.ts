import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    gender: { type: Boolean, default: false },
    image: { type: String },
    roleId: { type: String },
    positionId: { type: String },
  },
  { timestamps: true }
);

const User = (mongoose.models.User as mongoose.Model<any>) || mongoose.model("User", userSchema);

export default User;
