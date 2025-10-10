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
