"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { printOrderInvoice } from "@/lib/orders/print-invoice";
import { lookupStoreOrder } from "@/services/store-orders";

export function CheckoutSuccessView() {
  const params = useSearchParams();
  const settings = useSiteSettings();
  const orderNumber = params.get("order");
  const phone = params.get("phone");
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const trackHref = orderNumber
    ? `/track-order?${new URLSearchParams({
        order: orderNumber,
        ...(phone ? { phone } : {}),
      }).toString()}`
    : "/track-order";

  async function handlePrintInvoice() {
    if (!orderNumber) return;
    setPrintError(null);
    setPrinting(true);
    try {
      const order = await lookupStoreOrder(orderNumber);
      printOrderInvoice(order, {
        shopName: settings.shopName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
      });
    } catch (error) {
      setPrintError(error instanceof Error ? error.message : "Could not print invoice");
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-10 text-center md:py-14">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--eco-primary-soft)] text-[var(--eco-primary)]">
        <CheckCircleRoundedIcon sx={{ fontSize: 44 }} />
      </div>

      <p className="mt-5 text-xs font-bold tracking-[0.16em] text-[var(--eco-primary)] uppercase">
        Order confirmed
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
        Thank you for your order
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#61716a] sm:text-base">
        We&apos;ve received your order at {settings.shopName}. Pay with cash on delivery when
        it arrives.
      </p>

      {orderNumber ? (
        <Box
          sx={{
            mt: 4,
            width: "100%",
            maxWidth: 420,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            px: 2.5,
            py: 2,
            bgcolor: "background.paper",
            textAlign: "left",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
          >
            ORDER NUMBER
          </Typography>
          <Typography
            sx={{ mt: 0.5, fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}
          >
            {orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Save this number to track your order or print the invoice.
          </Typography>
        </Box>
      ) : null}

      {printError ? (
        <Alert severity="error" sx={{ mt: 2, width: "100%", maxWidth: 420, borderRadius: 1 }}>
          {printError}
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        sx={{ mt: 4, width: "100%", maxWidth: 520, justifyContent: "center" }}
      >
        {orderNumber ? (
          <>
            <Button
              component={Link}
              href={trackHref}
              variant="contained"
              size="large"
              startIcon={<LocalShippingOutlinedIcon />}
              sx={{ borderRadius: 1, fontWeight: 700, textTransform: "none", flex: 1 }}
            >
              Track order
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PrintRoundedIcon />}
              onClick={handlePrintInvoice}
              disabled={printing}
              sx={{ borderRadius: 1, fontWeight: 700, textTransform: "none", flex: 1 }}
            >
              {printing ? "Preparing…" : "Print invoice"}
            </Button>
          </>
        ) : null}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 1.5 }}>
        <Button
          component={Link}
          href="/shop"
          startIcon={<StorefrontOutlinedIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Continue shopping
        </Button>
        <Button
          component={Link}
          href="/"
          sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}
        >
          Back to home
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 6,
          width: "100%",
          maxWidth: 520,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
          gap: 1.5,
          textAlign: "center",
        }}
      >
        {[
          { title: "Cash on delivery", text: "Pay when you receive the parcel" },
          { title: "Order updates", text: "Track status anytime with your order no." },
          { title: "Need help?", text: settings.contactPhone || settings.contactEmail },
        ].map((item) => (
          <Box
            key={item.title}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1.5,
              py: 1.75,
              bgcolor: "rgba(246,243,237,0.5)",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{item.title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  );
}
