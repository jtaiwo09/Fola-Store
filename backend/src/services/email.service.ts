import nodemailer from "nodemailer";
import { config } from "@/config/env";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create transporter
const createTransporter = () => {
  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    console.warn("⚠️  Email service not configured");
    return null;
  }

  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT || 587,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log("📧 Email would be sent to:", options.to);
    console.log("📝 Subject:", options.subject);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Fola Store" <${config.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("✅ Email sent successfully to:", options.to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export const sendOrderConfirmation = async (
  email: string,
  orderNumber: string,
  orderDetails: any
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order ${orderNumber} has been received and is being processed.</p>
      <h2>Order Details:</h2>
      <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: "Welcome to Fola Store!",
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining Fola Store. We're excited to have you!</p>
      <p>Start exploring our premium lace collection now.</p>
    `,
  });
};

export const sendLowStockAlert = async (
  adminEmail: string,
  product: any
): Promise<void> => {
  await sendEmail({
    to: adminEmail,
    subject: `⚠️ Low Stock Alert: ${product.name}`,
    html: `
      <h1>⚠️ Low Stock Alert</h1>
      <p>The following product is running low on stock:</p>
      <h2>${product.name}</h2>
      <p><strong>Current Stock:</strong> ${product.totalStock} units</p>
      <p><strong>Threshold:</strong> ${product.lowStockThreshold} units</p>
      <p><strong>SKU:</strong> ${product.variants?.[0]?.sku || "N/A"}</p>
      <p>Please restock this product as soon as possible.</p>
      <a href="${process.env.CLIENT_URL}/admin/products/${product._id}/edit" 
         style="display:inline-block;background:#3b82f6;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:20px;">
        Update Product
      </a>
    `,
  });
};

export const sendNewOrderNotification = async (
  adminEmail: string,
  order: any
): Promise<void> => {
  await sendEmail({
    to: adminEmail,
    subject: `🛒 New Order #${order.orderNumber}`,
    html: `
      <h1>🛒 New Order Received</h1>
      <h2>Order #${order.orderNumber}</h2>
      <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
      <p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>
      <p><strong>Items:</strong> ${order.items.length}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <a href="${process.env.CLIENT_URL}/admin/orders/${order._id}" 
         style="display:inline-block;background:#3b82f6;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;margin-top:20px;">
        View Order Details
      </a>
    `,
  });
};
