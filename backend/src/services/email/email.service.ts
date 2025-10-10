// backend/src/services/email/email.service.ts
import { Resend } from "resend";
import { config } from "@/config/env";

const resend = new Resend(config.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

class EmailService {
  private from: string;

  constructor() {
    this.from = config.EMAIL_FROM || "noreply@folastore.com";
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await resend.emails.send({
        from: options.from || this.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      });

      console.log(`✅ Email sent to: ${options.to}`);
    } catch (error: any) {
      console.error("❌ Email send failed:", error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendBulkEmails(emails: EmailOptions[]): Promise<void> {
    try {
      await Promise.all(emails.map((email) => this.sendEmail(email)));
      console.log(`✅ Bulk emails sent: ${emails.length} emails`);
    } catch (error: any) {
      console.error("❌ Bulk email send failed:", error.message);
      throw error;
    }
  }
}

export const emailService = new EmailService();
