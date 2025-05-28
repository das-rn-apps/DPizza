// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/custom"; // Import the custom IUser type

interface UserDoc extends IUser {
  password?: string; // Password is required during creation but not always selected
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<UserDoc> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt); // Use non-null assertion as it's modified
});

// Compare password method
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password!); // Use non-null assertion
};

const User = mongoose.model<UserDoc>("User", UserSchema);

export default User;
