"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ProductAttribute } from "@/data/dummy/product-attributes";
import { ADMIN_ACCENT } from "@/lib/constants/admin";

type AdminProductAttributesViewProps = {
  attributes: ProductAttribute[];
};

export function AdminProductAttributesView({ attributes }: AdminProductAttributesViewProps) {
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
            Product attributes
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
            Create variation types like Size, Weight, Color — used in variable products.
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
          Add attribute
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
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="medium" sx={{ width: "100%", minWidth: 720 }}>
            <TableHead>
              <TableRow>
                {["Name", "Bangla", "Slug", "Placeholder", "Actions"].map((h) => (
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
                      py: 1.75,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {attributes.map((attr) => (
                <TableRow key={attr.id} hover>
                  <TableCell sx={{ fontWeight: 600, fontSize: "0.9rem", py: 2 }}>
                    {attr.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.9rem", py: 2 }}>{attr.nameBn}</TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      component="code"
                      sx={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: "0.85rem",
                        color: "#475569",
                        bgcolor: "#f1f5f9",
                        px: 1,
                        py: 0.35,
                        borderRadius: 0.75,
                      }}
                    >
                      {attr.slug}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.875rem", color: "text.secondary", py: 2 }}>
                    {attr.placeholder}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" aria-label={`Edit ${attr.name}`}>
                        <EditOutlinedIcon sx={{ fontSize: 18, color: "#64748b" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" aria-label={`Delete ${attr.name}`}>
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
