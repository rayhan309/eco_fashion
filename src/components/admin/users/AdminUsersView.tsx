"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SettingsPageHeader, SettingsSection } from "@/components/admin/settings/SettingsSection";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { createAdminUser, deleteAdminUser, fetchAdminUsers } from "@/services/admin-users";
import { ROLE_LABELS, type AdminRole } from "@/lib/validations/admin-user";

type CreateForm = {
  name: string;
  email: string;
  password: string;
  role: "shop_manager" | "moderator";
};

type DeletableUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function AdminUsersView() {
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<DeletableUser | null>(null);

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "shop_manager",
    },
  });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: async () => {
      reset();
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SettingsPageHeader
        title="User management"
        description="Create Shop Managers and Moderators. Only Super Admin can manage dashboard users."
      />

      {createMutation.isError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Failed to create user"}
        </Alert>
      ) : null}

      {createMutation.isSuccess ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          User created successfully.
        </Alert>
      ) : null}

      {deleteMutation.isError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Failed to delete user"}
        </Alert>
      ) : null}

      <Stack spacing={2.5}>
        <SettingsSection
          title="Add dashboard user"
          description="Shop Manager: products, categories, customers. Moderator: orders only."
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit((values) => createMutation.mutate(values))}
          >
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                }}
              >
                <TextField
                  label="Full name"
                  fullWidth
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  {...register("name", { required: "Name is required" })}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  {...register("email", { required: "Email is required" })}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters" },
                  })}
                />
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select {...field} labelId="role-label" label="Role">
                        <MenuItem value="shop_manager">Shop Manager</MenuItem>
                        <MenuItem value="moderator">Moderator</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createMutation.isPending}
                  sx={{
                    bgcolor: ADMIN_ACCENT,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#185a4a" },
                  }}
                >
                  {createMutation.isPending ? "Creating…" : "Create user"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </SettingsSection>

        <SettingsSection title="Dashboard users" description="All admin accounts in MongoDB.">
          {usersQuery.isError ? (
            <Alert severity="error">
              {usersQuery.error instanceof Error
                ? usersQuery.error.message
                : "Failed to load users"}
            </Alert>
          ) : null}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(usersQuery.data ?? []).map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        {user.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{ROLE_LABELS[user.role as AdminRole]}</TableCell>
                    <TableCell align="right">
                      {user.role === "super_admin" ? (
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                          Protected
                        </Typography>
                      ) : (
                        <Tooltip title="Delete user">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={deleteMutation.isPending}
                              onClick={() => setDeleteTarget(user)}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!usersQuery.isLoading && (usersQuery.data?.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography color="text.secondary">No users found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </SettingsSection>
      </Stack>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
      >
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget
              ? `${deleteTarget.name} (${deleteTarget.email}) will lose dashboard access. This cannot be undone.`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending || !deleteTarget}
            onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
