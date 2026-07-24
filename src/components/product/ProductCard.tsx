"use client";

import Link from "next/link";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const href = `/shop/${product.category_slug}/${product.slug}`;
  const image = product.images[0];

  return (
    <Card
      component={Link}
      href={href}
      sx={{ textDecoration: "none", color: "inherit", height: "100%" }}
    >
      <Box sx={{ bgcolor: "background.default", aspectRatio: "3 / 4" }}>
        {image ? (
          <CardMedia
            component="img"
            image={image.url}
            alt={image.alt}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </Box>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(product.pricing.price, product.pricing.currency)}
        </Typography>
      </CardContent>
    </Card>
  );
}
