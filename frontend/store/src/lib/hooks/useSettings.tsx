import { ApiResponse } from "../api/client";
import { API_ENDPOINTS } from "../constants/api-endpoints";
import { usePublicQuery } from "./usePublicQuery";

export interface ISettings {
  payment: {
    bankTransfer: {
      enabled: boolean;
    };
    cashOnDelivery: {
      enabled: boolean;
    };
    paystack: { enabled: boolean };
  };
  shipping: {
    estimatedDeliveryDays: { min: number; max: number };
    flatRate: number;
  };
  store: {
    currency: string;
    name: string;
    language: string;
  };
}

export const useSettings = () => {
  return usePublicQuery<ApiResponse<{ settings: ISettings }>, ISettings>(
    [API_ENDPOINTS.STORE_SETTINGS],
    API_ENDPOINTS.STORE_SETTINGS,
    {
      select: (res) => res.data.settings,
    }
  );
};
