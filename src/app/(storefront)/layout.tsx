import type { ReactNode } from "react";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <CartSidebar />
    </>
  );
}
