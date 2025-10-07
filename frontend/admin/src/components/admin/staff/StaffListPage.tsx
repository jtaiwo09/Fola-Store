// components/admin/staff/StaffListPage.tsx
"use client";

import { useState } from "react";
import { useStaff, useDeleteStaff } from "@/lib/hooks/useStaff";
import { StaffFilters, StaffMember } from "@/lib/api/staff";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Users } from "lucide-react";
import { Pagination } from "@/components/reusables/Pagination";
import StaffTable from "./StaffTable";
import DeleteStaffDialog from "./DeleteStaffDialog";
import StaffDialog from "./StaffDialog";

export default function StaffListPage() {
  const [filters, setFilters] = useState<StaffFilters>({
    page: 1,
    limit: 20,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const { data, isLoading } = useStaff(filters);
  const deleteStaff = useDeleteStaff();

  const handleFilterChange = (key: keyof StaffFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteConfirm = () => {
    if (staffToDelete) {
      deleteStaff.mutate(staffToDelete._id, {
        onSuccess: () => {
          setStaffToDelete(null);
        },
      });
    }
  };

  const staff = data?.data || [];
  const pagination = data?.pagination;

  const adminCount = staff.filter((s) => s.role === "admin").length;
  const staffCount = staff.filter((s) => s.role === "staff").length;
  const activeCount = staff.filter((s) => s.isActive).length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Staff Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage admin and staff accounts
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Staff
              </p>
              <p className="text-2xl font-semibold mt-1">
                {pagination?.total || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
            <p className="text-2xl font-semibold mt-1 text-purple-600">
              {adminCount}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Staff</p>
            <p className="text-2xl font-semibold mt-1 text-blue-600">
              {staffCount}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {activeCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={
              filters.isActive === undefined
                ? "all"
                : filters.isActive
                ? "active"
                : "inactive"
            }
            onValueChange={(value) =>
              handleFilterChange(
                "isActive",
                value === "all" ? undefined : value === "active"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Staff Table */}
      <StaffTable
        staff={staff}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setStaffToDelete}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Staff Dialog */}
      <StaffDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        staff={editingStaff}
      />

      {/* Delete Dialog */}
      <DeleteStaffDialog
        staff={staffToDelete}
        open={!!staffToDelete}
        onOpenChange={(open) => !open && setStaffToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteStaff.isPending}
      />
    </div>
  );
}
