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
  "flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(32,49,45,0.1)] bg-white text-[#20312d] shadow-sm transition-colors hover:border-[#1f6f5b] hover:bg-[#1f6f5b] hover:text-white";

export function CollectionProductCard({ product, index = 0 }: CollectionProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addItem } = useCart();
  const { openCart } = useCartUI();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const image = product.images[0];
  const href = `/shop/${product.category}/${product.slug}`;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      size: product.sizes[1] ?? product.sizes[0] ?? "M",
      color: product.colors[0] ?? "Default",
      image: image?.src ?? "",
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
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : null}
          </Link>

          {product.compareAtPrice ? (
            <span className="absolute top-3 left-3 rounded-md bg-[#1f6f5b] px-2 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              Sale
            </span>
          ) : null}

          {/* Mobile: always visible. Desktop: reveal on hover */}
          <div
            className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-100 translate-y-0 transition-all duration-300 ease-out md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100"
          >
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => toggleWishlist(product.id)}
              className={`${actionBtnClass} ${wishlisted ? "border-[#1f6f5b] text-[#1f6f5b]" : ""}`}
            >
              {wishlisted ? (
                <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </button>

            <button
              type="button"
              aria-label={`Quick view ${product.name}`}
              onClick={() => setQuickViewOpen(true)}
              className={actionBtnClass}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            </button>

            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={handleAddToCart}
              className={actionBtnClass}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 md:group-hover:bg-black/10" />
        </div>

        <div className="flex flex-1 flex-col gap-1 pt-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-[#61716a] uppercase">
            {product.category.replace(/-/g, " ")}
          </p>
          <Link
            href={href}
            className="text-sm font-bold text-[#20312d] transition-colors hover:text-[#1f6f5b] sm:text-base"
          >
            {product.name}
          </Link>
          <div className="mt-auto flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-[#20312d]">
              {formatCurrency(product.price, product.currency)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs text-[#61716a] line-through">
                {formatCurrency(product.compareAtPrice, product.currency)}
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
