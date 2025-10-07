import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
// import 'dayjs/locale/fr';

// dayjs.locale('fr');
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format = "ll"): string {
  return dayjs(date).format(format);
}

export function formatCurrency(
  amount: number,
  currency = "NGN",
  locale = "en-NG",
  fractionDigits?: number
): string {
  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits ?? 0,
    maximumFractionDigits: fractionDigits ?? 0,
  };

  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (e) {
    console.error("Error formatting currency:", e);
    // fallback formatting
    return `${currency} ${amount.toFixed(fractionDigits ?? 2)}`;
  }
}
