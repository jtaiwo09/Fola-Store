// apps/admin/src/lib/hooks/useUpload.ts
import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "../api/upload";
import { toast } from "sonner";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadSingle(file),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload image");
    },
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadApi.uploadMultiple(files),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to upload images");
    },
  });
};

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (publicId: string) => uploadApi.deleteImage(publicId),
    onSuccess: () => {
      toast.success("Image deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete image");
    },
  });
};
