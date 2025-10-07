"use client";

import { use } from "react";
import { useUser } from "@/lib/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import CustomerOrders from "@/components/admin/customers/CustomerOrders";
import CustomerAddresses from "@/components/admin/customers/CustomerAddresses";

interface CustomerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useUser(id);

  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  if (!data?.data.user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Customer not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const user = data.data.user;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Customer Details
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          {user.isActive ? (
            <Button variant="destructive">
              <Ban className="w-4 h-4 mr-2" />
              Deactivate
            </Button>
          ) : (
            <Button>
              <CheckCircle className="w-4 h-4 mr-2" />
              Activate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center pb-4 border-b">
                <Avatar className="w-24 h-24 mb-3">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                  )}
                  <AvatarFallback className="text-2xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={
                      user.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {user.isEmailVerified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user.email}
                  </span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.phone}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Joined {formatDate(user.createdAt, "MMM DD, YYYY")}
                    </p>
                    {user.lastLogin && (
                      <p className="text-xs text-gray-500">
                        Last login: {formatDate(user.lastLogin, "MMM DD, YYYY")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CustomerAddresses addresses={user.addresses} />
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <CustomerOrders customerId={user._id} />
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Skeleton className="h-10 w-96" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
