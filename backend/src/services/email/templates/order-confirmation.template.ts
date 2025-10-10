import { config } from "@/config/env";
import { IOrder } from "@/models/Order";
import { formatCurrency } from "@/utils/index";

export const orderConfirmationTemplate = (order: IOrder) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <img src="${item.productImage}" alt="${item.productName}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        <span style="color: #666; font-size: 14px;">
          ${item.variant.color} • ${item.quantity} ${item.unitOfMeasure}(s)
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ${formatCurrency(item.totalPrice)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Hi <strong>${order.shippingAddress.firstName}</strong>,
        </p>
        
        <p style="margin-bottom: 20px;">
          Thank you for your order! We've received your payment and are preparing your items for shipment.
        </p>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #667eea;">Order Details</h2>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #667eea;">Items Ordered</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHTML}
          </table>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <span>${formatCurrency(order.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Shipping:</span>
              <span>${formatCurrency(order.shippingCost)}</span>
            </div>
            ${
              order.discount > 0
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #10b981;">
              <span>Discount:</span>
              <span>-${formatCurrency(order.discount)}</span>
            </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid #eee; font-size: 18px; font-weight: bold;">
              <span>Total:</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #667eea;">Shipping Address</h2>
          <p style="margin: 0;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
            ${order.shippingAddress.address}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br/>
            ${order.shippingAddress.country}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${config.CLIENT_URL}/profile/orders/${order._id}" 
             style="display: inline-block; background: #667eea; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Track Your Order
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
          If you have any questions, please contact our support team at 
          <a href="mailto:support@folastore.com" style="color: #667eea;">support@folastore.com</a>
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Fola Store. All rights reserved.</p>
        <p>
          <a href="${config.CLIENT_URL}" style="color: #667eea; text-decoration: none;">Visit our store</a> | 
          <a href="${config.CLIENT_URL}/support" style="color: #667eea; text-decoration: none;">Customer Support</a>
        </p>
      </div>
    </body>
    </html>
  `;
};
