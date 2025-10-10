import Notification from "@/models/Notification";
import User from "@/models/User";
import { IOrder } from "@/models/Order";
import { IProduct } from "@/models/Product";
import { emitToAdmin, emitToAllAdmins } from "@/config/socket";
import { emailService } from "./email/email.service";
import { orderConfirmationTemplate } from "./email/templates/order-confirmation.template";
// import { newOrderAdminTemplate } from "./email/templates/new-order-admin.template";
import { deliveryConfirmationTemplate } from "./email/templates/delivery-confirmation.template";
import { config } from "@/config/env";
import { smsService } from "./sms.service";

class NotificationService {
  // Create notification in database
  async createNotification(data: {
    recipient: string;
    type: "low_stock" | "new_order" | "order_status" | "review" | "general";
    title: string;
    message: string;
    data?: any;
  }) {
    const notification = await Notification.create(data);

    // Emit real-time notification via Socket.IO
    emitToAdmin(data.recipient, "notification", notification);

    return notification;
  }

  // Notify all admins
  async notifyAllAdmins(data: {
    type: "low_stock" | "new_order" | "order_status" | "review" | "general";
    title: string;
    message: string;
    data?: any;
  }) {
    const admins = await User.find({
      role: { $in: ["admin", "staff"] },
      isActive: true,
    });

    const notifications = await Promise.all(
      admins.map((admin) =>
        this.createNotification({
          recipient: admin._id.toString(),
          ...data,
        })
      )
    );

    // Emit to all admins via Socket.IO
    emitToAllAdmins("notification", { ...data, notifications });

    return notifications;
  }

  // Send new order notifications (Email + In-app)
  async notifyNewOrder(order: IOrder) {
    try {
      // 1. Send confirmation email to customer
      await emailService.sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: orderConfirmationTemplate(order),
      });

      // 2. Send notification email to all admins
      // const admins = await User.find({
      //   role: { $in: ["admin", "staff"] },
      //   isActive: true,
      // });

      // await emailService.sendBulkEmails(
      //   admins.map((admin) => ({
      //     to: admin.email,
      //     subject: `New Order Received - ${order.orderNumber}`,
      //     html: newOrderAdminTemplate(order),
      //   }))
      // );

      // 3. Create in-app notifications for admins
      await this.notifyAllAdmins({
        type: "new_order",
        title: "New Order Received",
        message: `Order ${order.orderNumber} from ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        },
      });

      console.log(`✅ New order notifications sent for ${order.orderNumber}`);
    } catch (error: any) {
      console.error(
        "❌ Failed to send new order notifications:",
        error.message
      );
      throw error;
    }
  }

  // Send delivery confirmation (Email + In-app)
  async notifyOrderDelivered(order: IOrder) {
    try {
      // 1. Send delivery confirmation email to customer
      await emailService.sendEmail({
        to: order.shippingAddress.email,
        subject: `Your Order Has Been Delivered! - ${order.orderNumber}`,
        html: deliveryConfirmationTemplate(order),
      });

      // 2. Create in-app notification for admins
      await this.notifyAllAdmins({
        type: "order_status",
        title: "Order Delivered",
        message: `Order ${order.orderNumber} has been successfully delivered`,
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          deliveredAt: order.deliveredAt,
        },
      });

      // 3. Send SMS to customer
      smsService
        .sendOrderDelivered(order.shippingAddress.phone, order.orderNumber)
        .catch((err) => console.error("Failed to send SMS:", err));

      console.log(`✅ Delivery confirmation sent for ${order.orderNumber}`);
    } catch (error: any) {
      console.error("❌ Failed to send delivery confirmation:", error.message);
      throw error;
    }
  }

  // Notify low stock
  async notifyLowStock(product: IProduct) {
    try {
      await this.notifyAllAdmins({
        type: "low_stock",
        title: "Low Stock Alert",
        message: `${product.name} is running low on stock (${product.totalStock} remaining)`,
        data: {
          productId: product._id,
          productName: product.name,
          currentStock: product.totalStock,
          threshold: product.lowStockThreshold || 10,
        },
      });

      console.log(`✅ Low stock notification sent for ${product.name}`);
    } catch (error: any) {
      console.error("❌ Failed to send low stock notification:", error.message);
    }
  }

  // Notify order status change
  async notifyOrderStatusChange(order: IOrder, _previousStatus: string) {
    try {
      const statusMessages: Record<string, string> = {
        processing: "Your order is now being processed",
        shipped: "Your order has been shipped",
        delivered: "Your order has been delivered",
        cancelled: "Your order has been cancelled",
      };

      const message =
        statusMessages[order.status] || "Your order status has been updated";

      // Send email to customer
      await emailService.sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Status Update - ${order.orderNumber}`,
        html: `
          <p>Hi ${order.shippingAddress.firstName},</p>
          <p>${message}.</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>New Status:</strong> ${order.status.toUpperCase()}</p>
          ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ""}
          <p><a href="${config.CLIENT_URL}/profile/orders/${order._id}">View Order Details</a></p>
        `,
      });

      if (order.status === "shipped" && order.trackingNumber) {
        smsService
          .sendOrderShipped(
            order.shippingAddress.phone,
            order.orderNumber,
            order.trackingNumber
          )
          .catch((err) => console.error("Failed to send SMS:", err));
      }

      console.log(`✅ Order status update sent for ${order.orderNumber}`);
    } catch (error: any) {
      console.error("❌ Failed to send order status update:", error.message);
    }
  }
}

export const notificationService = new NotificationService();

// Export helper functions for backward compatibility
export const notifyNewOrder = (order: IOrder) =>
  notificationService.notifyNewOrder(order);

export const notifyOrderDelivered = (order: IOrder) =>
  notificationService.notifyOrderDelivered(order);

export const notifyLowStock = (product: IProduct) =>
  notificationService.notifyLowStock(product);

export const notifyOrderStatusChange = (
  order: IOrder,
  previousStatus: string
) => notificationService.notifyOrderStatusChange(order, previousStatus);
