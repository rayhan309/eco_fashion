"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@/lib/formatters/currency";
import type { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 1.5 }}>
      <Box
        sx={{
          width: 84,
          height: 104,
          flexShrink: 0,
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "rgba(31, 111, 91, 0.08)",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {item.image ? (
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ px: 1, textAlign: "center" }}>
            {item.name.slice(0, 1)}
          </Typography>
        )}
      </Box>

      <Stack sx={{ flex: 1, minWidth: 0, gap: 0.75 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.size} · {item.color}
            </Typography>
          </Box>
          <IconButton
            aria-label={`Remove ${item.name}`}
            size="small"
            onClick={onRemove}
            sx={{ borderRadius: 1, alignSelf: "flex-start" }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <IconButton
              aria-label="Decrease quantity"
              size="small"
              onClick={onDecrease}
              sx={{ borderRadius: 0, width: 32, height: 32 }}
            >
              <RemoveRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                width: 28,
                textAlign: "center",
                fontWeight: 600,
                userSelect: "none",
              }}
            >
              {item.quantity}
            </Typography>
            <IconButton
              aria-label="Increase quantity"
              size="small"
              onClick={onIncrease}
              sx={{ borderRadius: 0, width: 32, height: 32 }}
            >
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>

          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {formatCurrency(item.price * item.quantity, item.currency)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
