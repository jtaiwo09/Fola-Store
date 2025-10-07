// components/admin/settings/ShippingSettings.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormSwitch } from "@/components/forms";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import {
  useSettings,
  useUpdateShippingSettings,
} from "@/lib/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const shippingSettingsSchema = z.object({
  flatRate: z.number().min(0, "Flat rate must be positive"),
  freeShippingThreshold: z.number().min(0).optional(),
  estimatedDeliveryDays: z.object({
    min: z.number().min(1, "Must be at least 1 day"),
    max: z.number().min(1, "Must be at least 1 day"),
  }),
  shippingZones: z.array(
    z.object({
      name: z.string(),
      states: z.array(z.string()),
      rate: z.number(),
    })
  ),
});

type ShippingSettingsFormData = z.infer<typeof shippingSettingsSchema>;

export default function ShippingSettings() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateShippingSettings();
  const [enableFreeShipping, setEnableFreeShipping] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShippingSettingsFormData>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      flatRate: 1500,
      estimatedDeliveryDays: { min: 3, max: 7 },
      shippingZones: [],
    },
  });

  useEffect(() => {
    if (data?.data.settings) {
      reset(data.data.settings.shipping);
      setEnableFreeShipping(
        !!data.data.settings.shipping.freeShippingThreshold
      );
    }
  }, [data, reset]);

  const onSubmit = (formData: ShippingSettingsFormData) => {
    const payload = { ...formData };
    if (!enableFreeShipping) {
      delete payload.freeShippingThreshold;
    }
    updateSettings.mutate(payload);
  };

  if (isLoading) {
    return <ShippingSettingsSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Shipping Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="flatRate"
            label="Flat Shipping Rate"
            type="number"
            placeholder="1500"
            register={register("flatRate", { valueAsNumber: true })}
            error={errors.flatRate}
            required
            description="Default shipping cost for all orders"
          />

          <FormSwitch
            id="enableFreeShipping"
            label="Enable Free Shipping Threshold"
            checked={enableFreeShipping}
            onCheckedChange={setEnableFreeShipping}
            description="Offer free shipping for orders above a certain amount"
          />

          {enableFreeShipping && (
            <FormInput
              id="freeShippingThreshold"
              label="Free Shipping Threshold"
              type="number"
              placeholder="50000"
              register={register("freeShippingThreshold", {
                valueAsNumber: true,
              })}
              error={errors.freeShippingThreshold}
              description="Orders above this amount get free shipping (in kobo)"
            />
          )}
        </CardContent>
      </Card>

      {/* Delivery Times */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Delivery Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="estimatedDeliveryDays.min"
              label="Minimum Days"
              type="number"
              placeholder="3"
              register={register("estimatedDeliveryDays.min", {
                valueAsNumber: true,
              })}
              error={errors.estimatedDeliveryDays?.min}
              required
            />

            <FormInput
              id="estimatedDeliveryDays.max"
              label="Maximum Days"
              type="number"
              placeholder="7"
              register={register("estimatedDeliveryDays.max", {
                valueAsNumber: true,
              })}
              error={errors.estimatedDeliveryDays?.max}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || updateSettings.isPending}>
          {updateSettings.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function ShippingSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
