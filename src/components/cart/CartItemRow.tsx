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
  /** denser layout for drawer */
  compact?: boolean;
};

function discountPercent(price: number, compareAt: number) {
  if (compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

export function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  compact = false,
}: CartItemRowProps) {
  const compare = item.compareAtPrice ?? null;
  const hasDiscount = compare != null && compare > item.price;
  const pct = hasDiscount ? discountPercent(item.price, compare) : 0;
  const lineTotal = item.price * item.quantity;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ p: compact ? 1.5 : 2 }}>
        <Box
          sx={{
            width: compact ? 72 : 88,
            height: compact ? 72 : 88,
            flexShrink: 0,
            borderRadius: 1,
            overflow: "hidden",
            bgcolor: "#f0ebe3",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {item.image ? (
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </Box>

        <Stack sx={{ flex: 1, minWidth: 0, gap: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: compact ? "0.875rem" : "0.95rem",
                  lineHeight: 1.35,
                  color: "text.primary",
                }}
              >
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                {item.size} · {item.color}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.75, flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  {formatCurrency(item.price, item.currency)}
                </Typography>
                {hasDiscount ? (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {formatCurrency(compare, item.currency)}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        px: 0.75,
                        py: 0.15,
                        borderRadius: 0.75,
                        bgcolor: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      -{pct}%
                    </Box>
                  </>
                ) : null}
              </Stack>
            </Box>

            <IconButton
              aria-label={`Remove ${item.name}`}
              size="small"
              onClick={onRemove}
              sx={{
                color: "#dc2626",
                borderRadius: 1,
                p: 0.5,
                "&:hover": { bgcolor: "rgba(220,38,38,0.08)" },
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "text.secondary",
                display: "block",
                mb: 0.75,
              }}
            >
              QUANTITY
            </Typography>
            <Stack
              direction="row"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "background.default",
              }}
            >
              <IconButton
                aria-label="Decrease quantity"
                size="small"
                onClick={onDecrease}
                disabled={item.quantity <= 1}
                sx={{ borderRadius: 0, width: 36, height: 36 }}
              >
                <RemoveRoundedIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  minWidth: 40,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                aria-label="Increase quantity"
                size="small"
                onClick={onIncrease}
                sx={{ borderRadius: 0, width: 36, height: 36 }}
              >
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: compact ? 1.5 : 2,
          py: 1.25,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(246, 243, 237, 0.55)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {item.quantity} × {formatCurrency(item.price, item.currency)}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Total {formatCurrency(lineTotal, item.currency)}
        </Typography>
      </Stack>
    </Box>
  );
}
