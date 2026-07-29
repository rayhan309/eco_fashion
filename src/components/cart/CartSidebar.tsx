"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { useCart } from "@/hooks/useCart";
import { useCartUI } from "@/providers/CartUIProvider";

export function CartSidebar() {
  const { isCartOpen, closeCart } = useCartUI();
  const { cart, itemCount, updateQuantity, removeItem } = useCart();
  const isEmpty = cart.items.length === 0;

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            maxWidth: "100vw",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Your cart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close cart"
          onClick={closeCart}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
        {isEmpty ? (
          <Stack
            sx={{
              height: "100%",
              minHeight: 280,
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 1.5,
              py: 6,
            }}
          >
            <Box
              sx={{
                width: { xs: 52, sm: 64 },
                height: { xs: 52, sm: 64 },
                borderRadius: 1,
                bgcolor: "rgba(31, 111, 91, 0.08)",
                display: "grid",
                placeItems: "center",
                mb: 1,
              }}
            >
              <ShoppingBagOutlinedIcon color="primary" sx={{ fontSize: { xs: 22, sm: 28 } }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 240 }}>
              Browse the collection and add pieces you like.
            </Typography>
            <Button
              component={Link}
              href="/shop"
              variant="contained"
              onClick={closeCart}
              sx={{ mt: 1, borderRadius: 1 }}
            >
              Continue shopping
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {cart.items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.size}-${item.color}`}
                item={item}
                compact
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
        )}
      </Box>

      {!isEmpty ? (
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 2, bgcolor: "background.paper" }}>
          <CartOrderSummary
            cart={cart}
            confirmLabel="Confirm order"
            confirmHref="/checkout"
            onConfirmClick={closeCart}
          />
          <Button
            component={Link}
            href="/cart"
            variant="text"
            fullWidth
            onClick={closeCart}
            sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}
          >
            View full cart
          </Button>
        </Box>
      ) : null}
    </Drawer>
  );
}
