"use client";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useToast } from "@/context/toast/ToastProvider";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { formatCurrency } from "@/lib/formatters/currency";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  findShippingAreaIndex,
  resolveShippingFee,
} from "@/lib/shipping/calculate";
import {
  adminOrderUpdateSchema,
  type AdminOrderUpdateValues,
} from "@/lib/validations/admin-order";
import {
  fetchAdminOrderDetail,
  fetchAdminOrderProductOptions,
  updateAdminOrder,
} from "@/services/admin-order-mutations";
import type { AdminOrderProductOption } from "@/types/admin-order-product";
import {
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STATUSES,
} from "@/types/admin-order";

type AdminOrderEditDialogProps = {
  orderId: string | null;
  onClose: () => void;
};

const emptyValues: AdminOrderUpdateValues = {
  status: "new_order",
  customer: {
    name: "",
    phone: "",
    email: "",
    address: "",
    region: "",
    city: "",
    note: "",
    deliveryArea: "",
  },
  items: [],
  shippingFee: 0,
  discount: 0,
};

function lineSubtotal(price: number, quantity: number, discount: number) {
  return Math.max(0, price * quantity - Math.max(0, discount));
}

function toFormItem(
  item: AdminOrderUpdateValues["items"][number],
): AdminOrderUpdateValues["items"][number] {
  return {
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    price: Number(item.price) || 0,
    discount: Number(item.discount) || 0,
    currency: item.currency === "USD" ? "USD" : "BDT",
    quantity: Math.max(1, Number(item.quantity) || 1),
    size: item.size || "M",
    color: item.color || "Default",
    image: item.image || "",
    compareAtPrice: item.compareAtPrice ?? null,
  };
}

function productToFormItem(
  product: AdminOrderProductOption,
): AdminOrderUpdateValues["items"][number] {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.title,
    price: product.price,
    discount: 0,
    currency: product.currency,
    quantity: 1,
    size: product.sizes[0] ?? "M",
    color: product.colors[0] ?? "Default",
    image: product.image,
    compareAtPrice: product.compareAtPrice,
  };
}

export function AdminOrderEditDialog({ orderId, onClose }: AdminOrderEditDialogProps) {
  const open = Boolean(orderId);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const settings = useSiteSettings();
  const [productToAdd, setProductToAdd] = useState<AdminOrderProductOption | null>(
    null,
  );
  const [productSearch, setProductSearch] = useState("");

  const { data: order, isPending, isError, error } = useQuery({
    queryKey: queryKeys.admin.order(orderId ?? ""),
    queryFn: () => fetchAdminOrderDetail(orderId!),
    enabled: open && Boolean(orderId),
  });

  const { data: productOptions = [], isPending: productsLoading } = useQuery({
    queryKey: queryKeys.admin.orderProductOptions(),
    queryFn: fetchAdminOrderProductOptions,
    enabled: open,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminOrderUpdateValues>({
    defaultValues: emptyValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];
  const watchedShipping = Number(useWatch({ control, name: "shippingFee" }) ?? 0);
  const watchedDiscount = Number(useWatch({ control, name: "discount" }) ?? 0);
  const watchedDeliveryArea =
    useWatch({ control, name: "customer.deliveryArea" }) ?? "";

  useEffect(() => {
    if (!order) return;
    reset({
      status: order.status,
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
      items: order.items.map((item) =>
        toFormItem({
          ...item,
          discount: item.discount ?? 0,
        }),
      ),
      shippingFee: order.shippingFee,
      discount: order.discount ?? 0,
    });
    setProductToAdd(null);
    setProductSearch("");
  }, [order, reset]);

  const itemsSubtotal = useMemo(
    () =>
      watchedItems.reduce(
        (sum, item) =>
          sum +
          lineSubtotal(
            Number(item?.price) || 0,
            Number(item?.quantity) || 0,
            Number(item?.discount) || 0,
          ),
        0,
      ),
    [watchedItems],
  );

  const orderTotal = Math.max(
    0,
    itemsSubtotal + Math.max(0, watchedShipping) - Math.max(0, watchedDiscount),
  );

  const saveMutation = useMutation({
    mutationFn: (values: AdminOrderUpdateValues) => {
      const parsed = adminOrderUpdateSchema.parse(values);
      return updateAdminOrder(orderId!, parsed);
    },
    onSuccess: async () => {
      showToast("Order updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.order(orderId!),
        }),
      ]);
      onClose();
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : "Failed to update order", "error");
    },
  });

  function onSubmit(values: AdminOrderUpdateValues) {
    try {
      const parsed = adminOrderUpdateSchema.parse(values);
      saveMutation.mutate(parsed);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Invalid order data", "error");
    }
  }

  function handleDeliveryAreaChange(areaName: string) {
    setValue("customer.deliveryArea", areaName, { shouldDirty: true });
    const areaIndex = findShippingAreaIndex(settings, areaName);
    const fee = resolveShippingFee(settings, areaIndex, itemsSubtotal);
    setValue("shippingFee", fee, { shouldDirty: true });
  }

  function handleAddProduct() {
    if (!productToAdd) {
      showToast("Select a product to add", "error");
      return;
    }
    append(productToFormItem(productToAdd));
    setProductToAdd(null);
    setProductSearch("");
  }

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return productOptions;
    return productOptions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [productOptions, productSearch]);

  const headerCellSx = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "text.secondary",
    borderBottom: "1px solid",
    borderColor: "divider",
    py: 1,
    px: 1,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saveMutation.isPending && onClose()}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography component="span" sx={{ fontSize: "1.15rem", fontWeight: 700 }}>
          {order ? `Edit Order ${order.orderNumber}` : "Edit order"}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          disabled={saveMutation.isPending}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
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
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2.25, pt: 0.5 }}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel id="order-status-label">Status</InputLabel>
                  <Select
                    {...field}
                    labelId="order-status-label"
                    label="Status"
                  >
                    {ADMIN_ORDER_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {ADMIN_ORDER_STATUS_LABELS[status]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="delivery-method-label">Delivery Method</InputLabel>
              <Select
                labelId="delivery-method-label"
                label="Delivery Method"
                value={
                  settings.shippingAreas.some((a) => a.name === watchedDeliveryArea)
                    ? watchedDeliveryArea
                    : settings.shippingAreas[0]?.name ?? ""
                }
                onChange={(e) => handleDeliveryAreaChange(String(e.target.value))}
              >
                {settings.shippingAreas.map((area) => (
                  <MenuItem key={area.id} value={area.name}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                overflow: "hidden",
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#fafafa" }}>
                      <TableCell sx={headerCellSx}>Image</TableCell>
                      <TableCell sx={headerCellSx}>Name</TableCell>
                      <TableCell sx={headerCellSx}>Color / Size</TableCell>
                      <TableCell sx={headerCellSx} align="center">
                        Qty
                      </TableCell>
                      <TableCell sx={headerCellSx} align="right">
                        Sell Price
                      </TableCell>
                      <TableCell sx={headerCellSx} align="right">
                        Discount
                      </TableCell>
                      <TableCell sx={headerCellSx} align="right">
                        Subtotal
                      </TableCell>
                      <TableCell sx={headerCellSx} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ py: 3, textAlign: "center" }}>
                          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                            No products in this order. Add one below.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      fields.map((field, index) => {
                        const item = watchedItems[index] ?? field;
                        const colorSize =
                          !item.color || item.color === "Default" || item.color === "N/A"
                            ? item.size && item.size !== "M"
                              ? item.size
                              : "N/A"
                            : `${item.color} / ${item.size}`;
                        const sub = lineSubtotal(
                          Number(item.price) || 0,
                          Number(item.quantity) || 0,
                          Number(item.discount) || 0,
                        );
                        return (
                          <TableRow key={field.id} hover>
                            <TableCell sx={{ px: 1, py: 1 }}>
                              <Box
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  bgcolor: "#f1f5f9",
                                }}
                              >
                                {item.image ? (
                                  <Box
                                    component="img"
                                    src={item.image}
                                    alt=""
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : null}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1, minWidth: 160 }}>
                              <Typography
                                sx={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.3 }}
                              >
                                {item.name}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }}>
                              <Typography
                                sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                              >
                                {colorSize}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }} align="center">
                              <TextField
                                type="number"
                                size="small"
                                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                                sx={{ width: 72 }}
                                value={item.quantity}
                                onChange={(e) => {
                                  const quantity = Math.max(
                                    1,
                                    Math.floor(Number(e.target.value) || 1),
                                  );
                                  update(index, { ...toFormItem(item), quantity });
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }} align="right">
                              <TextField
                                type="number"
                                size="small"
                                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                                sx={{ width: 96 }}
                                value={item.price}
                                onChange={(e) => {
                                  const price = Math.max(0, Number(e.target.value) || 0);
                                  update(index, { ...toFormItem(item), price });
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }} align="right">
                              <TextField
                                type="number"
                                size="small"
                                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                                sx={{ width: 88 }}
                                value={item.discount ?? 0}
                                onChange={(e) => {
                                  const discount = Math.max(0, Number(e.target.value) || 0);
                                  update(index, { ...toFormItem(item), discount });
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }} align="right">
                              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                                {formatCurrency(sub, item.currency ?? "BDT")}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ px: 1, py: 1 }} align="center">
                              <IconButton
                                aria-label="Remove product"
                                size="small"
                                onClick={() => remove(index)}
                                sx={{
                                  color: "#fff",
                                  bgcolor: "#dc2626",
                                  borderRadius: 1,
                                  width: 28,
                                  height: 28,
                                  "&:hover": { bgcolor: "#b91c1c" },
                                }}
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.25,
                  alignItems: "center",
                  p: 1.5,
                  bgcolor: "#f8fafc",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Autocomplete
                  size="small"
                  sx={{ flex: "1 1 220px", minWidth: 180 }}
                  loading={productsLoading}
                  options={filteredProducts}
                  value={productToAdd}
                  onChange={(_e, next) => setProductToAdd(next)}
                  inputValue={productSearch}
                  onInputChange={(_e, next) => setProductSearch(next)}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(a, b) => a.id === b.id}
                  getOptionKey={(option) => option.id}
                  filterOptions={(x) => x}
                  renderOption={(props, option) => {
                    const { key: _key, ...optionProps } = props;
                    return (
                      <Box
                        component="li"
                        key={option.id}
                        {...optionProps}
                        sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            overflow: "hidden",
                            bgcolor: "#f1f5f9",
                            flexShrink: 0,
                          }}
                        >
                          {option.image ? (
                            <Box
                              component="img"
                              src={option.image}
                              alt=""
                              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : null}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {option.title}
                          </Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>
                            {formatCurrency(option.price, option.currency)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Search products…" />
                  )}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddProduct}
                  disabled={!productToAdd}
                  sx={{
                    textTransform: "none",
                    bgcolor: ADMIN_ACCENT,
                    flexShrink: 0,
                  }}
                >
                  Add Product
                </Button>
              </Box>
            </Box>

            {errors.items?.message || errors.items?.root?.message ? (
              <Typography color="error" sx={{ fontSize: "0.8rem" }}>
                {errors.items?.message || errors.items?.root?.message}
              </Typography>
            ) : null}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 280px" },
                gap: 2,
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
                  minRows={2}
                  {...register("customer.address")}
                />
                <TextField
                  label="Delivery Area"
                  size="small"
                  fullWidth
                  {...register("customer.deliveryArea")}
                />
                <TextField
                  label="Email"
                  size="small"
                  fullWidth
                  error={Boolean(errors.customer?.email)}
                  helperText={errors.customer?.email?.message}
                  {...register("customer.email")}
                />
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                  <TextField
                    label="City"
                    size="small"
                    fullWidth
                    {...register("customer.city")}
                  />
                  <TextField
                    label="Region"
                    size="small"
                    fullWidth
                    {...register("customer.region")}
                  />
                </Box>
                <TextField
                  label="Customer note"
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  {...register("customer.note")}
                />
              </Box>

              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                    Sub Total
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    {formatCurrency(itemsSubtotal, "BDT")}
                  </Typography>
                </Box>
                <TextField
                  label="Shipping Fee"
                  size="small"
                  type="number"
                  fullWidth
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">৳</InputAdornment>
                      ),
                    },
                  }}
                  {...register("shippingFee", { valueAsNumber: true })}
                />
                <TextField
                  label="Discount"
                  size="small"
                  type="number"
                  fullWidth
                  slotProps={{
                    htmlInput: { min: 0, step: 1 },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">৳</InputAdornment>
                      ),
                    },
                  }}
                  {...register("discount", { valueAsNumber: true })}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    pt: 0.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    {formatCurrency(orderTotal, "BDT")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={saveMutation.isPending}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="admin-order-edit-form"
          variant="contained"
          disabled={saveMutation.isPending || isPending || !order}
          sx={{ textTransform: "none", bgcolor: ADMIN_ACCENT }}
        >
          {saveMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
