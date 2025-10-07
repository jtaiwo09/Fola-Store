"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cartStore";
import { useCreateOrder, useInitializePayment } from "@/lib/hooks/useOrders";
import { Breadcrumb } from "@/components/reusables/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CheckoutStepIndicator, {
  CheckoutStep,
} from "@/components/checkout/CheckoutStepIndicator";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import CheckoutReviewStep from "@/components/checkout/CheckoutReviewStep";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";
import AddressForm, {
  AddressFormData,
} from "@/components/checkout/AddressForm";

const INITIAL_ADDRESS: AddressFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
};

const SHIPPING_COST = 1500;

export const CheckoutPage = () => {
  const router = useRouter();
  const { items, clearCart, getTotal } = useCartStore();
  const createOrder = useCreateOrder();
  const initializePayment = useInitializePayment();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("review");
  const [processing, setProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(INITIAL_ADDRESS);
  const [billingInfo, setBillingInfo] = useState(INITIAL_ADDRESS);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getTotal();
  const total = subtotal + SHIPPING_COST;

  const handlePayment = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product._id,
          variant: {
            sku: item.variant.sku,
            color: item.variant.color,
            colorHex: item.variant.colorHex,
          },
          quantity: item.quantity,
        })),
        shippingAddress: shippingInfo,
        billingAddress: sameAsShipping ? shippingInfo : billingInfo,
        paymentReference: `temp-${Date.now()}`,
      };

      const orderResponse = await createOrder.mutateAsync(orderPayload);
      const paymentResponse = await initializePayment.mutateAsync(
        orderResponse.data.order._id
      );

      clearCart();
      window.location.href = paymentResponse.data.authorizationUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to process order");
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Home", onClick: () => router.push("/") },
              { label: "Cart", onClick: () => router.push("/cart") },
              { label: "Checkout", onClick: () => {} },
            ]}
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-8 text-center">
          Checkout
        </h1>

        <CheckoutStepIndicator currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "review" && (
              <CheckoutReviewStep
                items={items}
                onContinue={() => setCurrentStep("shipping")}
              />
            )}

            {currentStep === "shipping" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700 p-0">
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                    Shipping Information
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCurrentStep("billing");
                    }}
                    className="space-y-6"
                  >
                    <AddressForm
                      data={shippingInfo}
                      onChange={setShippingInfo}
                      includeContact
                    />
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("review")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue to Billing
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === "billing" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                    Billing Information
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCurrentStep("payment");
                    }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => {
                          setSameAsShipping(checked as boolean);
                          if (checked) setBillingInfo(shippingInfo);
                        }}
                      />
                      <Label
                        htmlFor="sameAsShipping"
                        className="cursor-pointer"
                      >
                        Same as shipping address
                      </Label>
                    </div>

                    {!sameAsShipping && (
                      <AddressForm
                        data={billingInfo}
                        onChange={setBillingInfo}
                        includeContact={false}
                        idPrefix="bill-"
                      />
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep("shipping")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Continue to Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {currentStep === "payment" && (
              <CheckoutPaymentStep
                total={total}
                processing={processing}
                onBack={() => setCurrentStep("billing")}
                onPayment={handlePayment}
              />
            )}
          </div>

          {/* Order Summary */}
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            shipping={SHIPPING_COST}
            total={total}
            shippingInfo={shippingInfo}
            showShippingAddress={currentStep !== "review"}
          />
        </div>
      </div>
    </div>
  );
};
