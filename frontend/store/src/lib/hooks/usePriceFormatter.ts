import { useStoreSettings } from "@/components/providers/store-settings";
import { formatCurrency } from "../utils";

export const usePriceFormatter = () => {
  const { settings } = useStoreSettings();

  const locale = settings?.store.language;
  const currency = settings?.store.currency;

  return (amount: number) => formatCurrency(amount, currency, locale);
};
