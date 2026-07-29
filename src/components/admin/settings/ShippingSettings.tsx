"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { SettingsSection } from "@/components/admin/settings/SettingsSection";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import type { SiteSettings } from "@/types/site-settings";

type ShippingFormValues = {
  freeShippingEnabled: boolean;
  freeShippingMinimum: string;
  estimatedInsideDhaka: string;
  estimatedOutsideDhaka: string;
  areas: { id: string; name: string }[];
  classes: {
    id: string;
    name: string;
    description: string;
    freeDelivery: boolean;
    fees: string[];
  }[];
};

function parseAmount(value: string) {
  const n = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function settingsToForm(settings: SiteSettings): ShippingFormValues {
  return {
    freeShippingEnabled: settings.freeDeliveryEnabled,
    freeShippingMinimum: String(settings.freeDeliveryMinimum),
    estimatedInsideDhaka: settings.shippingEstimateInsideDhaka,
    estimatedOutsideDhaka: settings.shippingEstimateOutsideDhaka,
    areas: settings.shippingAreas.map((area) => ({ id: area.id, name: area.name })),
    classes: settings.shippingClasses.map((cls) => ({
      id: cls.id,
      name: cls.name,
      description: cls.description,
      freeDelivery: cls.freeDelivery,
      fees: settings.shippingAreas.map((_, index) => String(cls.fees[index] ?? 0)),
    })),
  };
}

const addClassButtonSx = {
  flexShrink: 0,
  borderColor: ADMIN_ACCENT,
  color: ADMIN_ACCENT,
  fontWeight: 600,
  textTransform: "none" as const,
  fontSize: "0.85rem",
  px: 1.75,
  py: 0.65,
  "&:hover": {
    borderColor: "#185a4a",
    bgcolor: "rgba(31,111,91,0.06)",
  },
};

const deleteButtonSx = {
  flexShrink: 0,
  border: "1px solid",
  borderColor: "rgba(239,68,68,0.35)",
  borderRadius: 1,
  color: "#dc2626",
  "&:hover": {
    bgcolor: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.5)",
  },
};

export function ShippingSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormValues>({
    defaultValues: settingsToForm(DEFAULT_SITE_SETTINGS),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteSettings) return;
    reset(settingsToForm(siteSettings));
  }, [siteSettings, reset]);

  const {
    fields: areaFields,
    append: appendArea,
    remove: removeArea,
  } = useFieldArray({
    control,
    name: "areas",
  });

  const {
    fields: classFields,
    append: appendClass,
    remove: removeClass,
  } = useFieldArray({
    control,
    name: "classes",
  });

  const areas = watch("areas");
  const freeShippingEnabled = watch("freeShippingEnabled");

  const accentSwitchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: ADMIN_ACCENT,
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      bgcolor: ADMIN_ACCENT,
    },
  };

  function syncFeesAfterAreaAdd() {
    const classCount = getValues("classes").length;
    for (let i = 0; i < classCount; i += 1) {
      const fees = [...(getValues(`classes.${i}.fees`) ?? [])];
      fees.push("");
      setValue(`classes.${i}.fees`, fees);
    }
  }

  function syncFeesAfterAreaRemove(index: number) {
    const classCount = getValues("classes").length;
    for (let i = 0; i < classCount; i += 1) {
      const fees = [...(getValues(`classes.${i}.fees`) ?? [])];
      fees.splice(index, 1);
      setValue(`classes.${i}.fees`, fees);
    }
  }

  function handleAddArea() {
    appendArea({ id: newId("area"), name: "" });
    syncFeesAfterAreaAdd();
  }

  function handleRemoveArea(index: number) {
    if (areaFields.length <= 1) return;
    removeArea(index);
    syncFeesAfterAreaRemove(index);
  }

  function handleAddClass() {
    const areaCount = getValues("areas").length;
    appendClass({
      id: newId("class"),
      name: "",
      description: "",
      freeDelivery: false,
      fees: Array.from({ length: areaCount }, () => ""),
    });
  }

  async function onSubmit(values: ShippingFormValues) {
    const minimum = parseAmount(values.freeShippingMinimum);
    if (values.freeShippingEnabled && (!Number.isFinite(minimum) || minimum < 0)) {
      setSaveError("Enter a valid free delivery minimum amount.");
      return;
    }

    const shippingAreas = values.areas.map((area, index) => ({
      id: area.id || newId("area"),
      name: area.name.trim() || `Area ${index + 1}`,
    }));

    const shippingClasses = values.classes.map((cls, index) => ({
      id: cls.id || newId("class"),
      name: cls.name.trim() || `Class ${index + 1}`,
      description: cls.description.trim(),
      freeDelivery: cls.freeDelivery,
      fees: shippingAreas.map((_, feeIndex) => {
        if (cls.freeDelivery) return 0;
        const n = parseAmount(cls.fees[feeIndex] ?? "0");
        return Number.isFinite(n) && n >= 0 ? n : 0;
      }),
    }));

    setSaveError(null);
    try {
      await saveMutation.mutateAsync({
        freeDeliveryEnabled: values.freeShippingEnabled,
        freeDeliveryMinimum: Number.isFinite(minimum) ? minimum : 0,
        shippingEstimateInsideDhaka: values.estimatedInsideDhaka.trim(),
        shippingEstimateOutsideDhaka: values.estimatedOutsideDhaka.trim(),
        shippingAreas,
        shippingClasses,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save shipping settings. Try again.");
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
            Shipping
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary", maxWidth: 520 }}>
            Manage delivery areas and shipping class charges.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isLoading || saveMutation.isPending}
          sx={{
            flexShrink: 0,
            bgcolor: ADMIN_ACCENT,
            fontWeight: 600,
            textTransform: "none",
            px: 2.5,
            boxShadow: "0 2px 8px rgba(31,111,91,0.25)",
            "&:hover": { bgcolor: "#185a4a" },
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
          Shipping settings saved.
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
        <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SettingsSection
              title="Delivery Areas"
              description="Controls delivery options shown at checkout."
              headerAction={
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={handleAddArea}
                  sx={addClassButtonSx}
                >
                  Add Area
                </Button>
              }
            >
              <Stack spacing={1.5}>
                {areaFields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <input type="hidden" {...register(`areas.${index}.id`)} />
                    <TextField
                      label="Area Name"
                      fullWidth
                      size="small"
                      error={Boolean(errors.areas?.[index]?.name)}
                      helperText={errors.areas?.[index]?.name?.message}
                      {...register(`areas.${index}.name`, {
                        required: "Area name is required",
                      })}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fafafa",
                        },
                      }}
                    />
                    <Tooltip title={areaFields.length <= 1 ? "At least one area required" : "Remove area"}>
                      <span>
                        <IconButton
                          type="button"
                          size="small"
                          disabled={areaFields.length <= 1}
                          onClick={() => handleRemoveArea(index)}
                          aria-label="Remove delivery area"
                          sx={deleteButtonSx}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
            </SettingsSection>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <SettingsSection
              title="Shipping Classes"
              description="Set product-wise shipping charges."
              headerAction={
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={handleAddClass}
                  sx={addClassButtonSx}
                >
                  Add Class
                </Button>
              }
            >
              <Stack spacing={2}>
                {classFields.map((field, classIndex) => {
                  const freeDelivery = watch(`classes.${classIndex}.freeDelivery`);
                  return (
                    <Box
                      key={field.id}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: "1px solid",
                        borderColor: "rgba(0,0,0,0.08)",
                        bgcolor: "rgba(248,250,252,0.9)",
                      }}
                    >
                      <input type="hidden" {...register(`classes.${classIndex}.id`)} />
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "flex-start",
                          gap: 1,
                        }}
                      >
                        <TextField
                          label="Class Name"
                          size="small"
                          sx={{ flex: "1 1 140px", minWidth: 120 }}
                          error={Boolean(errors.classes?.[classIndex]?.name)}
                          helperText={errors.classes?.[classIndex]?.name?.message}
                          {...register(`classes.${classIndex}.name`, {
                            required: "Class name is required",
                          })}
                        />
                        <TextField
                          label="Description"
                          size="small"
                          sx={{ flex: "2 1 180px", minWidth: 140 }}
                          {...register(`classes.${classIndex}.description`)}
                        />
                        <Controller
                          name={`classes.${classIndex}.freeDelivery`}
                          control={control}
                          render={({ field: switchField }) => (
                            <FormControlLabel
                              sx={{
                                m: 0,
                                flexShrink: 0,
                                alignSelf: "center",
                                "& .MuiTypography-root": {
                                  fontSize: "0.8rem",
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                },
                              }}
                              control={
                                <Switch
                                  size="small"
                                  checked={switchField.value}
                                  onChange={(_, checked) => switchField.onChange(checked)}
                                  sx={accentSwitchSx}
                                />
                              }
                              label="Free Delivery"
                            />
                          )}
                        />
                        <Tooltip
                          title={classFields.length <= 1 ? "At least one class required" : "Remove class"}
                        >
                          <span>
                            <IconButton
                              type="button"
                              size="small"
                              disabled={classFields.length <= 1}
                              onClick={() => removeClass(classIndex)}
                              aria-label="Remove shipping class"
                              sx={deleteButtonSx}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mt: 1.75,
                          pt: 1.75,
                          borderTop: "1px dashed",
                          borderColor: "rgba(0,0,0,0.08)",
                        }}
                      >
                        {areas.map((area, areaIndex) => {
                          const label =
                            area.name.trim() || `Area ${areaIndex + 1}`;
                          return (
                            <TextField
                              key={`${field.id}-fee-${areaIndex}`}
                              label={label}
                              size="small"
                              type="number"
                              disabled={freeDelivery}
                              slotProps={{
                                htmlInput: { min: 0, step: 1 },
                              }}
                              sx={{ flex: "1 1 120px", minWidth: 100, maxWidth: 200 }}
                              error={Boolean(
                                errors.classes?.[classIndex]?.fees?.[areaIndex],
                              )}
                              helperText={
                                errors.classes?.[classIndex]?.fees?.[areaIndex]?.message
                              }
                              {...register(`classes.${classIndex}.fees.${areaIndex}`, {
                                validate: (value) => {
                                  if (freeDelivery) return true;
                                  const n = parseAmount(value ?? "");
                                  if (!Number.isFinite(n) || n < 0) {
                                    return "Invalid";
                                  }
                                  return true;
                                },
                              })}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </SettingsSection>
          </Grid>
        </Grid>

        <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SettingsSection
              title="Free delivery"
              description="Offer free shipping when the cart meets a minimum total."
            >
              <Stack spacing={2}>
                <Controller
                  name="freeShippingEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                          sx={accentSwitchSx}
                        />
                      }
                      label="Enable free delivery threshold"
                    />
                  )}
                />
                <TextField
                  label="Minimum order (৳)"
                  fullWidth
                  disabled={!freeShippingEnabled}
                  error={Boolean(errors.freeShippingMinimum)}
                  helperText={
                    errors.freeShippingMinimum?.message ??
                    "Matches “Free delivery on orders over ৳…” in the storefront."
                  }
                  {...register("freeShippingMinimum", {
                    validate: (value) => {
                      if (!freeShippingEnabled) return true;
                      const n = parseAmount(value);
                      if (!Number.isFinite(n) || n < 0) return "Enter a valid amount";
                      return true;
                    },
                  })}
                />
              </Stack>
            </SettingsSection>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <SettingsSection
              title="Delivery estimates"
              description="Short text customers see during checkout."
            >
              <Stack spacing={2}>
                <TextField
                  label="Inside Dhaka"
                  fullWidth
                  error={Boolean(errors.estimatedInsideDhaka)}
                  helperText={errors.estimatedInsideDhaka?.message}
                  {...register("estimatedInsideDhaka", {
                    required: "Required",
                    minLength: { value: 3, message: "Too short" },
                  })}
                />
                <TextField
                  label="Outside Dhaka"
                  fullWidth
                  error={Boolean(errors.estimatedOutsideDhaka)}
                  helperText={errors.estimatedOutsideDhaka?.message}
                  {...register("estimatedOutsideDhaka", {
                    required: "Required",
                    minLength: { value: 3, message: "Too short" },
                  })}
                />
              </Stack>
            </SettingsSection>
          </Grid>
        </Grid>
        </Stack>
      </Box>
    </Box>
  );
}
