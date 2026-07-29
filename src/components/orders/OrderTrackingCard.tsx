"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Box, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@/lib/formatters/currency";
import {
  ADMIN_ORDER_STATUS_LABELS,
  getTrackStepIndex,
  getTrackSteps,
} from "@/lib/orders/track-steps";
import type { StoreOrder } from "@/types/store-order";

type OrderTrackingCardProps = {
  order: StoreOrder;
};

export function OrderTrackingCard({ order }: OrderTrackingCardProps) {
  const steps = getTrackSteps();
  const activeIndex = getTrackStepIndex(order.status);
  const visibleItems = order.items.slice(0, 4);
  const extraCount = Math.max(0, order.items.length - visibleItems.length);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: "0 1px 2px rgba(32,49,45,0.04)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          gap: 1.5,
          px: { xs: 2, sm: 2.5 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(246,243,237,0.45)",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
            {order.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
          </Typography>
        </Box>
        <Box
          sx={{
            alignSelf: { sm: "flex-start" },
            px: 1.5,
            py: 0.55,
            borderRadius: 999,
            bgcolor: "var(--eco-primary-soft)",
            color: "var(--eco-primary-dark)",
            fontSize: "0.78rem",
            fontWeight: 700,
            border: "1px solid var(--eco-primary-border)",
          }}
        >
          {ADMIN_ORDER_STATUS_LABELS[order.status]}
        </Box>
      </Stack>

      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography
          sx={{
            mb: 1.5,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          Products
        </Typography>
        <Stack spacing={1.25}>
          {visibleItems.map((item) => (
            <Stack
              key={`${item.productId}-${item.size}-${item.color}`}
              direction="row"
              spacing={1.25}
              sx={{ alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 56,
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
                    alt=""
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}
                >
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.size} · {item.color} · Qty {item.quantity}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                {formatCurrency(item.price * item.quantity, item.currency)}
              </Typography>
            </Stack>
          ))}
          {extraCount > 0 ? (
            <Typography variant="caption" color="text.secondary">
              +{extraCount} more {extraCount === 1 ? "item" : "items"}
            </Typography>
          ) : null}
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2.5 }}>
        <Typography
          sx={{
            mb: 2,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          Order progress
        </Typography>

        {activeIndex < 0 ? (
          <Box
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 1,
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            This order is marked as {ADMIN_ORDER_STATUS_LABELS[order.status]}. Contact
            support if you need help.
          </Box>
        ) : (
          <Stack spacing={0}>
            {steps.map((step, index) => {
              const completed = index < activeIndex;
              const current = index === activeIndex;
              const upcoming = index > activeIndex;
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <Stack key={step.status} direction="row" spacing={1.75}>
                  <Stack sx={{ alignItems: "center", width: 36, flexShrink: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        border: "2px solid",
                        borderColor: upcoming
                          ? "divider"
                          : "var(--eco-primary)",
                        bgcolor: completed
                          ? "var(--eco-primary)"
                          : current
                            ? "var(--eco-primary-soft)"
                            : "background.paper",
                        color: completed
                          ? "#fff"
                          : current
                            ? "var(--eco-primary)"
                            : "text.disabled",
                        transition: "all 0.2s ease",
                        boxShadow: current
                          ? "0 0 0 4px var(--eco-primary-soft)"
                          : "none",
                      }}
                    >
                      {completed ? (
                        <CheckRoundedIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <Icon sx={{ fontSize: 18 }} />
                      )}
                    </Box>
                    {!isLast ? (
                      <Box
                        sx={{
                          width: 2,
                          flex: 1,
                          minHeight: 28,
                          my: 0.6,
                          borderRadius: 1,
                          bgcolor: completed ? "var(--eco-primary)" : "divider",
                        }}
                      />
                    ) : null}
                  </Stack>

                  <Box sx={{ pb: isLast ? 0 : 2.25, pt: 0.35, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: current || completed ? 700 : 500,
                        fontSize: "0.92rem",
                        color: upcoming ? "text.secondary" : "text.primary",
                      }}
                    >
                      {step.label}
                      {current ? (
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            px: 0.75,
                            py: 0.15,
                            borderRadius: 0.75,
                            bgcolor: "var(--eco-primary-soft)",
                            color: "var(--eco-primary-dark)",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            verticalAlign: "middle",
                          }}
                        >
                          Current
                        </Box>
                      ) : null}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.35,
                        color: "text.secondary",
                        fontSize: "0.8rem",
                        lineHeight: 1.45,
                        maxWidth: 420,
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(246,243,237,0.55)",
        }}
      >
        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
          Amount
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
          {formatCurrency(order.total, order.currency)}
        </Typography>
      </Stack>
    </Box>
  );
}
