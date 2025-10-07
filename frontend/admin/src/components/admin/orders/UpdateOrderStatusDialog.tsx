"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect } from "@/components/forms";
import { useUpdateOrderStatus } from "@/lib/hooks/useOrders";
import { Order } from "@/lib/api/orders";

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

interface UpdateOrderStatusDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export default function UpdateOrderStatusDialog({
  order,
  open,
  onOpenChange,
}: UpdateOrderStatusDialogProps) {
  const updateStatus = useUpdateOrderStatus();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateStatusFormData>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      carrier: order.carrier || "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = (data: UpdateStatusFormData) => {
    updateStatus.mutate(
      {
        id: order._id,
        payload: {
          status: data.status,
          // trackingNumber: data.trackingNumber,
          // carrier: data.carrier,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const showShippingFields = selectedStatus === "shipped";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Update the status of order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormSelect
            id="status"
            label="Order Status"
            options={STATUS_OPTIONS}
            value={selectedStatus}
            onValueChange={(value) => setValue("status", value as any)}
            error={errors.status}
            required
          />

          {showShippingFields && (
            <>
              <FormInput
                id="trackingNumber"
                label="Tracking Number"
                placeholder="Enter tracking number"
                register={register("trackingNumber")}
                error={errors.trackingNumber}
              />

              <FormInput
                id="carrier"
                label="Carrier"
                placeholder="e.g., DHL, FedEx, UPS"
                register={register("carrier")}
                error={errors.carrier}
              />
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateStatus.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
