import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { BaseDocument } from "../types";

export interface IShippingAddress {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Export the AddressSchema for use in Order model
export const AddressSchema = new Schema<IShippingAddress>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    _id: true,
    timestamps: true,
  }
);

export interface IUser extends BaseDocument {
  clerkId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;

  role: "customer" | "admin" | "staff";

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
      sparse: true,
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
