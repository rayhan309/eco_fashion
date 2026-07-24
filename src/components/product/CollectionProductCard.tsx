"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QuickViewDialog } from "@/components/product/QuickViewDialog";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatCurrency } from "@/lib/formatters/currency";
import { useCartUI } from "@/providers/CartUIProvider";
import type { Product } from "@/types/product";

type CollectionProductCardProps = {
  product: Product;
  index?: number;
};

const actionBtnClass =
  "flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(32,49,45,0.1)] bg-white text-[#20312d] shadow-sm transition-colors hover:border-[#1f6f5b] hover:bg-[#1f6f5b] hover:text-white sm:h-9 sm:w-9 md:h-10 md:w-10";

const actionIconSx = { fontSize: { xs: 14, sm: 16, md: 18 } };
export function CollectionProductCard({ product, index = 0 }: CollectionProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();
  const { openCart } = useCartUI();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const image = product.images[0];
  const href = `/shop/${product.category_slug}/${product.slug}`;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.title,
      price: product.pricing.price,
      currency: product.pricing.currency,
      size: product.attributes.sizes[1] ?? product.attributes.sizes[0] ?? "M",
      color: product.attributes.colors[0] ?? "Default",
      image: image?.url ?? "",
    });
    openCart();
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
        className="group flex h-full flex-col"
      >
        <div className="relative overflow-hidden rounded-md bg-[#f0ebe3]">
          <Link href={href} className="relative block aspect-[3/4] overflow-hidden">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : null}
          </Link>

          {product.pricing.compareAtPrice ? (
            <span className="absolute top-3 left-3 rounded-md bg-[#1f6f5b] px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              Sale
            </span>
          ) : null}

          <div className="absolute top-2 right-2 z-10 flex translate-y-0 flex-col gap-1.5 opacity-100 transition-all duration-300 ease-out sm:top-3 sm:right-3 sm:gap-2 md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
              className={`${actionBtnClass} ${wishlisted ? "border-[#1f6f5b] text-[#1f6f5b]" : ""}`}
            >
              {wishlisted ? (
                <FavoriteRoundedIcon sx={actionIconSx} />
              ) : (
                <FavoriteBorderRoundedIcon sx={actionIconSx} />
              )}
            </button>

            <button
              type="button"
              aria-label={`Quick view ${product.title}`}
              onClick={() => setQuickViewOpen(true)}
              className={actionBtnClass}
            >
              <VisibilityOutlinedIcon sx={actionIconSx} />
            </button>

            <button
              type="button"
              aria-label={`Add ${product.title} to cart`}
              onClick={handleAddToCart}
              className={actionBtnClass}
            >
              <ShoppingBagOutlinedIcon sx={actionIconSx} />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 md:group-hover:bg-black/10" />
        </div>

        <div className="flex flex-1 flex-col gap-1 pt-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-[#61716a] uppercase">
            {product.brand_or_vendor}
          </p>
          <Link
            href={href}
            className="text-sm font-bold text-[#20312d] transition-colors hover:text-[#1f6f5b] sm:text-base"
          >
            {product.title}
          </Link>
          <div className="mt-auto flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-[#20312d]">
              {formatCurrency(product.pricing.price, product.pricing.currency)}
            </span>
            {product.pricing.compareAtPrice ? (
              <span className="text-xs text-[#61716a] line-through">
                {formatCurrency(product.pricing.compareAtPrice, product.pricing.currency)}
              </span>
            ) : null}
          </div>
        </div>
      </motion.article>

      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAddToCart={() => {
          handleAddToCart();
          setQuickViewOpen(false);
        }}
        onToggleWishlist={() => toggleWishlist(product.id)}
        isWishlisted={wishlisted}
      />
    </>
  );
}
