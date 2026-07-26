import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin";
import { getAdminOverview } from "@/services/admin";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();

  return <AdminOverview data={data} />;
}
