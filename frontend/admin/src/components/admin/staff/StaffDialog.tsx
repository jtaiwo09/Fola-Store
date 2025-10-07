"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput, FormSelect, FormSwitch } from "@/components/forms";
import { useCreateStaff, useUpdateStaff } from "@/lib/hooks/useStaff";
import { StaffMember } from "@/lib/api/staff";

const staffSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    )
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["admin", "staff"]),
  isActive: z.boolean(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: StaffMember | null;
}

const ROLE_OPTIONS = [
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
];

export default function StaffDialog({
  open,
  onOpenChange,
  staff,
}: StaffDialogProps) {
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      role: "staff",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open && staff) {
      reset({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone || "",
        role: staff.role,
        isActive: staff.isActive || true,
        password: "",
      });
    } else if (open) {
      reset();
    }
  }, [open, staff, reset]);

  const onSubmit = (data: StaffFormData) => {
    // Remove password if empty (for updates)
    const payload = { ...data };
    if (staff && !payload.password) {
      delete payload.password;
    }

    if (staff) {
      updateStaff.mutate(
        { id: staff._id, payload },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createStaff.mutate(payload as any, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {staff
              ? "Update staff member information"
              : "Create a new admin or staff account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              label="First Name"
              placeholder="John"
              register={register("firstName")}
              error={errors.firstName}
              required
            />

            <FormInput
              id="lastName"
              label="Last Name"
              placeholder="Doe"
              register={register("lastName")}
              error={errors.lastName}
              required
            />
          </div>

          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            register={register("email")}
            error={errors.email}
            required
          />

          <FormInput
            id="password"
            label={staff ? "New Password (optional)" : "Password"}
            type="password"
            placeholder={staff ? "Leave empty to keep current" : "••••••••"}
            register={register("password")}
            error={errors.password}
            required={!staff}
            description={
              staff
                ? "Leave empty to keep current password"
                : "Min 8 characters, must include uppercase, lowercase, and number"
            }
          />

          <FormInput
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="+234 800 000 0000"
            register={register("phone")}
            error={errors.phone}
          />

          <FormSelect
            id="role"
            label="Role"
            options={ROLE_OPTIONS}
            value={watch("role")}
            onValueChange={(value) => setValue("role", value as any)}
            error={errors.role}
            required
            description="Admins have full access, staff have limited permissions"
          />

          {staff && (
            <FormSwitch
              id="isActive"
              label="Active Account"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              description="Inactive accounts cannot log in"
            />
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : staff
                ? "Update Staff"
                : "Create Staff"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
