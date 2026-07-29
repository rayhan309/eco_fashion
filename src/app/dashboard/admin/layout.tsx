import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Hidden Urban",
  },
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
