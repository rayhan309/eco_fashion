"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Product } from "@/types/product";

type QuickViewDialogProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
};

export function QuickViewDialog({
  product,
  open,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: QuickViewDialogProps) {
  if (!product) return null;

  const image = product.images[0];
  const href = `/shop/${product.category_slug}/${product.slug}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 1, overflow: "hidden", position: "relative" },
        },
      }}
    >
      <IconButton
        aria-label="Close quick view"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          zIndex: 2,
          "&:hover": { bgcolor: "background.paper" },
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[3/4] bg-[#f0ebe3] md:aspect-auto md:min-h-[420px]">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <Stack sx={{ p: { xs: 3, md: 4 }, gap: 2, justifyContent: "center" }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
            >
              {product.brand_or_vendor} · {product.category}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              {product.title}
            </Typography>
            <Typography color="text.secondary">{product.description}</Typography>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCurrency(product.pricing.price, product.pricing.currency)}
              </Typography>
              {product.pricing.compareAtPrice ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {formatCurrency(product.pricing.compareAtPrice, product.pricing.currency)}
                </Typography>
              ) : null}
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Sizes: {product.attributes.sizes.join(", ")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {product.ratings.average} ({product.ratings.count})
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={onAddToCart}
                sx={{ borderRadius: 1 }}
              >
                Add to cart
              </Button>
              <Button
                variant="outlined"
                startIcon={
                  isWishlisted ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />
                }
                onClick={onToggleWishlist}
                sx={{ borderRadius: 1 }}
              >
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
            </Stack>

            <Button
              component={Link}
              href={href}
              onClick={onClose}
              sx={{ borderRadius: 1, alignSelf: "flex-start" }}
            >
              View full details
            </Button>
          </Stack>
        </div>
      </DialogContent>
    </Dialog>
  );
}
