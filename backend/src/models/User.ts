// models/User.ts
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { AddressSchema, IShippingAddress } from "./Order";
import { BaseDocument } from "../types";

export interface IUser extends BaseDocument {
  clerkId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;

  role: {
    type: String;
    enum: ["customer", "admin", "staff"];
    default: "customer";
    index: true;
  };

  addresses: IShippingAddress[];

  isEmailVerified: boolean;
  isActive: boolean;

  lastLogin?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true, // Allows null for admin users
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    phone: { type: String, trim: true },
    avatar: { type: String },

    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
      index: true,
    },

    addresses: [AddressSchema],

    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },

    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
