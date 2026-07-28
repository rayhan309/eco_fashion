"use client";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { PageHeader } from "@/components/shop/PageHeader";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/formatters/currency";

export function CartPageView() {
  const { cart, updateQuantity, removeItem } = useCart();

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <PageHeader title="Cart" description="Review items in your bag before checkout." />

      {cart.items.length === 0 ? (
        <Stack sx={{ py: 6, alignItems: "center", textAlign: "center" }} spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add products from the shop to see them here.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" sx={{ mt: 1, borderRadius: 1 }}>
            Continue shopping
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Stack divider={<Divider />}>
            {cart.items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.size}-${item.color}`}
                item={item}
                onIncrease={() =>
                  updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                }
                onDecrease={() =>
                  updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                }
                onRemove={() => removeItem(item.productId, item.size, item.color)}
              />
            ))}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Subtotal:{" "}
              <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                {formatCurrency(cart.subtotal, cart.currency)}
              </Box>
            </Typography>
            <Button component={Link} href="/checkout" variant="contained" sx={{ borderRadius: 1 }}>
              Checkout
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
