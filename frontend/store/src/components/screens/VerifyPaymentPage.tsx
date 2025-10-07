"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPayment } from "@/lib/hooks/useOrders";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerifyPaymentPageContent() {
  const router = useRouter();
  const routerRef = useRef(router);
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const verifyPayment = useVerifyPayment();

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    if (!reference) {
      routerRef.current.push("/");
      return;
    }

    const verify = async () => {
      try {
        await verifyPayment.mutateAsync({ reference });
        setStatus("success");
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [reference, verifyPayment]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-2">Verifying Payment...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-light mb-4">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your order has been confirmed. You'll receive an email confirmation
            shortly.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/profile/orders">View My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <XCircle className="w-24 h-24 text-red-600 mx-auto mb-6" />
        <h2 className="text-3xl font-light mb-4">Payment Failed</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We couldn't verify your payment. Please try again or contact support.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/cart">Return to Cart</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPaymentPageContent />
    </Suspense>
  );
}
