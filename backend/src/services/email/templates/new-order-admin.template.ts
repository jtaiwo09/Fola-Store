import { config } from "@/config/env";
import { IOrder } from "@/models/Order";
import { formatCurrency } from "@/utils/index";

export const newOrderAdminTemplate = (order: IOrder) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e293b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🛍️ New Order Received</h1>
      </div>
      
      <div style="background: #f1f5f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #1e293b;">Order Summary</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
          <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
          <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          <p><strong>Total Amount:</strong> ${formatCurrency(order.total)}</p>
          <p><strong>Items:</strong> ${order.items.length} item(s)</p>
          <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          <p><strong>Payment Status:</strong> ${order.payment.status.toUpperCase()}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="${config.ADMIN_URL}/admin/orders/${order._id}" 
             style="display: inline-block; background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Order Details
          </a>
        </div>
      </div>
    </body>
    </html>
  `;
};
