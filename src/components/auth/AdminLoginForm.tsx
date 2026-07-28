"use client";

import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { loginBodySchema } from "@/lib/validations/admin-user";
import { ADMIN_ACCENT } from "@/lib/constants/admin";

type LoginFormValues = z.infer<typeof loginBodySchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationKey: ["auth", "admin-login"],
    mutationFn: async (values: LoginFormValues) => {
      const parsed = loginBodySchema.parse(values);
      return login(parsed.email, parsed.password);
    },
    onSuccess: ({ redirectTo }) => {
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/dashboard/admin") ? next : redirectTo);
      router.refresh();
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      sx={{ mt: 3 }}
    >
      <Stack spacing={2}>
        {mutation.isError ? (
          <Alert severity="error" sx={{ borderRadius: 1 }}>
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Login failed. Check your credentials."}
          </Alert>
        ) : null}

        <TextField
          label="Email"
          type="email"
          fullWidth
          autoComplete="username"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="current-password"
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(event) => event.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon fontSize="small" />
                    ) : (
                      <VisibilityOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={mutation.isPending}
          startIcon={
            mutation.isPending ? <CircularProgress size={18} color="inherit" /> : undefined
          }
          sx={{
            bgcolor: ADMIN_ACCENT,
            textTransform: "none",
            fontWeight: 600,
            py: 1.25,
            mt: 0.5,
            "&:hover": { bgcolor: "#185a4a" },
          }}
        >
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </Stack>
    </Box>
  );
}
