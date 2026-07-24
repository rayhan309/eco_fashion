"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/formatters/currency";
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
            bgcolor: "background.paper",
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
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5 }}>
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
                width: 64,
                height: 64,
                borderRadius: 1,
                bgcolor: "rgba(31, 111, 91, 0.08)",
                display: "grid",
                placeItems: "center",
                mb: 1,
              }}
            >
              <ShoppingBagOutlinedIcon color="primary" />
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
          <Stack divider={<Divider />} sx={{ py: 1 }}>
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
        )}
      </Box>

      {!isEmpty ? (
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            p: 2.5,
            bgcolor: "background.default",
          }}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {formatCurrency(cart.subtotal, cart.currency)}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Shipping and taxes calculated at checkout.
          </Typography>
          <Stack spacing={1.25}>
            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              size="large"
              fullWidth
              onClick={closeCart}
              sx={{ borderRadius: 1 }}
            >
              Checkout
            </Button>
            <Button
              component={Link}
              href="/cart"
              variant="outlined"
              size="large"
              fullWidth
              onClick={closeCart}
              sx={{ borderRadius: 1 }}
            >
              View cart
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Drawer>
  );
}
