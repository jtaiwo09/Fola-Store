import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-4 md:p-8">
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new product for your store
          </p>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
