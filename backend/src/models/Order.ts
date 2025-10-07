// models/Order.ts
import mongoose, { Schema, Types } from "mongoose";
import { BaseDocument } from "../types";

export interface IOrderItem {
  product: Types.ObjectId;
  productName: string;
  productImage: string;
  variant: {
    sku: string;
    color: string;
    colorHex: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitOfMeasure: string;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IPaymentDetails {
  method: "paystack" | "bank_transfer" | "cash_on_delivery";
  transactionId?: string;
  reference: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  paidAt?: Date;
}

export interface IOrder extends BaseDocument {
  orderNumber: string;
  customer: Types.ObjectId;

  // Order Items
  items: IOrderItem[];

  // Pricing
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;

  // Addresses
  shippingAddress: IShippingAddress;
  billingAddress: IShippingAddress;

  // Payment
  payment: IPaymentDetails;

  // Order Status
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  fulfillmentStatus: "unfulfilled" | "partially_fulfilled" | "fulfilled";

  // Shipping
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;

  // Notes
  customerNote?: string;
  internalNote?: string;

  // Timestamps
  cancelledAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    variant: {
      sku: { type: String, required: true },
      color: { type: String, required: true },
      colorHex: { type: String, required: true },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitOfMeasure: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

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
  },
  { _id: false }
);

const PaymentSchema = new Schema<IPaymentDetails>(
  {
    method: {
      type: String,
      enum: ["paystack", "bank_transfer", "cash_on_delivery"],
      required: true,
    },
    transactionId: { type: String },
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
    paidAt: { type: Date },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [OrderItemSchema],

    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },

    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema, required: true },

    payment: { type: PaymentSchema, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ["unfulfilled", "partially_fulfilled", "fulfilled"],
      default: "unfulfilled",
    },
    trackingNumber: { type: String },
    carrier: { type: String },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    estimatedDelivery: { type: Date },

    customerNote: { type: String, maxlength: 500 },
    internalNote: { type: String, maxlength: 1000 },

    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
// OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
// OrderSchema.index({ "payment.status": 1 });
OrderSchema.index({ createdAt: -1 });

// Generate order number
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(
      5,
      "0"
    )}`;
  }
  next();
});

export default mongoose.model<IOrder>("Order", OrderSchema);
