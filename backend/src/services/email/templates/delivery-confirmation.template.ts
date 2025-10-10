import { config } from "@/config/env";
import { IOrder } from "@/models/Order";
import { formatCurrency } from "@/utils/index";

export const deliveryConfirmationTemplate = (order: IOrder) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Delivered</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">📦 Order Delivered! </h1>
      </div>
      
      <div style="background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">
          Hi <strong>${order.shippingAddress.firstName}</strong>,
        </p>
        
        <p style="margin-bottom: 20px;">
          Great news! Your order <strong>${order.orderNumber}</strong> has been successfully delivered.
        </p>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Delivered On:</strong> ${new Date(order.deliveredAt!).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Order Total:</strong> ${formatCurrency(order.total)}</p>
        </div>

        <p style="margin: 20px 0;">
          We hope you love your purchase! If you have any questions or concerns about your order, 
          please don't hesitate to reach out to our support team.
        </p>

        <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #065f46;">
            💚 Thank you for shopping with us!
          </p>
          <p style="margin: 10px 0 0 0; color: #047857;">
            Your support means the world to us. We'd love to hear about your experience!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${config.CLIENT_URL}/profile/orders/${order._id}" 
             style="display: inline-block; background: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
            View Order
          </a>
          <a href="${config.CLIENT_URL}/products" 
             style="display: inline-block; background: white; color: #10b981; border: 2px solid #10b981; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Shop Again
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #999; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Fola Store. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};
