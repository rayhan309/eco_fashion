import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Manage products page.</p>
    </div>
  );
}
