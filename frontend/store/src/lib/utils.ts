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
  locale: string = "en-NG"
): string {
  const options = {
    style: "currency" as const,
    currency: currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  };

  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (e) {
    console.error("Error formatting currency:", e);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatRelativeTime(date: string | Date | dayjs.Dayjs): string {
  return dayjs(date).fromNow();
}
