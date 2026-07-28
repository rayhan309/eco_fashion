import type { Metadata } from "next";
import { AdminProductAttributesView } from "@/components/admin";
import { getProductAttributes } from "@/services/product-attributes";

export const metadata: Metadata = {
  title: "Product attributes",
};

export default async function AdminProductAttributesPage() {
  const attributes = await getProductAttributes();
  return <AdminProductAttributesView attributes={attributes} />;
}
