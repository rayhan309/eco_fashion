"use client";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ProfilePanel } from "@/components/account/ProfilePanel";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CollectionProductCard } from "@/components/product/CollectionProductCard";
import { PageHeader } from "@/components/shop/PageHeader";
import type { Order } from "@/data/dummy/orders";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import {
  ACCOUNT_TAB_LABELS,
  ACCOUNT_TABS,
  resolveAccountTab,
  type AccountTab,
} from "@/lib/constants/account";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Product } from "@/types/product";

type AccountDashboardProps = {
  products: Product[];
  orders: Order[];
  initialTab?: string;
};

const tabIcons: Record<AccountTab, ReactNode> = {
  profile: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />,
  orders: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />,
  wishlist: <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />,
  cart: <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />,
};

export function AccountDashboard({
  products,
  orders,
  initialTab,
}: AccountDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabFromUrl = resolveAccountTab(searchParams.get("tab") ?? initialTab);
  const [tab, setTab] = useState<AccountTab>(tabFromUrl);

  const { cart, updateQuantity, removeItem, itemCount } = useCart();
  const { productIds, count: wishlistCount, toggleWishlist } = useWishlist();

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  function selectTab(nextTab: AccountTab) {
    setTab(nextTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const wishlistProducts = useMemo(
    () => products.filter((product) => productIds.includes(product.id)),
    [products, productIds],
  );

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <PageHeader
        title="Account"
        description="Manage your profile, orders, wishlist, and cart in one place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />

      <Box
        sx={{
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          overflowX: { xs: "auto", sm: "visible" },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: "max-content", sm: "100%" },
            minWidth: "100%",
            flexWrap: { xs: "nowrap", sm: "wrap" },
          }}
        >
          {ACCOUNT_TABS.map((item) => {
            const active = tab === item;
            const badge =
              item === "wishlist"
                ? wishlistCount
                : item === "cart"
                  ? itemCount
                  : item === "orders"
                    ? orders.length
                    : 0;

            return (
              <Button
                key={item}
                type="button"
                onClick={() => selectTab(item)}
                startIcon={tabIcons[item]}
                variant={active ? "contained" : "outlined"}
                color={active ? "primary" : "inherit"}
                sx={{
                  borderRadius: 1,
                  whiteSpace: "nowrap",
                  borderColor: active ? "primary.main" : "divider",
                  color: active ? "primary.contrastText" : "text.primary",
                }}
              >
                {ACCOUNT_TAB_LABELS[item]}
                {badge > 0 ? (
                  <Chip
                    size="small"
                    label={badge}
                    sx={{
                      ml: 1,
                      height: 20,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      bgcolor: active ? "rgba(255,255,255,0.2)" : "rgba(31,111,91,0.1)",
                      color: active ? "common.white" : "primary.main",
                    }}
                  />
                ) : null}
              </Button>
            );
          })}
        </Stack>
      </Box>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          p: { xs: 2, sm: 3 },
        }}
      >
        {tab === "profile" ? <ProfilePanel /> : null}
        {tab === "orders" ? <OrdersPanel orders={orders} /> : null}
        {tab === "wishlist" ? (
          <WishlistPanel
            products={wishlistProducts}
            onRemove={(id) => toggleWishlist(id)}
          />
        ) : null}
        {tab === "cart" ? (
          <CartPanel
            cart={cart}
            onIncrease={(item) =>
              updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
            }
            onDecrease={(item) =>
              updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
            }
            onRemove={(item) => removeItem(item.productId, item.size, item.color)}
          />
        ) : null}
      </Box>
    </Stack>
  );
}

function OrdersPanel({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <EmptyState title="No orders yet" text="When you place an order, it will show up here." />;
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Track recent purchases and delivery status.
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        {orders.map((order) => (
          <Stack
            key={order.id}
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {order.orderNumber}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {order.date} · {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Chip label={order.status} color="primary" size="small" variant="outlined" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {formatCurrency(order.total, order.currency)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function WishlistPanel({
  products,
  onRemove,
}: {
  products: Product[];
  onRemove: (id: string) => void;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        text="Save pieces you like and find them here later."
        actionHref="/shop"
        actionLabel="Browse shop"
      />
    );
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Wishlist
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {products.length} saved items
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
            <Stack spacing={1}>
              <CollectionProductCard product={product} index={index} />
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                size="small"
                onClick={() => onRemove(product.id)}
                sx={{ borderRadius: 1, borderColor: "divider" }}
              >
                Remove
              </Button>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

function CartPanel({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  cart: ReturnType<typeof useCart>["cart"];
  onIncrease: (item: ReturnType<typeof useCart>["cart"]["items"][number]) => void;
  onDecrease: (item: ReturnType<typeof useCart>["cart"]["items"][number]) => void;
  onRemove: (item: ReturnType<typeof useCart>["cart"]["items"][number]) => void;
}) {
  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        text="Add products from the shop to see them here."
        actionHref="/shop"
        actionLabel="Continue shopping"
      />
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Cart
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {cart.items.length} line item{cart.items.length > 1 ? "s" : ""} in your bag
        </Typography>
      </Box>

      <Stack divider={<Divider />}>
        {cart.items.map((item) => (
          <CartItemRow
            key={`${item.productId}-${item.size}-${item.color}`}
            item={item}
            onIncrease={() => onIncrease(item)}
            onDecrease={() => onDecrease(item)}
            onRemove={() => onRemove(item)}
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
        <Button
          component={Link}
          href="/checkout"
          variant="contained"
          sx={{ borderRadius: 1 }}
        >
          Checkout
        </Button>
      </Stack>
    </Stack>
  );
}

function EmptyState({
  title,
  text,
  actionHref,
  actionLabel,
}: {
  title: string;
  text: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Stack sx={{ py: 6, alignItems: "center", textAlign: "center" }} spacing={1}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
      {actionHref && actionLabel ? (
        <Button
          component={Link}
          href={actionHref}
          variant="contained"
          sx={{ mt: 1, borderRadius: 1 }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}
