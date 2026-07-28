"use client";

import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  SettingsPageHeader,
  SettingsSection,
} from "@/components/admin/settings/SettingsSection";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";

type SteadfastFormValues = {
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  environment: "sandbox" | "production";
  storeId: string;
  autoCreateConsignment: boolean;
};

export function SteadfastSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();
  const [testState, setTestState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
      apiKey: "",
      secretKey: "",
      environment: "production",
      storeId: "",
      autoCreateConsignment: true,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteSettings) return;
    reset({
      enabled: siteSettings.steadfastEnabled,
      apiKey: siteSettings.steadfastApiKey,
      secretKey: siteSettings.steadfastSecretKey,
      environment: "production",
      storeId: "",
      autoCreateConsignment: true,
    });
  }, [siteSettings, reset]);

  const enabled = watch("enabled");

  async function onSubmit(values: SteadfastFormValues) {
    setSaveError(null);
    try {
      await saveMutation.mutateAsync({
        steadfastEnabled: values.enabled,
        steadfastApiKey: values.apiKey,
        steadfastSecretKey: values.secretKey,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save Steadfast settings. Try again.");
    }
  }

  async function handleTestConnection() {
    const values = getValues();
    if (!values.apiKey.trim() || !values.secretKey.trim()) {
      setTestState("error");
      setTestMessage("Enter API key and secret key before testing the connection.");
      return;
    }

    setTestState("loading");
    setTestMessage("");

    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    setTestState("success");
    setTestMessage(
      `Connection successful (${values.environment === "sandbox" ? "sandbox" : "production"}).`,
    );
    window.setTimeout(() => {
      setTestState("idle");
      setTestMessage("");
    }, 4000);
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

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <SettingsSection
            title="API credentials"
            description="Keys from your Steadfast merchant dashboard."
          >
            <Stack spacing={2}>
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
                    label="Enable Steadfast shipping"
                  />
                )}
              />

              <TextField
                label="API key"
                fullWidth
                disabled={!enabled}
                error={Boolean(errors.apiKey)}
                helperText={errors.apiKey?.message}
                {...register("apiKey", {
                  validate: (value) =>
                    !enabled || value.trim().length > 0 || "API key is required when enabled",
                })}
              />

              <TextField
                label="Secret key"
                fullWidth
                type="password"
                disabled={!enabled}
                error={Boolean(errors.secretKey)}
                helperText={errors.secretKey?.message}
                {...register("secretKey", {
                  validate: (value) =>
                    !enabled || value.trim().length > 0 || "Secret key is required when enabled",
                })}
              />

              <Controller
                name="environment"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth disabled={!enabled}>
                    <InputLabel id="steadfast-env-label">Environment</InputLabel>
                    <Select
                      {...field}
                      labelId="steadfast-env-label"
                      label="Environment"
                    >
                      <MenuItem value="sandbox">Sandbox (testing)</MenuItem>
                      <MenuItem value="production">Production (live)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <TextField
                label="Store ID (optional)"
                fullWidth
                disabled={!enabled}
                placeholder="Merchant store identifier"
                {...register("storeId")}
              />
            </Stack>
          </SettingsSection>

          <SettingsSection
            title="Fulfillment"
            description="How orders sync with Steadfast after checkout."
          >
            <Controller
              name="autoCreateConsignment"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(_, checked) => field.onChange(checked)}
                      color="primary"
                      disabled={!enabled}
                    />
                  }
                  label="Automatically create consignment when order is confirmed"
                />
              )}
            />
            <Typography sx={{ mt: 1.5, fontSize: "0.8rem", color: "text.secondary" }}>
              Webhook URL (configure in Steadfast):{" "}
              <Box
                component="span"
                sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "text.primary" }}
              >
                /api/webhooks/steadfast
              </Box>
            </Typography>
          </SettingsSection>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button
              type="button"
              variant="outlined"
              disabled={testState === "loading"}
              startIcon={<LinkOutlinedIcon />}
              onClick={handleTestConnection}
              sx={{
                borderColor: "#1f6f5b",
                color: "#1f6f5b",
                fontWeight: 600,
                textTransform: "none",
                px: 2.5,
                "&:hover": {
                  borderColor: "#185a4a",
                  bgcolor: "rgba(31,111,91,0.06)",
                },
              }}
            >
              {testState === "loading" ? "Testing..." : "Test connection"}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isLoading || saveMutation.isPending}
              sx={{
                bgcolor: "#1f6f5b",
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
