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
    <Stack direction="row" spacing={{ xs: 1.25, sm: 1.5 }} sx={{ py: { xs: 1.25, sm: 1.5 } }}>
      <Box
        sx={{
          width: { xs: 72, sm: 84 },
          height: { xs: 90, sm: 104 },
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
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              noWrap
            >
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
            sx={{
              borderRadius: 1,
              alignSelf: "flex-start",
              width: { xs: 28, sm: 34 },
              height: { xs: 28, sm: 34 },
              p: 0.5,
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />
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
              sx={{
                borderRadius: 0,
                width: { xs: 26, sm: 32 },
                height: { xs: 26, sm: 32 },
              }}
            >
              <RemoveRoundedIcon sx={{ fontSize: { xs: 13, sm: 16 } }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                width: { xs: 22, sm: 28 },
                textAlign: "center",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                userSelect: "none",
              }}
            >
              {item.quantity}
            </Typography>
            <IconButton
              aria-label="Increase quantity"
              size="small"
              onClick={onIncrease}
              sx={{
                borderRadius: 0,
                width: { xs: 26, sm: 32 },
                height: { xs: 26, sm: 32 },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: { xs: 13, sm: 16 } }} />
            </IconButton>
          </Stack>

          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            {formatCurrency(item.price * item.quantity, item.currency)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
