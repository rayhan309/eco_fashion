"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { VariantPricingTable } from "@/components/admin/products/VariantPricingTable";
import type { ProductAttribute } from "@/data/dummy/product-attributes";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import type { AddProductFormValues } from "@/lib/validations/product";

type VariablePricingSectionProps = {
  attributes: ProductAttribute[];
  control: Control<AddProductFormValues>;
  errors: FieldErrors<AddProductFormValues>;
  setValue: UseFormSetValue<AddProductFormValues>;
  variants: AddProductFormValues["variants"];
  variableAttributeId?: string;
  variableOptionsText?: string;
};

function parseOptions(text: string) {
  return text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const defaultVariantRow = {
  label: "",
  regularPrice: "",
  salePrice: "",
  stockQuantity: "",
  stockStatus: "in_stock" as const,
};

export function VariablePricingSection({
  attributes,
  control,
  errors,
  setValue,
  variants,
  variableAttributeId: initialAttributeId,
  variableOptionsText: initialOptionsText,
}: VariablePricingSectionProps) {
  const [attributeId, setAttributeId] = useState(initialAttributeId ?? "");
  const [optionsText, setOptionsText] = useState(initialOptionsText ?? "");
  const variantsRef = useRef(variants);
  variantsRef.current = variants;

  const syncVariants = useCallback(
    (attrId: string, text: string, preserveExisting = true) => {
      const labels = parseOptions(text);

      if (!attrId || labels.length === 0) {
        setValue("variants", [], { shouldValidate: false });
        setValue("variableAttributeId", attrId, { shouldDirty: true });
        setValue("variableOptionsText", text, { shouldDirty: true });
        return;
      }

      const existing = preserveExisting ? (variantsRef.current ?? []) : [];
      const next = labels.map((label) => {
        const row = existing.find((item) => item.label === label);
        return row ?? { ...defaultVariantRow, label };
      });

      setValue("variableAttributeId", attrId, { shouldDirty: true });
      setValue("variableOptionsText", text, { shouldDirty: true });
      setValue("variants", next, { shouldValidate: false, shouldDirty: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (initialAttributeId) setAttributeId(initialAttributeId);
    if (initialOptionsText) {
      setOptionsText(initialOptionsText);
      return;
    }
    if (variants?.length && initialAttributeId) {
      setOptionsText((prev) => prev || variants.map((v) => v.label).join(", "));
    }
  }, [initialAttributeId, initialOptionsText, variants]);

  const selectedAttribute = attributes.find((item) => item.id === attributeId);
  const optionLabels = useMemo(() => parseOptions(optionsText), [optionsText]);
  const readyForPricing = Boolean(attributeId && optionLabels.length > 0);

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "text.secondary",
          }}
        >
          VARIABLE PRICING &amp; INVENTORY
        </Typography>
        <MuiLink
          component={Link}
          href="/dashboard/admin/products/attributes"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.35,
            fontSize: "0.85rem",
            fontWeight: 600,
            color: ADMIN_ACCENT,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Manage attributes
          <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
        </MuiLink>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth required>
            <InputLabel id="variable-attribute-label">Attribute</InputLabel>
            <Select
              labelId="variable-attribute-label"
              label="Attribute"
              value={attributeId}
              disabled={attributes.length === 0}
              onChange={(event) => {
                const nextId = event.target.value;
                const attr = attributes.find((item) => item.id === nextId);
                const nextText = attr?.placeholder ?? "";

                setAttributeId(nextId);
                setOptionsText(nextText);
                syncVariants(nextId, nextText, false);
              }}
            >
              {attributes.length === 0 ? (
                <MenuItem value="" disabled>
                  No attributes — use Manage attributes
                </MenuItem>
              ) : null}
              {attributes.map((attr) => (
                <MenuItem key={attr.id} value={attr.id}>
                  {attr.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Variant options"
            required
            fullWidth
            value={optionsText}
            onChange={(event) => {
              const text = event.target.value;
              setOptionsText(text);
              syncVariants(attributeId, text);
            }}
            helperText="Comma separated values — pricing rows update instantly"
            placeholder={selectedAttribute?.placeholder ?? "S, M, L, XL"}
          />
        </Grid>
      </Grid>

      {!readyForPricing ? (
        <Box
          sx={{
            mt: 2,
            py: 5,
            px: 2,
            borderRadius: 1.5,
            border: "1px dashed",
            borderColor: "rgba(0,0,0,0.12)",
            bgcolor: "#fafafa",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
            Select an attribute and add options to configure per-variant pricing.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <VariantPricingTable
            key={attributeId || "no-attribute"}
            control={control}
            errors={errors}
          />
        </Box>
      )}

      {typeof errors.variants?.message === "string" ? (
        <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "error.main" }}>
          {errors.variants.message}
        </Typography>
      ) : null}
    </Box>
  );
}
