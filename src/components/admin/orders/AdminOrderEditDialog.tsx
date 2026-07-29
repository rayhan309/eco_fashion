"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/context/toast/ToastProvider";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  adminOrderUpdateSchema,
  type AdminOrderUpdateValues,
} from "@/lib/validations/admin-order";
import {
  fetchAdminOrderDetail,
  updateAdminOrder,
} from "@/services/admin-order-mutations";
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
  },
};

export function AdminOrderEditDialog({ orderId, onClose }: AdminOrderEditDialogProps) {
  const open = Boolean(orderId);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: order, isPending, isError, error } = useQuery({
    queryKey: queryKeys.admin.order(orderId ?? ""),
    queryFn: () => fetchAdminOrderDetail(orderId!),
    enabled: open && Boolean(orderId),
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
      },
    });
  }, [order, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: AdminOrderUpdateValues) => {
      const parsed = adminOrderUpdateSchema.parse(values);
      return updateAdminOrder(orderId!, parsed);
    },
    onSuccess: async () => {
      showToast("Order updated successfully");
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders() });
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

  return (
    <Dialog
      open={open}
      onClose={() => !saveMutation.isPending && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pb: 1 }}>
        {order ? `Edit #${order.orderNumber}` : "Edit order"}
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
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}
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

            <TextField
              label="Customer name"
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
              label="Email"
              size="small"
              fullWidth
              error={Boolean(errors.customer?.email)}
              helperText={errors.customer?.email?.message}
              {...register("customer.email")}
            />
            <TextField
              label="Address"
              size="small"
              fullWidth
              multiline
              minRows={2}
              {...register("customer.address")}
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
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={saveMutation.isPending}
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
          {saveMutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
