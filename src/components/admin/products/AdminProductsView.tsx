"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const PAGE_SIZE = 10;

type AdminProductsViewProps = {
  products: Product[];
  categories: Category[];
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function quantityLabel(product: Product) {
  const { quantity, inStock } = product.inventory;
  const sizeCount = product.attributes.sizes.length;

  if (!inStock || quantity <= 0) {
    return {
      main: "0",
      sub: sizeCount > 1 ? `${sizeCount} sizes · Out of stock` : "Out of stock",
    };
  }

  if (quantity >= 999) {
    return {
      main: "∞",
      sub: sizeCount > 1 ? `${sizeCount} sizes · In stock` : "In stock",
    };
  }

  return {
    main: String(quantity),
    sub: sizeCount > 1 ? `${sizeCount} sizes` : "In stock",
  };
}

export function AdminProductsView({ products, categories }: AdminProductsViewProps) {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categorySlug !== "all" && product.category_slug !== categorySlug) return false;
      if (!q) return true;
      return (
        product.title.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.brand_or_vendor.toLowerCase().includes(q)
      );
    });
  }, [products, search, categorySlug]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "flex-start" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ADMIN_ACCENT,
            }}
          >
            Catalog
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Product catalog
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
            Manage regular and variable products with pricing, inventory, and images.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          sx={{
            flexShrink: 0,
            bgcolor: ADMIN_ACCENT,
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            "&:hover": { bgcolor: "#185a4a" },
          }}
        >
          Add product
        </Button>
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.06)",
          bgcolor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.06)" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, brand, or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ width: "100%", bgcolor: "#f8fafc" }}
          />

          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setCategorySlug("all");
                setPage(1);
              }}
              sx={{
                borderRadius: 999,
                px: 1.75,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
                border: "1px solid",
                borderColor: categorySlug === "all" ? ADMIN_ACCENT : "rgba(0,0,0,0.1)",
                bgcolor: categorySlug === "all" ? ADMIN_ACCENT : "#fff",
                color: categorySlug === "all" ? "#fff" : "text.primary",
                "&:hover": {
                  bgcolor: categorySlug === "all" ? "#185a4a" : "rgba(31,111,91,0.06)",
                },
              }}
            >
              All
            </Button>
            {categories.map((cat) => {
              const active = categorySlug === cat.slug;
              return (
                <Button
                  key={cat.id}
                  size="small"
                  onClick={() => {
                    setCategorySlug(cat.slug);
                    setPage(1);
                  }}
                  sx={{
                    borderRadius: 999,
                    px: 1.75,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "none",
                    border: "1px solid",
                    borderColor: active ? ADMIN_ACCENT : "rgba(0,0,0,0.1)",
                    bgcolor: active ? ADMIN_ACCENT : "#fff",
                    color: active ? "#fff" : "text.primary",
                    "&:hover": {
                      bgcolor: active ? "#185a4a" : "rgba(31,111,91,0.06)",
                    },
                  }}
                >
                  {cat.title}
                </Button>
              );
            })}
          </Box>
        </Box>

        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ width: "100%", minWidth: 900 }}>
            <TableHead>
              <TableRow>
                {["Image", "Product", "Category", "Price", "Qty", "Actions"].map((h) => (
                  <TableCell
                    key={h}
                    align={h === "Actions" ? "right" : "left"}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                      bgcolor: "#f8fafc",
                      borderBottomColor: "rgba(0,0,0,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">No products match your filters.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pageProducts.map((product) => {
                  const image = product.images[0];
                  const { price, compareAtPrice, discountPercent } = product.pricing;
                  const qty = quantityLabel(product);

                  return (
                    <TableRow key={product.id} hover>
                      <TableCell sx={{ width: 72 }}>
                        <Box
                          sx={{
                            position: "relative",
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            overflow: "hidden",
                            bgcolor: "#f1f5f9",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ minWidth: 220, maxWidth: 360 }}>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            lineHeight: 1.35,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.title}
                        </Typography>
                        <Typography sx={{ mt: 0.35, fontSize: "0.75rem", color: "text.secondary" }}>
                          {product.brand_or_vendor} · /{product.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            borderRadius: 1,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            bgcolor: "#f1f5f9",
                            color: "#475569",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography component="span" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                          {formatBdt(price)}
                        </Typography>
                        {compareAtPrice && compareAtPrice > price ? (
                          <>
                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                textDecoration: "line-through",
                              }}
                            >
                              {formatBdt(compareAtPrice)}
                            </Typography>
                            {discountPercent > 0 ? (
                              <Typography
                                component="span"
                                sx={{
                                  ml: 0.75,
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  color: "#16a34a",
                                }}
                              >
                                -{discountPercent}%
                              </Typography>
                            ) : null}
                          </>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                          {qty.main}
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                          {qty.sub}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" aria-label={`Edit ${product.title}`}>
                            <EditOutlinedIcon sx={{ fontSize: 18, color: ADMIN_ACCENT }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" aria-label={`Delete ${product.title}`}>
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "rgba(0,0,0,0.06)",
            bgcolor: "#fafafa",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            {filtered.length === 0
              ? "Showing 0 of 0"
              : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ textTransform: "none", minWidth: 72 }}
            >
              Previous
            </Button>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
              Page {currentPage} / {totalPages}
            </Typography>
            <Button
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ textTransform: "none", minWidth: 56 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
