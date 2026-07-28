"use client";

import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import type { Product } from "@/types/product";

export type CollectionProductOption = {
  id: string;
  title: string;
  imageUrl: string;
};

type CollectionProductSelectProps = {
  products: Product[];
  value: string[];
  onChange: (productIds: string[]) => void;
  loading?: boolean;
};

export function productToCollectionOption(product: Product): CollectionProductOption {
  return {
    id: product.id,
    title: product.title,
    imageUrl: product.images[0]?.url ?? "",
  };
}

function buildOptions(products: Product[], selectedIds: string[]): CollectionProductOption[] {
  const list = products.map(productToCollectionOption);
  const known = new Set(list.map((item) => item.id));
  for (const id of selectedIds) {
    if (!known.has(id)) {
      list.push({ id, title: `Product ${id}`, imageUrl: "" });
    }
  }
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export function CollectionProductSelect({
  products,
  value,
  onChange,
  loading,
}: CollectionProductSelectProps) {
  const options = buildOptions(products, value);
  const selected = options.filter((option) => value.includes(option.id));

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      loading={loading}
      options={options}
      value={selected}
      onChange={(_event, next) => onChange(next.map((item) => item.id))}
      getOptionLabel={(option) => option.title}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Products in collection"
          placeholder={loading ? "Loading products…" : "Search and select products"}
        />
      )}
      renderOption={(props, option, { selected: checked }) => {
        const { key, ...optionProps } = props;
        return (
          <Box component="li" key={key} {...optionProps} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Checkbox size="small" checked={checked} sx={{ p: 0.5 }} />
            <Box
              sx={{
                position: "relative",
                width: 40,
                height: 40,
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "#f1f5f9",
                flexShrink: 0,
              }}
            >
              {option.imageUrl ? (
                <Image src={option.imageUrl} alt="" fill style={{ objectFit: "cover" }} />
              ) : null}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.3 }}>
                {option.title}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{option.id}</Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
