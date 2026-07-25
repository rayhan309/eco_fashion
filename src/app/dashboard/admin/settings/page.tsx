import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <p>Admin settings page.</p>
    </div>
  );
}
