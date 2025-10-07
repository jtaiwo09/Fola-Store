import { useStoreSettings } from "@/components/providers/store-settings";
import { formatCurrency } from "@/lib/utils";

interface Product {
  basePrice?: number;
  salePrice?: number;
  currency: string;
}

interface UseProductPriceResult {
  hasDiscount: boolean;
  formattedBasePrice: string | null;
  formattedSalePrice: string | null;
  priceToDisplay: string | null;
}

export function useProductPrice(product: Product): UseProductPriceResult {
  const { settings } = useStoreSettings();
  const currency = settings?.store.currency;
  const language = settings?.store.language;

  return getProductPriceDetails({ product, currency, language });
}

export function getProductPriceDetails({
  product,
  currency,
  language,
}: {
  product: Product;
  currency?: string;
  language?: string;
}): UseProductPriceResult {
  const hasDiscount = Boolean(
    product.salePrice &&
      product.basePrice &&
      product.salePrice < product.basePrice
  );

  // Format base and sale prices if available
  const formattedBasePrice = product.basePrice
    ? formatCurrency(product.basePrice, currency, language)
    : null;
  const formattedSalePrice = product.salePrice
    ? formatCurrency(product.salePrice, currency, language)
    : null;

  // Decide the price to display
  const priceToDisplay = product.salePrice
    ? formattedSalePrice
    : formattedBasePrice;

  return {
    hasDiscount,
    formattedBasePrice,
    formattedSalePrice,
    priceToDisplay,
  };
}
