"use client";

import Link from "next/link";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const href = `/shop/${product.category}/${product.slug}`;
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
            image={image.src}
            alt={image.alt}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </Box>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(product.price, product.currency)}
        </Typography>
      </CardContent>
    </Card>
  );
}
