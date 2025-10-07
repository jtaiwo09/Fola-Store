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
    <div className="flex items-center justify-center mb-8 md:mb-12 w-full gap-2 sm:gap-4">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = step.key === currentStep;
        const isCompleted = currentIndex > idx;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step icon with circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-colors",
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] sm:text-xs md:text-sm font-medium text-center leading-tight",
                  isActive || isCompleted
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 sm:mx-3 h-0.5 w-8 sm:w-12 md:w-16",
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
