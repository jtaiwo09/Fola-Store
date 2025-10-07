"use client";

import { Check, CreditCard, Lock, MapPin, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutStep = "review" | "shipping" | "billing" | "payment";

interface CheckoutStepIndicatorProps {
  currentStep: CheckoutStep;
}

const STEPS = [
  { key: "review" as const, label: "Review", icon: ShoppingCart },
  { key: "shipping" as const, label: "Shipping", icon: MapPin },
  { key: "billing" as const, label: "Billing", icon: CreditCard },
  { key: "payment" as const, label: "Payment", icon: Lock },
];

export default function CheckoutStepIndicator({
  currentStep,
}: CheckoutStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center mb-8 md:mb-12">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.key === currentStep;
        const isCompleted = currentIndex > idx;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors",
                  isActive &&
                    "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                  isCompleted && "bg-green-500 text-white",
                  !isActive &&
                    !isCompleted &&
                    "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs md:text-sm font-medium",
                  (isActive || isCompleted) && "text-gray-900 dark:text-white",
                  !isActive &&
                    !isCompleted &&
                    "text-gray-500 dark:text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 md:w-24 h-0.5 mt-6 mx-2",
                  isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
