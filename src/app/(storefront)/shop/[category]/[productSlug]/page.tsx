import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getProductBySlug, getRelatedProducts } from "@/services/products";

type ProductPageProps = {
  params: Promise<{ category: string; productSlug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return { title: "Product" };

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].url, alt: product.images[0].alt }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product || product.category_slug !== categorySlug) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
