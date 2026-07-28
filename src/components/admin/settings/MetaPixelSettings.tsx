"use client";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";

type PlatformValues = {
  pixelId: string;
  browserPixelEnabled: boolean;
  capiToken: string;
  capiTokenSaved: boolean;
  testEventCode: string;
  capiEnabled: boolean;
};

type PixelCapiFormValues = {
  meta: PlatformValues;
  tiktok: PlatformValues;
};

const META_PIXEL_PATTERN = /^\d{10,20}$/;
const TIKTOK_PIXEL_PATTERN = /^[A-Z0-9]{10,32}$/i;

const defaultPlatform = (overrides?: Partial<PlatformValues>): PlatformValues => ({
  pixelId: "",
  browserPixelEnabled: false,
  capiToken: "",
  capiTokenSaved: false,
  testEventCode: "",
  capiEnabled: false,
  ...overrides,
});

function platformActive(platform: PlatformValues) {
  const hasPixel = platform.pixelId.trim().length > 0;
  const browserOk = platform.browserPixelEnabled && hasPixel;
  const capiOk =
    platform.capiEnabled &&
    hasPixel &&
    (platform.capiToken.trim().length > 0 || platform.capiTokenSaved);
  return browserOk || capiOk;
}

function PlatformStatusBanner({
  platformName,
  active,
  deduplicationNote,
}: {
  platformName: string;
  active: boolean;
  deduplicationNote?: boolean;
}) {
  return (
    <Box
      sx={{
        mt: 2,
        px: 2,
        py: 1.25,
        borderRadius: 1,
        bgcolor: active ? "rgba(31,111,91,0.1)" : "#f1f5f9",
        border: "1px solid",
        borderColor: active ? "rgba(31,111,91,0.25)" : "#e2e8f0",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          color: active ? ADMIN_ACCENT : "text.secondary",
        }}
      >
        {active
          ? `Active — ${platformName} browser pixel and CAPI tracking are enabled.${
              deduplicationNote ? " (Deduplication enabled)" : ""
            }`
          : `${platformName} tracking is disabled.`}
      </Typography>
    </Box>
  );
}

function PlatformCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      {children}
    </Box>
  );
}

function SectionTitle({ dotColor, label }: { dotColor: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: dotColor,
          flexShrink: 0,
        }}
      />
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{label}</Typography>
    </Box>
  );
}

export function MetaPixelSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PixelCapiFormValues>({
    defaultValues: {
      meta: defaultPlatform(),
      tiktok: defaultPlatform({
        pixelId: "D922EVDC77UD7MKJJDDB",
        browserPixelEnabled: true,
        capiEnabled: true,
        capiTokenSaved: true,
        testEventCode: "TEST05989",
      }),
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteSettings) return;
    reset({
      meta: defaultPlatform({
        pixelId: siteSettings.metaPixelId,
        browserPixelEnabled: siteSettings.metaPixelEnabled,
      }),
      tiktok: defaultPlatform({
        pixelId: "D922EVDC77UD7MKJJDDB",
        browserPixelEnabled: true,
        capiEnabled: true,
        capiTokenSaved: true,
        testEventCode: "TEST05989",
      }),
    });
  }, [siteSettings, reset]);

  const meta = watch("meta");
  const tiktok = watch("tiktok");

  const metaActive = useMemo(() => platformActive(meta), [meta]);
  const tiktokActive = useMemo(() => platformActive(tiktok), [tiktok]);

  async function onSubmit(values: PixelCapiFormValues) {
    setSaveError(null);
    try {
      await saveMutation.mutateAsync({
        metaPixelId: values.meta.pixelId.trim(),
        metaPixelEnabled:
          values.meta.browserPixelEnabled && values.meta.pixelId.trim().length > 0,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save pixel settings. Try again.");
    }
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "flex-start" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ADMIN_ACCENT,
            }}
          >
            Settings
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Pixel &amp; CAPI settings
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary", maxWidth: 720 }}>
            Set up Meta (Facebook) and TikTok browser pixels plus server-side Conversions API
            (CAPI).
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isLoading || saveMutation.isPending}
          sx={{
            flexShrink: 0,
            bgcolor: "#20312d",
            fontWeight: 600,
            textTransform: "none",
            px: 2.5,
            "&:hover": { bgcolor: "#14221f" },
          }}
        >
          Save
        </Button>
      </Box>

      {saveError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {saveError}
        </Alert>
      ) : null}

      {saved ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          Pixel &amp; CAPI settings saved.
        </Alert>
      ) : null}

      <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PlatformCard>
            <SectionTitle dotColor="#1877f2" label="Meta (Facebook) Pixel & CAPI" />
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="Pixel ID"
                    fullWidth
                    placeholder="1234567890123456"
                    error={Boolean(errors.meta?.pixelId)}
                    helperText={
                      errors.meta?.pixelId?.message ??
                      "Events Manager → Data sources → Pixel → Settings → Pixel ID"
                    }
                    {...register("meta.pixelId", {
                      validate: (value) => {
                        const m = watch("meta");
                        if (!m.browserPixelEnabled && !m.capiEnabled) return true;
                        if (!value.trim()) return "Pixel ID is required when tracking is on";
                        if (!META_PIXEL_PATTERN.test(value.trim())) {
                          return "Enter a valid numeric Pixel ID";
                        }
                        return true;
                      },
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="meta.browserPixelEnabled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(_, checked) => field.onChange(checked)}
                          />
                        }
                        label="Enable browser pixel"
                        sx={{ mt: { md: 1 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="CAPI access token"
                    fullWidth
                    type="password"
                    placeholder="EAA..."
                    helperText="Events Manager → Settings → Conversions API → Generate access token"
                    {...register("meta.capiToken", {
                      validate: (value) => {
                        const m = watch("meta");
                        if (!m.capiEnabled) return true;
                        if (value.trim() || m.capiTokenSaved) return true;
                        return "Access token is required when CAPI is enabled";
                      },
                    })}
                    error={Boolean(errors.meta?.capiToken)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Test event code (optional)"
                    fullWidth
                    placeholder="TEST12345"
                    helperText="Events Manager → Test events"
                    {...register("meta.testEventCode")}
                  />
                </Grid>
              </Grid>

              <Controller
                name="meta.capiEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Enable Conversions API (CAPI)"
                  />
                )}
              />

              <PlatformStatusBanner platformName="Meta" active={metaActive} />
            </Stack>
        </PlatformCard>

        <PlatformCard>
            <SectionTitle dotColor="#fe2c55" label="TikTok Pixel & CAPI" />
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="TikTok Pixel ID"
                    fullWidth
                    placeholder="D922EVDC77UD7MKJJDDB"
                    error={Boolean(errors.tiktok?.pixelId)}
                    helperText={
                      errors.tiktok?.pixelId?.message ??
                      "TikTok Ads Manager → Assets → Events → Web → Pixel code"
                    }
                    {...register("tiktok.pixelId", {
                      validate: (value) => {
                        const t = watch("tiktok");
                        if (!t.browserPixelEnabled && !t.capiEnabled) return true;
                        if (!value.trim()) return "Pixel ID is required when tracking is on";
                        if (!TIKTOK_PIXEL_PATTERN.test(value.trim())) {
                          return "Enter a valid TikTok Pixel ID";
                        }
                        return true;
                      },
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="tiktok.browserPixelEnabled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(_, checked) => field.onChange(checked)}
                          />
                        }
                        label="Enable browser pixel"
                        sx={{ mt: { md: 1 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="CAPI access token"
                    fullWidth
                    type="password"
                    placeholder={
                      tiktok.capiTokenSaved
                        ? "Saved — enter a new token to replace"
                        : "Enter access token"
                    }
                    helperText="TikTok Events Manager → Settings → Events API → Generate token"
                    {...register("tiktok.capiToken", {
                      validate: (value) => {
                        const t = watch("tiktok");
                        if (!t.capiEnabled) return true;
                        if (value.trim() || t.capiTokenSaved) return true;
                        return "Access token is required when CAPI is enabled";
                      },
                    })}
                    error={Boolean(errors.tiktok?.capiToken)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Test event code (optional)"
                    fullWidth
                    placeholder="TEST05989"
                    helperText="TikTok Events Manager → Test events"
                    {...register("tiktok.testEventCode")}
                  />
                </Grid>
              </Grid>

              <Controller
                name="tiktok.capiEnabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(_, checked) => field.onChange(checked)}
                      />
                    }
                    label="Enable Conversions API (CAPI)"
                  />
                )}
              />

              <PlatformStatusBanner
                platformName="TikTok"
                active={tiktokActive}
                deduplicationNote
              />
            </Stack>
        </PlatformCard>
      </Stack>
    </Box>
  );
}
