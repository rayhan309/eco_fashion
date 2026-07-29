"use client";

import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BD_REGION_OPTIONS } from "@/lib/constants/locations";
import {
  SettingsPageHeader,
  SettingsSection,
} from "@/components/admin/settings/SettingsSection";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";

type ContactFormValues = {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  supportHours: string;
  supportNote: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(\+880|880|0)?1[3-9]\d{8}$/;

export function ContactSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      businessName: "Hidden Urban",
      email: "hello@hiddenurban.com",
      phone: "01700000000",
      address: "House 12, Road 5, Dhanmondi",
      city: "Dhaka",
      supportHours: "Sat–Thu, 10:00–19:00",
      supportNote:
        "Our support team is here for sizing, orders, and delivery questions.",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (!siteSettings) return;
    reset({
      businessName: siteSettings.businessName,
      email: siteSettings.contactEmail,
      phone: siteSettings.contactPhone,
      address: siteSettings.contactAddress,
      city: siteSettings.city,
      supportHours: siteSettings.supportHours,
      supportNote: siteSettings.supportNote,
    });
  }, [siteSettings, reset]);

  async function onSubmit(values: ContactFormValues) {
    setSaveError(null);
    try {
      await saveMutation.mutateAsync({
        businessName: values.businessName,
        shopName: values.businessName,
        contactEmail: values.email,
        contactPhone: values.phone,
        contactAddress: values.address,
        city: values.city,
        supportHours: values.supportHours,
        supportNote: values.supportNote,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save contact settings. Try again.");
    }
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SettingsPageHeader
        title="Contact"
        description="Store contact details used on the contact page, footer, and order emails."
      />

      {saveError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {saveError}
        </Alert>
      ) : null}

      {saved ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          Contact settings saved.
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <SettingsSection
            title="Business details"
            description="Public-facing name and primary contact channels."
          >
            <Stack spacing={2}>
              <TextField
                label="Business name"
                fullWidth
                error={Boolean(errors.businessName)}
                helperText={errors.businessName?.message}
                {...register("businessName", {
                  required: "Business name is required",
                  minLength: { value: 2, message: "Too short" },
                })}
              />
              <TextField
                label="Support email"
                type="email"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: "Enter a valid email",
                  },
                })}
              />
              <TextField
                label="Phone"
                fullWidth
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message ?? "Bangladesh mobile format"}
                {...register("phone", {
                  required: "Phone is required",
                  validate: (value) =>
                    PHONE_PATTERN.test(value.replace(/[\s-]/g, "")) ||
                    "Use a valid BD mobile number",
                })}
              />
            </Stack>
          </SettingsSection>

          <SettingsSection title="Location" description="Shown in footer and contact page.">
            <Stack spacing={2}>
              <TextField
                label="Address"
                fullWidth
                multiline
                minRows={2}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 5, message: "Enter a full address" },
                })}
              />
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.city)}>
                    <InputLabel id="contact-city-label">City / region</InputLabel>
                    <Select {...field} labelId="contact-city-label" label="City / region">
                      {BD_REGION_OPTIONS.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city ? (
                      <FormHelperText>{errors.city.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </Stack>
          </SettingsSection>

          <SettingsSection
            title="Support"
            description="Hours and short help text for customers."
          >
            <Stack spacing={2}>
              <TextField
                label="Support hours"
                fullWidth
                placeholder="Sat–Thu, 10:00–19:00"
                error={Boolean(errors.supportHours)}
                helperText={errors.supportHours?.message}
                {...register("supportHours", { required: "Support hours are required" })}
              />
              <TextField
                label="Help blurb"
                fullWidth
                multiline
                minRows={3}
                error={Boolean(errors.supportNote)}
                helperText={errors.supportNote?.message}
                {...register("supportNote", {
                  required: "Help text is required",
                  minLength: { value: 10, message: "Add a bit more detail" },
                })}
              />
            </Stack>
          </SettingsSection>

          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || isLoading || saveMutation.isPending}
              sx={{
                bgcolor: "#1f6f5b",
                px: 3,
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
