import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

export default function AdminOverviewPage() {
  return (
    <div>
      <h1>Overview</h1>
      <p>Admin dashboard overview page.</p>
    </div>
  );
}
