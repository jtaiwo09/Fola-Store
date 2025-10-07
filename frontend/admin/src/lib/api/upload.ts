// apps/admin/src/lib/api/upload.ts
import apiClient, { ApiResponse } from "./client";

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export const uploadApi = {
  uploadSingle: async (file: File): Promise<ApiResponse<UploadedImage>> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  uploadMultiple: async (
    files: File[]
  ): Promise<ApiResponse<{ images: UploadedImage[] }>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await apiClient.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  deleteImage: async (publicId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete("/upload/image", {
      data: { publicId },
    });

    return response.data;
  },
};
