"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useToast } from "@/context/toast/ToastProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  adminOrderUpdateSchema,
  calcLineSubtotal,
  calcOrderTotals,
  type AdminOrderLineItemValues,
  type AdminOrderUpdateValues,
} from "@/lib/validations/admin-order";
import {
  fetchAdminOrderDetail,
  updateAdminOrder,
} from "@/services/admin-order-mutations";
import { fetchAdminProductsCatalog } from "@/services/store-queries";
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STATUSES,
} from "@/types/admin-order";
import type { Product } from "@/types/product";
import type { StoreOrder } from "@/types/store-order";

type AdminOrderEditDialogProps = {
  orderId: string | null;
  onClose: () => void;
};

const emptyValues: AdminOrderUpdateValues = {
  status: "new_order",
  deliveryAreaId: "",
  items: [],
  shippingFee: 0,
  orderDiscount: 0,
  customer: {
    name: "",
    phone: "",
    email: "",
    address: "",
    region: "",
    city: "",
    note: "",
  },
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function resolveDeliveryAreaId(deliveryArea: string, areaIds: { id: string; name: string }[]) {
  const match = areaIds.find(
    (area) => area.id === deliveryArea || area.name === deliveryArea,
  );
  return match?.id ?? areaIds[0]?.id ?? "";
}

function orderToFormValues(
  order: StoreOrder,
  shippingAreas: { id: string; name: string }[],
): AdminOrderUpdateValues {
  return {
    status: order.status,
    deliveryAreaId: resolveDeliveryAreaId(order.customer.deliveryArea, shippingAreas),
    items: order.items.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      discount: item.discount ?? 0,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.image,
      compareAtPrice: item.compareAtPrice ?? null,
    })),
    shippingFee: order.shippingFee,
    orderDiscount: order.orderDiscount ?? 0,
    customer: {
      name: order.customer.name,
      phone: order.customer.phone,
      email: order.customer.email,
      address: order.customer.address,
      region: order.customer.region,
      city: order.customer.city,
      note: order.customer.note,
      deliveryArea: order.customer.deliveryArea,
    },
  };
}

function productToLineItem(product: Product): AdminOrderLineItemValues {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.title,
    price: product.pricing.price,
    discount: 0,
    quantity: 1,
    size: product.attributes.sizes[0] ?? "M",
    color: product.attributes.colors[0] ?? "Default",
    image: product.images[0]?.url ?? "",
    compareAtPrice: product.pricing.compareAtPrice,
  };
}

function variantLabel(color: string, size: string) {
  const parts = [];
  if (color && color !== "Default") parts.push(color);
  if (size && size !== "M") parts.push(size);
  return parts.length > 0 ? parts.join(" / ") : "N/A";
}

export function AdminOrderEditDialog({ orderId, onClose }: AdminOrderEditDialogProps) {
  const open = Boolean(orderId);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const settings = useSiteSettings();
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: order, isPending, isError, error } = useQuery({
    queryKey: queryKeys.admin.order(orderId ?? ""),
    queryFn: () => fetchAdminOrderDetail(orderId!),
    enabled: open && Boolean(orderId),
  });

  const { data: catalog, isPending: catalogPending } = useQuery({
    queryKey: queryKeys.admin.productsCatalog(),
    queryFn: fetchAdminProductsCatalog,
    enabled: open,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminOrderUpdateValues>({
    defaultValues: emptyValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];
  const watchedShippingFee = useWatch({ control, name: "shippingFee" }) ?? 0;
  const watchedOrderDiscount = useWatch({ control, name: "orderDiscount" }) ?? 0;

  const totals = useMemo(
    () =>
      calcOrderTotals(
        watchedItems.map((item) => ({
          price: Number(item?.price ?? 0),
          discount: Number(item?.discount ?? 0),
          quantity: Number(item?.quantity ?? 1),
        })),
        Number(watchedShippingFee) || 0,
        Number(watchedOrderDiscount) || 0,
      ),
    [watchedItems, watchedShippingFee, watchedOrderDiscount],
  );

  const productOptions = useMemo(() => {
    const products = catalog?.products ?? [];
    const q = productSearch.trim().toLowerCase();
    const filtered = !q
      ? products
      : products.filter(
          (product) =>
            product.title.toLowerCase().includes(q) ||
            product.slug.toLowerCase().includes(q),
        );

    const seen = new Set<string>();
    return filtered.filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    }).slice(0, 20);
  }, [catalog?.products, productSearch]);

  useEffect(() => {
    if (!order) return;
    reset(orderToFormValues(order, settings.shippingAreas));
  }, [order, reset, settings.shippingAreas]);

  const saveMutation = useMutation({
    mutationFn: (values: AdminOrderUpdateValues) => {
      const parsed = adminOrderUpdateSchema.parse(values);
      return updateAdminOrder(orderId!, parsed);
    },
    onSuccess: async () => {
      showToast("Order updated successfully");
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
      if (orderId) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.admin.order(orderId) });
      }
      onClose();
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "Failed to update order", "error");
    },
  });

  function handleAddProduct() {
    if (!selectedProduct) {
      showToast("Select a product to add", "error");
      return;
    }
    append(productToLineItem(selectedProduct));
    setSelectedProduct(null);
    setProductSearch("");
  }

  return (
    <Dialog
      open={open}
      onClose={() => !saveMutation.isPending && onClose()}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      slotProps={{
        paper: { sx: { borderRadius: 2 } },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pb: 1.5,
        }}
      >
        <Typography component="span" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
          {order ? `Edit Order ${order.orderNumber}` : "Edit order"}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          disabled={saveMutation.isPending}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isError || !order ? (
          <Typography color="error" sx={{ py: 2 }}>
            {error instanceof Error ? error.message : "Failed to load order"}
          </Typography>
        ) : (
          <Box
            component="form"
            id="admin-order-edit-form"
            onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="order-status-label">Status</InputLabel>
                    <Select {...field} labelId="order-status-label" label="Status">
                      {ADMIN_ORDER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {ADMIN_ORDER_STATUS_LABELS[status]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="deliveryAreaId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="order-delivery-label">Delivery Method</InputLabel>
                    <Select {...field} labelId="order-delivery-label" label="Delivery Method">
                      {settings.shippingAreas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                          {area.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            <TableContainer
              sx={{
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.08)",
                borderRadius: 1.5,
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    {[
                      "Image",
                      "Name",
                      "Color / Size",
                      "Qty",
                      "Sell Price",
                      "Discount",
                      "Sub Total",
                      "Action",
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.68rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "text.secondary",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 4, textAlign: "center" }}>
                        <Typography color="text.secondary">No products in this order.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => {
                      const item = watchedItems[index];
                      const lineSubtotal = calcLineSubtotal(
                        Number(item?.price ?? 0),
                        Number(item?.discount ?? 0),
                        Number(item?.quantity ?? 1),
                      );

                      return (
                        <TableRow key={field.id}>
                          <TableCell sx={{ width: 72 }}>
                            <Box
                              sx={{
                                position: "relative",
                                width: 48,
                                height: 48,
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#f1f5f9",
                              }}
                            >
                              {item?.image ? (
                                <Image
                                  src={item.image}
                                  alt=""
                                  fill
                                  sizes="48px"
                                  style={{ objectFit: "cover" }}
                                />
                              ) : null}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ minWidth: 180 }}>
                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                              {item?.name}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap", color: "text.secondary" }}>
                            {variantLabel(item?.color ?? "", item?.size ?? "")}
                          </TableCell>
                          <TableCell sx={{ width: 80 }}>
                            <TextField
                              size="small"
                              type="number"
                              slotProps={{ htmlInput: { min: 1 } }}
                              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                            />
                          </TableCell>
                          <TableCell sx={{ width: 100 }}>
                            <TextField
                              size="small"
                              type="number"
                              slotProps={{ htmlInput: { min: 0 } }}
                              {...register(`items.${index}.price`, { valueAsNumber: true })}
                            />
                          </TableCell>
                          <TableCell sx={{ width: 100 }}>
                            <TextField
                              size="small"
                              type="number"
                              slotProps={{ htmlInput: { min: 0 } }}
                              {...register(`items.${index}.discount`, { valueAsNumber: true })}
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                            {formatBdt(lineSubtotal)}
                          </TableCell>
                          <TableCell sx={{ width: 56 }}>
                            <IconButton
                              size="small"
                              aria-label="Remove item"
                              disabled={fields.length <= 1}
                              onClick={() => remove(index)}
                              sx={{ color: "#dc2626" }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {errors.items?.message ? (
              <Typography sx={{ fontSize: "0.8rem", color: "error.main" }}>
                {errors.items.message}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                gap: 1.5,
                alignItems: { md: "end" },
              }}
            >
              <TextField
                size="small"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                sx={{ bgcolor: "#fff" }}
              />
              <Autocomplete
                size="small"
                options={productOptions}
                loading={catalogPending}
                value={selectedProduct}
                onChange={(_event, value) => setSelectedProduct(value)}
                inputValue={productSearch}
                onInputChange={(_event, value) => setProductSearch(value)}
                getOptionLabel={(option) => option.title}
                getOptionKey={(option) => option.id}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                sx={{ minWidth: { md: 280 } }}
                renderInput={(params) => (
                  <TextField {...params} label="Add product..." placeholder="Select product" />
                )}
              />
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={handleAddProduct}
                sx={{ textTransform: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                Add Product
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
                gap: 2.5,
                alignItems: "start",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <TextField
                  label="Customer Name"
                  size="small"
                  fullWidth
                  error={Boolean(errors.customer?.name)}
                  helperText={errors.customer?.name?.message}
                  {...register("customer.name")}
                />
                <TextField
                  label="Phone"
                  size="small"
                  fullWidth
                  error={Boolean(errors.customer?.phone)}
                  helperText={errors.customer?.phone?.message}
                  {...register("customer.phone")}
                />
                <TextField
                  label="Address"
                  size="small"
                  fullWidth
                  multiline
                  minRows={3}
                  {...register("customer.address")}
                />
                <TextField
                  label="Delivery Area"
                  size="small"
                  fullWidth
                  {...register("customer.deliveryArea")}
                />
              </Box>

              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "rgba(0,0,0,0.08)",
                  borderRadius: 1.5,
                  bgcolor: "#f8fafc",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
                  <Typography sx={{ color: "text.secondary" }}>Sub Total</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{formatBdt(totals.subtotal)}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    py: 0.75,
                  }}
                >
                  <Typography sx={{ color: "text.secondary" }}>Shipping Fee</Typography>
                  <TextField
                    size="small"
                    type="number"
                    slotProps={{ htmlInput: { min: 0 } }}
                    sx={{ width: 120 }}
                    {...register("shippingFee", { valueAsNumber: true })}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    py: 0.75,
                  }}
                >
                  <Typography sx={{ color: "text.secondary" }}>Discount</Typography>
                  <TextField
                    size="small"
                    type="number"
                    slotProps={{ htmlInput: { min: 0 } }}
                    sx={{ width: 120 }}
                    {...register("orderDiscount", { valueAsNumber: true })}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 1.5,
                    mt: 1,
                    borderTop: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.35rem" }}>
                    {formatBdt(totals.total)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={saveMutation.isPending}
          variant="outlined"
          sx={{ textTransform: "none", minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="admin-order-edit-form"
          variant="contained"
          disabled={saveMutation.isPending || isPending || !order}
          sx={{ textTransform: "none", minWidth: 140, bgcolor: ADMIN_ACCENT }}
        >
          {saveMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
