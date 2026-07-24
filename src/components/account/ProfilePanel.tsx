"use client";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { BD_REGION_OPTIONS, BD_REGIONS } from "@/lib/constants/locations";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";

type ProfileFormValues = {
  fullName: string;
  phone: string;
  email: string;
  region: string;
  district: string;
  address: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PHONE_PATTERN = /^(\+880|880|0)?1[3-9]\d{8}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfilePanel() {
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "Arif Rahman",
      phone: "01700000000",
      email: "arif@email.com",
      region: "Dhaka",
      district: "Dhaka",
      address: "House 12, Road 5, Dhanmondi",
    },
    mode: "onBlur",
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const region = watch("region");
  const districts = useMemo(() => BD_REGIONS[region] ?? [], [region]);
  const newPasswordValue = watchPassword("newPassword");

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Image must be 2MB or smaller.");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
  }

  function onProfileSubmit(_values: ProfileFormValues) {
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2500);
  }

  function onPasswordSubmit(_values: PasswordFormValues) {
    setPasswordSaved(true);
    resetPassword();
    window.setTimeout(() => setPasswordSaved(false), 2500);
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update your photo, contact info, and delivery address.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onProfileSubmit)} noValidate>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "center" } }}
          >
            <Avatar
              src={avatarPreview}
              alt="Profile photo"
              variant="rounded"
              sx={{
                width: 96,
                height: 96,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Profile photo
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                JPG or PNG, max 2MB recommended.
              </Typography>
              <Button
                component="label"
                variant="outlined"
                color="inherit"
                startIcon={<CameraAltOutlinedIcon />}
                sx={{ mt: 1.5, borderRadius: 1, borderColor: "divider" }}
              >
                Change photo
                <Box
                  component="input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  sx={{ display: "none" }}
                />
              </Button>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Full name"
                fullWidth
                error={Boolean(errors.fullName)}
                helperText={errors.fullName?.message}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone number"
                type="tel"
                fullWidth
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: PHONE_PATTERN,
                    message: "Enter a valid BD phone number",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="region"
                control={control}
                rules={{ required: "Region is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.region)}>
                    <InputLabel id="region-label">Region</InputLabel>
                    <Select
                      {...field}
                      labelId="region-label"
                      label="Region"
                      onChange={(event) => {
                        field.onChange(event);
                        const nextDistricts = BD_REGIONS[event.target.value] ?? [];
                        setValue("district", nextDistricts[0] ?? "", {
                          shouldValidate: true,
                        });
                      }}
                    >
                      {BD_REGION_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.region ? (
                      <FormHelperText>{errors.region.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="district"
                control={control}
                rules={{ required: "District is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.district)}>
                    <InputLabel id="district-label">District</InputLabel>
                    <Select {...field} labelId="district-label" label="District">
                      {districts.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.district ? (
                      <FormHelperText>{errors.district.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address details"
                placeholder="House, road, area, landmark..."
                fullWidth
                multiline
                minRows={4}
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                {...register("address", {
                  required: "Address details are required",
                  minLength: {
                    value: 10,
                    message: "Address must be at least 10 characters",
                  },
                })}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ borderRadius: 1 }}
            >
              Save profile
            </Button>
            {profileSaved ? (
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                Profile updated.
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 4 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Update password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose a strong password you don&apos;t use elsewhere.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          noValidate
          sx={{ maxWidth: 520 }}
        >
          <Stack spacing={2}>
            <TextField
              label="Current password"
              type="password"
              fullWidth
              autoComplete="current-password"
              error={Boolean(passwordErrors.currentPassword)}
              helperText={passwordErrors.currentPassword?.message}
              {...registerPassword("currentPassword", {
                required: "Current password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              autoComplete="new-password"
              error={Boolean(passwordErrors.newPassword)}
              helperText={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) =>
                  value !== watchPassword("currentPassword") ||
                  "New password must be different from current password",
              })}
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              autoComplete="new-password"
              error={Boolean(passwordErrors.confirmPassword)}
              helperText={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPasswordValue || "Passwords do not match",
              })}
            />

            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={isPasswordSubmitting}
                sx={{ borderRadius: 1 }}
              >
                Update password
              </Button>
              {passwordSaved ? (
                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                  Password updated.
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
