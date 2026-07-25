import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <h1>Orders</h1>
      <p>Manage orders page.</p>
    </div>
  );
}
