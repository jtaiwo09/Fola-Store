"use client";

import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Download,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useInventoryReport } from "@/lib/hooks/useReports";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function InventoryReportPage() {
  const { data, isLoading } = useInventoryReport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: data?.summary.totalProducts.toLocaleString() || 0,
      icon: Package,
      color: "text-blue-600 dark:text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Total Stock Value",
      value: `₦${data?.summary.totalValue.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Low Stock Items",
      value: data?.summary.lowStockCount.toLocaleString() || 0,
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Out of Stock",
      value: data?.summary.outOfStockCount.toLocaleString() || 0,
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Inventory Report
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor stock levels and inventory value
          </p>
        </div>

        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-0">
            <CardContent className="p-0">
              <div className={`${stat.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Value by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Value by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.stockValueByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stockValue" fill="#3b82f6" name="Value (₦)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Value by Product Type */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Distribution by Product Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.stockValueByProductType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => String(entry._id)}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="stockValue"
                >
                  {data?.stockValueByProductType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Low Stock Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Stock
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.lowStockProducts
                  .slice(0, 10)
                  .map((product: any, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.category?.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {product.productType}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white text-right">
                        {product.totalStock}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant="secondary"
                          className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        >
                          Low Stock
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Out of Stock Products */}
      {data?.outOfStockProducts && data.outOfStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Out of Stock Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Type
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.outOfStockProducts
                    .slice(0, 10)
                    .map((product: any, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {product.category?.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {product.productType}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
