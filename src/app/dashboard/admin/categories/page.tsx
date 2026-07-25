import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1>Categories</h1>
      <p>Manage categories page.</p>
    </div>
  );
}
