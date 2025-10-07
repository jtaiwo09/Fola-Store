"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormSwitch } from "@/components/forms";
import { Save, Loader2, CreditCard, Building2, Wallet } from "lucide-react";
import { useSettings, useUpdatePaymentSettings } from "@/lib/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const paymentSettingsSchema = z.object({
  paystack: z.object({
    enabled: z.boolean(),
    publicKey: z.string().optional(),
    secretKey: z.string().optional(),
  }),
  bankTransfer: z.object({
    enabled: z.boolean(),
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
  }),
  cashOnDelivery: z.object({
    enabled: z.boolean(),
  }),
});

type PaymentSettingsFormData = z.infer<typeof paymentSettingsSchema>;

export default function PaymentSettings() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdatePaymentSettings();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<PaymentSettingsFormData>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      paystack: { enabled: false },
      bankTransfer: { enabled: false },
      cashOnDelivery: { enabled: false },
    },
  });

  useEffect(() => {
    if (data?.data.settings) {
      reset(data.data.settings.payment);
    }
  }, [data, reset]);

  const onSubmit = (formData: PaymentSettingsFormData) => {
    updateSettings.mutate(formData);
  };

  const paystackEnabled = watch("paystack.enabled");
  const bankTransferEnabled = watch("bankTransfer.enabled");
  const codEnabled = watch("cashOnDelivery.enabled");

  if (isLoading) {
    return <PaymentSettingsSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Paystack */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Paystack</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Accept card payments via Paystack
                </p>
              </div>
            </div>
            <FormSwitch
              id="paystack.enabled"
              label=""
              checked={paystackEnabled}
              onCheckedChange={(checked) =>
                setValue("paystack.enabled", checked)
              }
            />
          </div>
        </CardHeader>
        {paystackEnabled && (
          <CardContent className="space-y-4">
            <FormInput
              id="paystack.publicKey"
              label="Public Key"
              placeholder="pk_test_..."
              register={register("paystack.publicKey")}
              error={errors.paystack?.publicKey}
              description="Your Paystack public key"
            />

            <FormInput
              id="paystack.secretKey"
              label="Secret Key"
              type="password"
              placeholder="sk_test_..."
              register={register("paystack.secretKey")}
              error={errors.paystack?.secretKey}
              description="Your Paystack secret key (keep this secure)"
            />

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Get your API keys from your{" "}
                <a
                  href="https://dashboard.paystack.com/#/settings/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Paystack Dashboard
                </a>
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bank Transfer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Bank Transfer</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Accept direct bank transfers
                </p>
              </div>
            </div>
            <FormSwitch
              id="bankTransfer.enabled"
              label=""
              checked={bankTransferEnabled}
              onCheckedChange={(checked) =>
                setValue("bankTransfer.enabled", checked)
              }
            />
          </div>
        </CardHeader>
        {bankTransferEnabled && (
          <CardContent className="space-y-4">
            <FormInput
              id="bankTransfer.accountName"
              label="Account Name"
              placeholder="Fola Store Limited"
              register={register("bankTransfer.accountName")}
              error={errors.bankTransfer?.accountName}
            />

            <FormInput
              id="bankTransfer.accountNumber"
              label="Account Number"
              placeholder="0123456789"
              register={register("bankTransfer.accountNumber")}
              error={errors.bankTransfer?.accountNumber}
            />

            <FormInput
              id="bankTransfer.bankName"
              label="Bank Name"
              placeholder="Access Bank"
              register={register("bankTransfer.bankName")}
              error={errors.bankTransfer?.bankName}
            />
          </CardContent>
        )}
      </Card>

      {/* Cash on Delivery */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Cash on Delivery</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Accept cash payments on delivery
                </p>
              </div>
            </div>
            <FormSwitch
              id="cashOnDelivery.enabled"
              label=""
              checked={codEnabled}
              onCheckedChange={(checked) =>
                setValue("cashOnDelivery.enabled", checked)
              }
            />
          </div>
        </CardHeader>
        {codEnabled && (
          <CardContent>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> Cash on delivery can increase order
                cancellations. Consider requiring phone verification for COD
                orders.
              </p>
            </div>
          </CardContent>
        )}
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

function PaymentSettingsSkeleton() {
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
