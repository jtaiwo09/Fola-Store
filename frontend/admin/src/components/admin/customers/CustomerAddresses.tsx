// components/admin/customers/CustomerAddresses.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Address } from "@/lib/api/users";

interface CustomerAddressesProps {
  addresses: Address[];
}

export default function CustomerAddresses({
  addresses,
}: CustomerAddressesProps) {
  if (!addresses || addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No addresses saved</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Addresses ({addresses.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.map((address, index) => (
          <div
            key={address._id || index}
            className="p-3 border rounded-lg space-y-1"
          >
            <p className="font-medium text-sm">
              {address.firstName} {address.lastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.country}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {address.phone}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
