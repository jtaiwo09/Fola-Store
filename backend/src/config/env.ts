import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;

  // Clerk (Primary Auth for Store)
  CLERK_SECRET_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  WEBHOOK_SECRET: string;

  // JWT (Fallback/Admin)
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;

  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_PUBLIC_KEY: string;
  CLIENT_URL: string;
  ADMIN_URL: string;
  DEV_CLIENT_URL?: string;
  PROD_CLIENT_URL?: string;

  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;

  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_PHONE_NUMBER?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: EnvConfig = {
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  PORT: parseInt(getEnvVar("PORT", "5000"), 10),
  MONGODB_URI: getEnvVar("MONGODB_URI"),

  CLERK_SECRET_KEY: getEnvVar("CLERK_SECRET_KEY"),
  CLERK_PUBLISHABLE_KEY: getEnvVar("CLERK_PUBLISHABLE_KEY"),
  WEBHOOK_SECRET: getEnvVar("WEBHOOK_SECRET"),

  JWT_SECRET: getEnvVar("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnvVar("JWT_EXPIRES_IN", "7d"),
  JWT_REFRESH_SECRET: getEnvVar("JWT_REFRESH_SECRET"),
  JWT_REFRESH_EXPIRES_IN: getEnvVar("JWT_REFRESH_EXPIRES_IN", "30d"),

  PAYSTACK_SECRET_KEY: getEnvVar("PAYSTACK_SECRET_KEY"),
  PAYSTACK_PUBLIC_KEY: getEnvVar("PAYSTACK_PUBLIC_KEY"),
  CLIENT_URL: getEnvVar("CLIENT_URL", "http://localhost:3000"),
  ADMIN_URL: getEnvVar("ADMIN_URL", "http://localhost:3001"),

  RESEND_API_KEY: getEnvVar("RESEND_API_KEY"),
  EMAIL_FROM: getEnvVar("EMAIL_FROM", "noreply@folastore.com"),

  DEV_CLIENT_URL: process.env.DEV_CLIENT_URL,
  PROD_CLIENT_URL: process.env.PROD_CLIENT_URL,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
};

export const isDevelopment = config.NODE_ENV === "development";
export const isProduction = config.NODE_ENV === "production";
export const isTest = config.NODE_ENV === "test";
