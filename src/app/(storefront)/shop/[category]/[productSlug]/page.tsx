import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shop/PageHeader";
import { formatCurrency } from "@/lib/formatters/currency";
import { getProductBySlug } from "@/services/products";

type ProductPageProps = {
  params: Promise<{ category: string; productSlug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product || product.category_slug !== categorySlug) {
    notFound();
  }

  const primaryImage = product.images[0];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={product.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop/${product.category_slug}` },
          { label: product.title },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#f0ebe3]">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#61716a] uppercase">
            {product.brand_or_vendor}
          </p>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#20312d] sm:text-3xl">
            {product.title}
          </h2>
          <p className="text-sm leading-relaxed text-[#61716a] sm:text-base">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3">
            <span className="text-xl font-bold text-[#20312d]">
              {formatCurrency(product.pricing.price, product.pricing.currency)}
            </span>
            {product.pricing.compareAtPrice ? (
              <span className="text-sm text-[#61716a] line-through">
                {formatCurrency(product.pricing.compareAtPrice, product.pricing.currency)}
              </span>
            ) : null}
          </div>

          <div className="space-y-1 text-sm text-[#61716a]">
            <p>Sizes: {product.attributes.sizes.join(", ")}</p>
            <p>Colors: {product.attributes.colors.join(", ")}</p>
            <p>
              Rating: {product.ratings.average} ({product.ratings.count} reviews)
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/shop"
              className="rounded-md border border-[rgba(32,49,45,0.12)] px-4 py-2.5 text-sm font-semibold text-[#20312d] transition-colors hover:border-[#1f6f5b] hover:text-[#1f6f5b]"
            >
              Back to shop
            </Link>
            <Link
              href={`/shop/${product.category_slug}`}
              className="rounded-md bg-[#1f6f5b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#185a4a]"
            >
              More {product.category}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
