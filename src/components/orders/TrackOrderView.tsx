"use client";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { OrderTrackingCard } from "@/components/orders/OrderTrackingCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { printOrderInvoice } from "@/lib/orders/print-invoice";
import { lookupStoreOrder } from "@/services/store-orders";
import type { StoreOrder } from "@/types/store-order";

export function TrackOrderView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const settings = useSiteSettings();

  const orderParam = searchParams.get("order")?.trim() ?? "";
  const phoneParam = searchParams.get("phone")?.trim() ?? "";

  const [orderNumber, setOrderNumber] = useState(orderParam);
  const [phone, setPhone] = useState(phoneParam);
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Keep inputs in sync when URL search params change.
  useEffect(() => {
    setOrderNumber(orderParam);
    setPhone(phoneParam);
  }, [orderParam, phoneParam]);

  // Auto-track when both `order` and `phone` exist in the URL.
  useEffect(() => {
    if (!orderParam || !phoneParam) {
      setOrder(null);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      setOrder(null);
      try {
        const result = await lookupStoreOrder(orderParam, phoneParam);
        if (!cancelled) setOrder(result);
      } catch (err) {
        if (!cancelled) {
          setOrder(null);
          setError(err instanceof Error ? err.message : "Order not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderParam, phoneParam]);

  function updateSearchParams(nextOrder: string, nextPhone: string) {
    const params = new URLSearchParams();
    const trimmedOrder = nextOrder.trim();
    const trimmedPhone = nextPhone.trim();
    if (trimmedOrder) params.set("order", trimmedOrder);
    if (trimmedPhone) params.set("phone", trimmedPhone);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleTrack(event: FormEvent) {
    event.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Order number and phone are required");
      return;
    }
    updateSearchParams(orderNumber, phone);
  }

  async function handlePrintInvoice() {
    if (!order) return;
    setPrinting(true);
    try {
      printOrderInvoice(order, {
        shopName: settings.shopName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        contactAddress: settings.contactAddress,
      });
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--eco-primary)] uppercase">
          Orders
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#20312d] sm:text-3xl">
          Track your order
        </h1>
        <p className="mt-2 text-sm text-[#61716a]">
          Enter your order number and the phone used at checkout.
        </p>
      </div>

      <Box
        component="form"
        onSubmit={handleTrack}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: { xs: 2, sm: 2.5 },
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Order number"
            name="order"
            placeholder="HU-12345678"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Phone number"
            name="phone"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText="Required to verify the order"
            required
            fullWidth
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<LocalShippingOutlinedIcon />}
            sx={{ alignSelf: { sm: "flex-start" }, borderRadius: 1, fontWeight: 700 }}
          >
            {loading ? "Searching…" : "Track order"}
          </Button>
        </Stack>
      </Box>

      {order ? (
        <Stack spacing={2}>
          <OrderTrackingCard order={order} />
          <Button
            variant="contained"
            startIcon={<PrintRoundedIcon />}
            onClick={handlePrintInvoice}
            disabled={printing}
            sx={{
              borderRadius: 1,
              fontWeight: 700,
              textTransform: "none",
              alignSelf: { sm: "flex-start" },
            }}
          >
            {printing ? "Preparing…" : "Print invoice"}
          </Button>
        </Stack>
      ) : null}
    </div>
  );
}
