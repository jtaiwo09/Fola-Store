"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AddressFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFormProps {
  data: AddressFormData;
  onChange: (data: AddressFormData) => void;
  includeContact?: boolean;
  idPrefix?: string;
}

export default function AddressForm({
  data,
  onChange,
  includeContact = true,
  idPrefix = "",
}: AddressFormProps) {
  const updateField = (field: keyof AddressFormData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${idPrefix}firstName`}>First Name *</Label>
          <Input
            id={`${idPrefix}firstName`}
            required
            value={data.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}lastName`}>Last Name *</Label>
          <Input
            id={`${idPrefix}lastName`}
            required
            value={data.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      {includeContact && (
        <>
          <div>
            <Label htmlFor={`${idPrefix}email`}>Email *</Label>
            <Input
              id={`${idPrefix}email`}
              type="email"
              required
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor={`${idPrefix}phone`}>Phone *</Label>
            <Input
              id={`${idPrefix}phone`}
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor={`${idPrefix}address`}>Street Address *</Label>
        <Input
          id={`${idPrefix}address`}
          required
          value={data.address}
          onChange={(e) => updateField("address", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${idPrefix}city`}>City *</Label>
          <Input
            id={`${idPrefix}city`}
            required
            value={data.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}state`}>State *</Label>
          <Input
            id={`${idPrefix}state`}
            required
            value={data.state}
            onChange={(e) => updateField("state", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${idPrefix}postalCode`}>Postal Code *</Label>
          <Input
            id={`${idPrefix}postalCode`}
            required
            value={data.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}country`}>Country *</Label>
          <Input
            id={`${idPrefix}country`}
            required
            value={data.country}
            onChange={(e) => updateField("country", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
}
