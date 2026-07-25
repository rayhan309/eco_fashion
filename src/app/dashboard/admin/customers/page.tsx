import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return (
    <div>
      <h1>Customers</h1>
      <p>Manage customers page.</p>
    </div>
  );
}
