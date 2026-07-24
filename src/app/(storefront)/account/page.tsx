import { Suspense } from "react";
import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getOrders } from "@/services/orders";
import { getProducts } from "@/services/products";

type AccountPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const [{ tab }, products, orders] = await Promise.all([
    searchParams,
    getProducts(),
    getOrders(),
  ]);

  return (
    <Suspense fallback={<AccountFallback />}>
      <AccountDashboard products={products} orders={orders} initialTab={tab} />
    </Suspense>
  );
}

function AccountFallback() {
  return (
    <div className="rounded-md border border-[rgba(32,49,45,0.08)] bg-white p-6">
      <p className="text-sm text-[#61716a]">Loading account...</p>
    </div>
  );
}
