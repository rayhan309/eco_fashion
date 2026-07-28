"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  Controller,
} from "react-hook-form";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import type { AddProductFormValues } from "@/lib/validations/product";

type VariableVariantsEditorProps = {
  control: Control<AddProductFormValues>;
  errors: FieldErrors<AddProductFormValues>;
};

const emptyVariant = {
  label: "",
  regularPrice: "",
  salePrice: "",
  stockQuantity: "",
  stockStatus: "in_stock" as const,
};

export function VariableVariantsEditor({ control, errors }: VariableVariantsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const rootError =
    typeof errors.variants?.message === "string" ? errors.variants.message : undefined;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>Variations</Typography>
        <Button
          type="button"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => append(emptyVariant)}
          sx={{ textTransform: "none", color: ADMIN_ACCENT }}
        >
          Add variation
        </Button>
      </Box>

      {rootError ? (
        <Typography sx={{ mb: 1, fontSize: "0.8rem", color: "error.main" }}>{rootError}</Typography>
      ) : null}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {fields.map((field, index) => {
          const rowErrors = errors.variants?.[index];
          return (
            <Box
              key={field.id}
              sx={{
                p: 2,
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.08)",
                bgcolor: "#fafafa",
              }}
            >
              <Grid container spacing={1.5} sx={{ alignItems: "flex-start" }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Controller
                    name={`variants.${index}.label`}
                    control={control}
                    render={({ field: input }) => (
                      <TextField
                        {...input}
                        label="Label (e.g. S, M, Red)"
                        fullWidth
                        required
                        error={Boolean(rowErrors?.label)}
                        helperText={rowErrors?.label?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
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
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
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
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
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
                <Grid size={{ xs: 6, sm: 3, md: 2 }}>
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
                <Grid size={{ xs: 12, sm: 1 }} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    type="button"
                    aria-label="Remove variation"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 20, color: "#94a3b8" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Box>

      <Typography sx={{ mt: 1.25, fontSize: "0.75rem", color: "text.secondary" }}>
        Catalog price shows the lowest variation price; total stock is the sum of all variations.
      </Typography>
    </Box>
  );
}
