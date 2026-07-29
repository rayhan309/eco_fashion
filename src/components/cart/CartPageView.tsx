"use client";

import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { PageHeader } from "@/components/shop/PageHeader";
import { useCart } from "@/hooks/useCart";

export function CartPageView() {
  const { cart, updateQuantity, removeItem } = useCart();

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <PageHeader
        title="Cart"
        description="Update quantities and review your totals before confirming."
        countLabel={cart.items.length ? `${cart.items.length} items` : undefined}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
      />

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <Stack spacing={2} className="lg:col-span-7">
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

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Typography sx={{ fontWeight: 700, mb: 1.5, fontSize: "1.05rem" }}>
                Order summary
              </Typography>
              <CartOrderSummary cart={cart} confirmLabel="Confirm order" confirmHref="/checkout" />
            </div>
          </div>
        </div>
      )}
    </Stack>
  );
}
