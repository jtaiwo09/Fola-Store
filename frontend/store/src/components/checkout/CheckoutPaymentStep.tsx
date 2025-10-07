"use client";

import { CreditCard, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CheckoutPaymentStepProps {
  total: number;
  processing: boolean;
  onBack: () => void;
  onPayment: () => void;
}

export default function CheckoutPaymentStep({
  total,
  processing,
  onBack,
  onPayment,
}: CheckoutPaymentStepProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          Payment Method
        </h2>

        <div className="space-y-6">
          <div className="p-6 border-2 border-green-500 dark:border-green-400 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Pay with Paystack
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure payment via credit card, debit card, or bank transfer
                </p>
              </div>
              <Badge className="bg-green-500 text-white">Recommended</Badge>
            </div>

            <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-lg">
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium mb-1">Your payment is secure</p>
                <p className="text-gray-600 dark:text-gray-400">
                  After clicking "Pay Now", you'll be redirected to Paystack's
                  secure payment page to complete your transaction.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={processing}
            >
              Back
            </Button>
            <Button
              onClick={onPayment}
              disabled={processing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Pay ₦{total.toLocaleString()} Now
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
