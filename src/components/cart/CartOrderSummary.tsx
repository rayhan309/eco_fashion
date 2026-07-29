"use client";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useMemo } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { formatCurrency } from "@/lib/formatters/currency";
import { estimateDefaultShippingFee } from "@/lib/shipping/calculate";
import type { Cart } from "@/types/cart";

type CartOrderSummaryProps = {
  cart: Cart;
  /** Fixed delivery estimate for cart (checkout may refine by district). */
  deliveryCharge?: number;
  confirmHref?: string;
  confirmLabel?: string;
  onConfirmClick?: () => void;
  showConfirm?: boolean;
  /** Use inside a <form> as the submit control. */
  confirmAsSubmit?: boolean;
  confirmDisabled?: boolean;
};

export function CartOrderSummary({
  cart,
  deliveryCharge,
  confirmHref = "/checkout",
  confirmLabel = "Confirm order",
  onConfirmClick,
  showConfirm = true,
  confirmAsSubmit = false,
  confirmDisabled = false,
}: CartOrderSummaryProps) {
  const settings = useSiteSettings();

  const shipping = useMemo(() => {
    if (typeof deliveryCharge === "number") return deliveryCharge;
    return estimateDefaultShippingFee(settings, cart.subtotal);
  }, [cart.subtotal, deliveryCharge, settings]);

  const amountToPay = cart.subtotal + shipping;
  const showFreeThresholdHint =
    settings.freeDeliveryEnabled &&
    settings.freeDeliveryMinimum > 0 &&
    shipping > 0 &&
    cart.subtotal < settings.freeDeliveryMinimum;

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
      <Stack sx={{ px: 2, py: 0.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", py: 1.5 }}
        >
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography sx={{ fontWeight: 600 }}>
            {formatCurrency(cart.subtotal, cart.currency)}
          </Typography>
        </Stack>

        {cart.savings > 0 ? (
          <>
            <Divider />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", py: 1.5 }}
            >
              <Typography color="text.secondary">You&apos;re saving</Typography>
              <Typography sx={{ fontWeight: 600, color: "#dc2626" }}>
                -{formatCurrency(cart.savings, cart.currency)}
              </Typography>
            </Stack>
          </>
        ) : null}

        <Divider />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", py: 1.5 }}
        >
          <Typography color="text.secondary">Delivery charge</Typography>
          <Typography sx={{ fontWeight: 600 }}>
            {shipping === 0 ? "Free" : formatCurrency(shipping, cart.currency)}
          </Typography>
        </Stack>

        {showFreeThresholdHint ? (
          <Typography variant="caption" color="text.secondary" sx={{ pb: 1.25 }}>
            Free delivery over {formatCurrency(settings.freeDeliveryMinimum, "BDT")}
          </Typography>
        ) : null}
      </Stack>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.75,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(246, 243, 237, 0.65)",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>Amount to pay</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: "1.2rem" }}>
          {formatCurrency(amountToPay, cart.currency)}
        </Typography>
      </Stack>

      {showConfirm ? (
        <Box sx={{ p: 2, pt: 1.5 }}>
          {confirmAsSubmit ? (
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={confirmDisabled}
              onClick={onConfirmClick}
              sx={{
                borderRadius: 1,
                py: 1.35,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              {confirmLabel}
            </Button>
          ) : (
            <Button
              component={Link}
              href={confirmHref}
              variant="contained"
              size="large"
              fullWidth
              onClick={onConfirmClick}
              sx={{
                borderRadius: 1,
                py: 1.35,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              {confirmLabel}
            </Button>
          )}
        </Box>
      ) : null}
    </Box>
  );
}
