import twilio from "twilio";
import { config } from "@/config/env";

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

class SMSService {
  private from: string;

  constructor() {
    this.from = config.TWILIO_PHONE_NUMBER!;
    if (!this.from) {
      throw new Error("TWILIO_PHONE_NUMBER is not configured.");
    }
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      await client.messages.create({
        body: message,
        from: this.from,
        to: to,
      });

      console.log(`✅ SMS sent to: ${to}`);
    } catch (error: any) {
      console.error("❌ SMS send failed:", error.message);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendOrderShipped(
    phone: string,
    orderNumber: string,
    trackingNumber: string
  ): Promise<void> {
    const message = `Your order ${orderNumber} has been shipped! Track it here: ${config.CLIENT_URL}/track/${trackingNumber}`;
    await this.sendSMS(phone, message);
  }

  async sendOrderDelivered(phone: string, orderNumber: string): Promise<void> {
    const message = `Great news! Your order ${orderNumber} has been delivered. Thank you for shopping with us!`;
    await this.sendSMS(phone, message);
  }

  async sendPaymentFailed(phone: string, orderNumber: string): Promise<void> {
    const message = `Payment failed for order ${orderNumber}. Please update your payment method at ${config.CLIENT_URL}/orders/${orderNumber}`;
    await this.sendSMS(phone, message);
  }

  async sendLowStockAlert(
    phone: string,
    productName: string,
    stock: number
  ): Promise<void> {
    const message = `⚠️ LOW STOCK ALERT: ${productName} has only ${stock} units remaining. Restock immediately!`;
    await this.sendSMS(phone, message);
  }
}

export const smsService = new SMSService();
