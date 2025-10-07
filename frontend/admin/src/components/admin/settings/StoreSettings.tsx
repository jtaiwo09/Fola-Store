"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea } from "@/components/forms";
import { Save, Loader2 } from "lucide-react";
import { useSettings, useUpdateStoreSettings } from "@/lib/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const storeSettingsSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  logo: z.string().url().optional().or(z.literal("")),
  currency: z.string(),
  timezone: z.string(),
  language: z.string(),
});

type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;

export default function StoreSettings() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateStoreSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      currency: "NGN",
      timezone: "Africa/Lagos",
      language: "en",
    },
  });

  useEffect(() => {
    if (data?.data.settings) {
      reset(data.data.settings.store);
    }
  }, [data, reset]);

  const onSubmit = (formData: StoreSettingsFormData) => {
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return <StoreSettingsSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="name"
            label="Store Name"
            placeholder="Fola Store"
            register={register("name")}
            error={errors.name}
            required
          />

          <FormTextarea
            id="description"
            label="Store Description"
            placeholder="Brief description of your store"
            register={register("description")}
            error={errors.description}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="email"
              label="Contact Email"
              type="email"
              placeholder="info@folastore.com"
              register={register("email")}
              error={errors.email}
              required
            />

            <FormInput
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+234 800 000 0000"
              register={register("phone")}
              error={errors.phone}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Store Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="address.street"
            label="Street Address"
            placeholder="123 Main Street"
            register={register("address.street")}
            error={errors.address?.street}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="address.city"
              label="City"
              placeholder="Lagos"
              register={register("address.city")}
              error={errors.address?.city}
            />

            <FormInput
              id="address.state"
              label="State"
              placeholder="Lagos"
              register={register("address.state")}
              error={errors.address?.state}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="address.postalCode"
              label="Postal Code"
              placeholder="100001"
              register={register("address.postalCode")}
              error={errors.address?.postalCode}
            />

            <FormInput
              id="address.country"
              label="Country"
              placeholder="Nigeria"
              register={register("address.country")}
              error={errors.address?.country}
            />
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormInput
            id="logo"
            label="Logo URL"
            placeholder="https://example.com/logo.png"
            register={register("logo")}
            error={errors.logo}
            description="URL to your store logo"
          />
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle>Localization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormInput
              id="currency"
              label="Currency"
              placeholder="NGN"
              register={register("currency")}
              error={errors.currency}
            />

            <FormInput
              id="timezone"
              label="Timezone"
              placeholder="Africa/Lagos"
              register={register("timezone")}
              error={errors.timezone}
            />

            <FormInput
              id="language"
              label="Language"
              placeholder="en"
              register={register("language")}
              error={errors.language}
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

function StoreSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
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
