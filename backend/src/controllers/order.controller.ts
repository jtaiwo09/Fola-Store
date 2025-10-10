import { Request, Response } from "express";
import Order from "@/models/Order";
import Product from "@/models/Product";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import {
  initializeOrderPayment,
  verifyPaystackPayment,
} from "@/services/payment.service";
import {
  APP_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/config/constants";
import { generateOrderNumber } from "@/utils/generateOrderNumber";
import { notifyNewOrder } from "@/services/notification.service";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shippingAddress, billingAddress, paymentReference } = req.body;

  // Step 1: Get all products at once
  const productIds = items.map((item: any) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const orderItems = [];
  let subtotal = 0;

  // Step 2: Validate stock, calculate subtotal, prepare orderItems
  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.product);

    if (!product) {
      throw ApiError.notFound(`Product ${item.product} not found`);
    }

    const variant = product.getVariantByColor(item.variant.color);

    if (!variant) {
      throw ApiError.notFound(ERROR_MESSAGES.VARIANT_NOT_FOUND);
    }

    if (variant.stock < item.quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for ${product.name} in ${variant.color}. Available: ${variant.stock}`
      );
    }

    const effectivePrice = product.salePrice || product.basePrice;
    const totalPrice = effectivePrice * item.quantity;
    subtotal += totalPrice;

    orderItems.push({
      product: product._id,
      productName: product.name,
      productImage: product.featuredImage,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: effectivePrice,
      totalPrice,
      unitOfMeasure: product.unitOfMeasure,
    });

    // Reduce stock immediately (in memory)
    variant.stock -= item.quantity;
  }

  // Step 3: Save updated products in parallel
  await Promise.all(products.map((p) => p.save()));

  const shippingCost = APP_CONSTANTS.DEFAULT_SHIPPING_COST;
  const total = subtotal + shippingCost;
  const orderNumber = await generateOrderNumber();

  // Step 4: Create the order
  const order = await Order.create({
    customer: req.user!._id,
    items: orderItems,
    subtotal,
    shippingCost,
    total,
    currency: APP_CONSTANTS.DEFAULT_CURRENCY,
    shippingAddress,
    billingAddress,
    payment: {
      method: "paystack",
      reference: paymentReference,
      status: "pending",
      amount: total,
      currency: APP_CONSTANTS.DEFAULT_CURRENCY,
    },
    orderNumber,
  });

  // Step 5: Send async notification (non-blocking)
  notifyNewOrder(order).catch((err) => {
    console.error("Failed to send order notification:", err.message);
  });

  return ApiResponse.created(res, SUCCESS_MESSAGES.ORDER_CREATED, { order });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
// backend/controllers/order.controller.ts - UPDATE getAllOrders
export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = APP_CONSTANTS.DEFAULT_PAGE,
      limit = APP_CONSTANTS.DEFAULT_LIMIT,
      status,
      paymentStatus,
      sort = "-createdAt",
      search,
      startDate,
      endDate,
    } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (paymentStatus) query["payment.status"] = paymentStatus;

    // Search by order number or customer email
    if (search) {
      query.$or = [{ orderNumber: { $regex: search, $options: "i" } }];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(
      parseInt(limit as string, 10),
      APP_CONSTANTS.MAX_LIMIT
    );
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer", "firstName lastName email")
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    return ApiResponse.success(
      res,
      200,
      "Orders retrieved successfully",
      orders,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  }
);

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate("customer", "firstName lastName email phone")
      .lean();

    console.log(56, order);

    if (!order) {
      throw ApiError.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Check if user owns the order or is admin
    if (
      order.customer._id.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin" &&
      req.user!.role !== "staff"
    ) {
      throw ApiError.forbidden("You do not have permission to view this order");
    }

    return ApiResponse.ok(res, "Order retrieved successfully", { order });
  }
);

// @desc    Get current user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = APP_CONSTANTS.DEFAULT_PAGE,
    limit = APP_CONSTANTS.DEFAULT_LIMIT,
  } = req.query;

  const pageNum = parseInt(page as string, 10);
  const limitNum = Math.min(
    parseInt(limit as string, 10),
    APP_CONSTANTS.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ customer: req.user!._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments({ customer: req.user!._id }),
  ]);

  return ApiResponse.success(
    res,
    200,
    "Orders retrieved successfully",
    orders,
    {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    }
  );
});

// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw ApiError.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    order.status = status;

    if (status === "shipped") {
      order.shippedAt = new Date();
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (carrier) order.carrier = carrier;
    }

    if (status === "delivered") {
      order.deliveredAt = new Date();
      order.fulfillmentStatus = "fulfilled";
    }

    if (status === "cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    return ApiResponse.ok(res, SUCCESS_MESSAGES.ORDER_UPDATED, { order });
  }
);

// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw ApiError.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND);
  }

  // Check if user owns the order
  if (order.customer.toString() !== req.user!._id.toString()) {
    throw ApiError.forbidden("You do not have permission to cancel this order");
  }

  // Check if order can be cancelled
  if (["shipped", "delivered", "cancelled"].includes(order.status)) {
    throw ApiError.badRequest(
      `Cannot cancel order with status: ${order.status}`
    );
  }

  order.status = "cancelled";
  order.cancelledAt = new Date();

  // Restore stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      const variantIndex = product.variants.findIndex(
        (v) => v.sku === item.variant.sku
      );
      if (variantIndex !== -1) {
        product.variants[variantIndex].stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  return ApiResponse.ok(res, "Order cancelled successfully", { order });
});

// @desc    Verify payment
// @route   POST /api/v1/orders/verify-payment
// @access  Private
export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { reference } = req.body;

    if (!reference) {
      throw ApiError.badRequest("Payment reference is required");
    }

    // Verify payment with Paystack
    const paymentData = await verifyPaystackPayment(reference);

    // Find order
    const order = await Order.findOne({ "payment.reference": reference });

    if (!order) {
      throw ApiError.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Update payment status
    if (paymentData.status === "success") {
      order.payment.status = "completed";
      order.payment.transactionId = paymentData.id.toString();
      order.payment.paidAt = new Date();
      order.status = "processing";
    } else {
      order.payment.status = "failed";
    }

    await order.save();

    return ApiResponse.ok(res, SUCCESS_MESSAGES.PAYMENT_SUCCESS, { order });
  }
);

// @desc    Get order statistics
// @route   GET /api/v1/orders/stats/overview
// @access  Private/Admin
export const getOrderStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await Order.aggregate([
      {
        $facet: {
          statusBreakdown: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          paymentBreakdown: [
            { $group: { _id: "$payment.status", count: { $sum: 1 } } },
          ],
          totalRevenue: [
            { $match: { "payment.status": "completed" } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ],
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: "users",
                localField: "customer",
                foreignField: "_id",
                as: "customer",
              },
            },
            { $unwind: "$customer" },
          ],
        },
      },
    ]);

    return ApiResponse.ok(res, "Order statistics retrieved successfully", {
      stats: stats[0],
    });
  }
);

// @desc    Initialize payment for order
// @route   POST /api/v1/orders/:id/initialize-payment
// @access  Private
export const initializePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw ApiError.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Check ownership
    if (order.customer.toString() !== req.user!._id.toString()) {
      throw ApiError.forbidden("Not authorized");
    }

    // Initialize payment
    const paymentData = await initializeOrderPayment({
      email: req.user!.email,
      amount: order.total,
      orderId: order._id.toString(),
      metadata: {
        customerName: `${req.user!.firstName} ${req.user!.lastName}`,
        orderNumber: order.orderNumber,
      },
    });

    // Update order with payment reference
    order.payment.reference = paymentData.reference;
    await order.save();

    return ApiResponse.ok(res, "Payment initialized", {
      authorizationUrl: paymentData.authorization_url,
      accessCode: paymentData.access_code,
      reference: paymentData.reference,
    });
  }
);

// @desc    Get user dashboard stats
// @route   GET /api/v1/orders/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const [totalOrders, pendingOrders, completedOrders, totalSpent] =
      await Promise.all([
        Order.countDocuments({ customer: userId }),
        Order.countDocuments({ customer: userId, status: "pending" }),
        Order.countDocuments({ customer: userId, status: "delivered" }),
        Order.aggregate([
          {
            $match: {
              customer: userId,
              "payment.status": "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const recentOrders = await Order.find({ customer: userId })
      .sort("-createdAt")
      .limit(5)
      .lean();

    return ApiResponse.ok(res, "Dashboard stats retrieved", {
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpent: totalSpent[0]?.total || 0,
      },
      recentOrders,
    });
  }
);
