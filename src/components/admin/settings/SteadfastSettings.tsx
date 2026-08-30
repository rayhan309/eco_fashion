"use client";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SettingsPageHeader } from "@/components/admin/settings/SettingsSection";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { api } from "@/lib/axios";

type SteadfastFormValues = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  secretKey: string;
};

export function SteadfastSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();
  const [testState, setTestState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [testMessage, setTestMessage] = useState("");

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SteadfastFormValues>({
    defaultValues: {
      enabled: false,
      baseUrl: "https://portal.packzy.com/api/v1",
      apiKey: "",
      secretKey: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteSettings) return;
    reset({
      enabled: siteSettings.steadfastEnabled,
      baseUrl: siteSettings.steadfastBaseUrl || "https://portal.packzy.com/api/v1",
      apiKey: siteSettings.steadfastApiKey,
      secretKey: siteSettings.steadfastSecretKey,
    });
  }, [siteSettings, reset]);

  const enabled = watch("enabled");
  const apiKey = watch("apiKey");
  const secretKey = watch("secretKey");

  const hasStoredSecret = Boolean(siteSettings?.steadfastSecretKey?.trim());

  const statusText = useMemo(() => {
    if (!enabled) return "Disabled — orders will not be sent to Steadfast.";
    if (!apiKey.trim()) return "Add your API key and secret key, then save.";
    if (!hasStoredSecret && !secretKey?.trim()) {
      return "Secret key missing — save credentials or set STEADFAST_SECRET_KEY in .env.";
    }
    return "Active — Steadfast API will be used";
  }, [enabled, apiKey, hasStoredSecret, secretKey]);

  async function onSubmit(values: SteadfastFormValues) {
    setSaveError(null);
    try {
      const payload: Record<string, unknown> = {
        steadfastEnabled: values.enabled,
        steadfastBaseUrl: values.baseUrl.trim() || "https://portal.packzy.com/api/v1",
        steadfastApiKey: values.apiKey.trim(),
      };

      if (values.secretKey.trim()) {
        payload.steadfastSecretKey = values.secretKey.trim();
      }

      await saveMutation.mutateAsync(payload);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save Steadfast settings. Try again.");
    }
  }

  async function handleTestConnection() {
    const values = getValues();
    if (!values.apiKey.trim()) {
      setTestState("error");
      setTestMessage("Enter API key before testing the connection.");
      return;
    }
    if (!values.secretKey.trim() && !hasStoredSecret) {
      setTestState("error");
      setTestMessage("Enter secret key before testing, or save credentials first.");
      return;
    }

    setTestState("loading");
    setTestMessage("");

    try {
      const { data } = await api.post<{ message: string }>("/api/admin/steadfast/test", {
        enabled: values.enabled,
        baseUrl: values.baseUrl,
        apiKey: values.apiKey,
        secretKey: values.secretKey,
      });
      setTestState("success");
      setTestMessage(data.message);
    } catch (error) {
      setTestState("error");
      setTestMessage(
        error instanceof Error ? error.message : "Steadfast connection test failed",
      );
    }

    window.setTimeout(() => {
      setTestState("idle");
      setTestMessage("");
    }, 5000);
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SettingsPageHeader
        title="Steadfast"
        description="Connect Steadfast Courier for Bangladesh delivery, consignments, and tracking."
      />

      {saveError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {saveError}
        </Alert>
      ) : null}

      {saved ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          Steadfast settings saved.
        </Alert>
      ) : null}

      {testState === "success" ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          {testMessage}
        </Alert>
      ) : null}

      {testState === "error" ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {testMessage}
        </Alert>
      ) : null}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.08)",
          bgcolor: "#fff",
          p: { xs: 2, sm: 2.5 },
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="Base URL"
            fullWidth
            size="small"
            error={Boolean(errors.baseUrl)}
            helperText={errors.baseUrl?.message}
            {...register("baseUrl", {
              required: "Base URL is required",
            })}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="API Key"
              fullWidth
              size="small"
              error={Boolean(errors.apiKey)}
              helperText={errors.apiKey?.message}
              {...register("apiKey", {
                validate: (value) =>
                  !enabled || value.trim().length > 0 || "API key is required when enabled",
              })}
            />
            <TextField
              label="Secret Key"
              fullWidth
              size="small"
              type="password"
              placeholder={hasStoredSecret ? "Saved — enter only to replace" : "Secret Key"}
              error={Boolean(errors.secretKey)}
              helperText={
                errors.secretKey?.message ||
                (hasStoredSecret ? "Leave blank to keep the saved secret key." : undefined)
              }
              {...register("secretKey", {
                validate: (value) =>
                  !enabled ||
                  value.trim().length > 0 ||
                  hasStoredSecret ||
                  "Secret key is required when enabled",
              })}
            />
          </Box>

          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(_, checked) => field.onChange(checked)}
                    color="primary"
                  />
                }
                label="Enable Steadfast integration"
              />
            )}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 1.5,
              bgcolor: enabled ? "#ecfdf5" : "#f8fafc",
              border: "1px solid",
              borderColor: enabled ? "#bbf7d0" : "rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
              {enabled ? (
                <CheckCircleOutlineRoundedIcon sx={{ color: "#16a34a", fontSize: 20 }} />
              ) : null}
              <Typography sx={{ fontSize: "0.85rem", color: enabled ? "#166534" : "text.secondary" }}>
                {statusText}
              </Typography>
            </Box>
            <Button
              type="button"
              variant="outlined"
              disabled={testState === "loading"}
              onClick={handleTestConnection}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                textTransform: "none",
                fontWeight: 600,
                borderColor: "rgba(0,0,0,0.12)",
                bgcolor: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {testState === "loading" ? "Testing..." : "Test Connection"}
            </Button>
          </Box>

          <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", lineHeight: 1.6 }}>
            Find credentials in Steadfast Dashboard → API Settings. Values in{" "}
            <Box component="span" sx={{ fontFamily: "monospace" }}>
              .env
            </Box>{" "}
            are used as a fallback until you save credentials here.
          </Typography>

          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isLoading || saveMutation.isPending}
              sx={{
                bgcolor: ADMIN_ACCENT,
                px: 3,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#185a4a" },
              }}
            >
              Save changes
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
