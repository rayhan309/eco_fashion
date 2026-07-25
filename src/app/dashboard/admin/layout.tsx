import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ADMIN_NAV } from "@/lib/constants/admin";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin | Eco Fashion",
  },
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div>
      <header>
        <Link href="/dashboard/admin">Eco Fashion Admin</Link>
      </header>

      <div>
        <aside>
          <nav>
            <ul>
              {ADMIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
