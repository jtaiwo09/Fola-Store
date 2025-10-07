// backend/src/controllers/upload.controller.ts
import { Request, Response } from "express";
import cloudinary from "@/config/cloudinary";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import asyncHandler from "@/utils/asyncHandler";
import streamifier from "streamifier";

// @desc    Upload single image to Cloudinary
// @route   POST /api/v1/upload/image
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No file uploaded");
  }

  // Upload buffer to Cloudinary using stream
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "fola-store/products",
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    },
    (error, result) => {
      if (error) {
        throw ApiError.badRequest("Image upload failed");
      }

      return ApiResponse.ok(res, "Image uploaded successfully", {
        url: result!.secure_url,
        publicId: result!.public_id,
        width: result!.width,
        height: result!.height,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/v1/upload/images
// @access  Private/Admin
export const uploadImages = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw ApiError.badRequest("No files uploaded");
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "fola-store/products",
            resource_type: "image",
            transformation: [
              { width: 1000, height: 1000, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
                width: result!.width,
                height: result!.height,
              });
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const results = await Promise.all(uploadPromises);

    return ApiResponse.ok(res, "Images uploaded successfully", {
      images: results,
    });
  }
);

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/image
// @access  Private/Admin
export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body;

  if (!publicId) {
    throw ApiError.badRequest("Public ID is required");
  }

  await cloudinary.uploader.destroy(publicId);

  return ApiResponse.ok(res, "Image deleted successfully");
});

// @desc    Upload review images (Customer accessible)
// @route   POST /api/v1/upload/review-images
// @access  Private (Authenticated customers)
export const uploadReviewImages = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw ApiError.badRequest("No files uploaded");
    }

    if (req.files.length > 5) {
      throw ApiError.badRequest("Maximum 5 images allowed");
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "fola-store/reviews",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result!.secure_url,
                publicId: result!.public_id,
              });
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const results = await Promise.all(uploadPromises);

    return ApiResponse.ok(res, "Review images uploaded successfully", {
      images: results,
    });
  }
);
