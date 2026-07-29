import type { ReactNode } from "react";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Container } from "@/components/container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WishlistSidebar } from "@/components/wishlist/WishlistSidebar";
import { getProducts } from "@/services/products";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default async function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Container className="flex flex-1 flex-col py-6 md:py-10">{children}</Container>
      </main>
      <Footer />
      <CartSidebar />
      <WishlistSidebar products={products} />
    </>
  );
}
