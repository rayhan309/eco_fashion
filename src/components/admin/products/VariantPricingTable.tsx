"use client";

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useWatch, type Control, type FieldErrors } from "react-hook-form";
import type { AddProductFormValues } from "@/lib/validations/product";

type VariantPricingTableProps = {
  control: Control<AddProductFormValues>;
  errors: FieldErrors<AddProductFormValues>;
};

export function VariantPricingTable({ control, errors }: VariantPricingTableProps) {
  const variants = useWatch({ control, name: "variants" }) ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>Per-variant pricing</Typography>
      {variants.map((variant, index) => {
        const rowErrors = errors.variants?.[index];
        return (
          <Box
            key={variant.label || `variant-${index}`}
            sx={{
              p: 2,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "rgba(0,0,0,0.08)",
              bgcolor: "#fff",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 1.5 }}>
              {variant.label}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Controller
                  name={`variants.${index}.regularPrice`}
                  control={control}
                  render={({ field: input }) => (
                    <TextField
                      {...input}
                      label="Regular (৳)"
                      fullWidth
                      required
                      error={Boolean(rowErrors?.regularPrice)}
                      helperText={rowErrors?.regularPrice?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Controller
                  name={`variants.${index}.salePrice`}
                  control={control}
                  render={({ field: input }) => (
                    <TextField
                      {...input}
                      label="Sale (৳)"
                      fullWidth
                      error={Boolean(rowErrors?.salePrice)}
                      helperText={rowErrors?.salePrice?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Controller
                  name={`variants.${index}.stockQuantity`}
                  control={control}
                  render={({ field: input }) => (
                    <TextField
                      {...input}
                      label="Stock"
                      fullWidth
                      error={Boolean(rowErrors?.stockQuantity)}
                      helperText={rowErrors?.stockQuantity?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Controller
                  name={`variants.${index}.stockStatus`}
                  control={control}
                  render={({ field: input }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel id={`variant-status-${index}`}>Status</InputLabel>
                      <Select {...input} labelId={`variant-status-${index}`} label="Status">
                        <MenuItem value="in_stock">In stock</MenuItem>
                        <MenuItem value="out_of_stock">Out of stock</MenuItem>
                        <MenuItem value="on_backorder">On backorder</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}
