import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddProductView } from "@/components/admin/products/AddProductView";
import { getAdminProductFormValues } from "@/lib/products/admin-product-record";
import { getCategories } from "@/services/categories";
import { getProductAttributes } from "@/services/product-attributes";

export const metadata: Metadata = {
  title: "Edit product",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [categories, attributes, form] = await Promise.all([
    getCategories(),
    getProductAttributes(),
    getAdminProductFormValues(id),
  ]);

  if (!form) {
    notFound();
  }

  return (
    <AddProductView
      categories={categories}
      attributes={attributes}
      productId={id}
      initialValues={form}
    />
  );
}
