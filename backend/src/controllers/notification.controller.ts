import { Request, Response } from "express";
import Notification from "@/models/Notification";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import asyncHandler from "@/utils/asyncHandler";
import { APP_CONSTANTS } from "@/config/constants";

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = APP_CONSTANTS.DEFAULT_PAGE,
      limit = APP_CONSTANTS.DEFAULT_LIMIT,
      isRead,
      type,
    } = req.query;

    const query: any = { recipient: req.user!._id };

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    if (type) {
      query.type = type;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(
      parseInt(limit as string, 10),
      APP_CONSTANTS.MAX_LIMIT
    );
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort("-createdAt")
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: req.user!._id, isRead: false }),
    ]);

    return ApiResponse.success(
      res,
      200,
      "Notifications retrieved successfully",
      notifications,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        unreadCount,
      }
    );
  }
);

// @desc    Mark notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user!._id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    throw ApiError.notFound("Notification not found");
  }

  return ApiResponse.ok(res, "Notification marked as read", { notification });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    await Notification.updateMany(
      { recipient: req.user!._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return ApiResponse.ok(res, "All notifications marked as read");
  }
);

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user!._id,
    });

    if (!notification) {
      throw ApiError.notFound("Notification not found");
    }

    return ApiResponse.ok(res, "Notification deleted");
  }
);

// @desc    Delete all read notifications
// @route   DELETE /api/v1/notifications/clear-read
// @access  Private
export const clearReadNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    await Notification.deleteMany({
      recipient: req.user!._id,
      isRead: true,
    });

    return ApiResponse.ok(res, "Read notifications cleared");
  }
);
