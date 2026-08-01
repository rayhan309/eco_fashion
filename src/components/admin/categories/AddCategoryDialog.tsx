"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { uploadImageToImageKit } from "@/lib/imagekit/upload-client";
import { slugifyCategoryName } from "@/lib/validations/admin-category";
import type { AdminCategory } from "@/types/admin-category";

type CategoryFormValues = {
  name: string;
  slug: string;
};

type AddCategoryDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initial?: AdminCategory | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    slug: string;
    image: string;
    description: string;
  }) => Promise<void> | void;
};

export function AddCategoryDialog({
  open,
  mode,
  initial,
  saving = false,
  onClose,
  onSave,
}: AddCategoryDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: "", slug: "" },
    mode: "onBlur",
  });

  const nameValue = watch("name");
  const busy = saving || uploading;

  useEffect(() => {
    if (!open) return;
    setSlugTouched(false);
    setImageError(null);
    setUploadError(null);
    setPendingFile(null);
    setUploading(false);
    if (mode === "edit" && initial) {
      reset({ name: initial.name, slug: initial.slug });
      setImagePreview(initial.image);
    } else {
      reset({ name: "", slug: "" });
      setImagePreview(null);
    }
  }, [open, mode, initial, reset]);

  useEffect(() => {
    if (!open || slugTouched || mode === "edit") return;
    if (nameValue) {
      setValue("slug", slugifyCategoryName(nameValue), { shouldValidate: true });
    }
  }, [nameValue, open, slugTouched, mode, setValue]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setImageError("Image must be 3MB or smaller.");
      return;
    }
    setImageError(null);
    setUploadError(null);
    setPendingFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: CategoryFormValues) {
    const existingImage = mode === "edit" ? initial?.image : null;
    if (!pendingFile && !imagePreview && !existingImage) {
      setImageError("Category image is required.");
      return;
    }

    setUploadError(null);
    try {
      let imageUrl = existingImage || imagePreview || "";
      if (pendingFile) {
        setUploading(true);
        imageUrl = await uploadImageToImageKit(pendingFile, "/hidden-urban/categories");
      }

      if (!imageUrl || imageUrl.startsWith("blob:")) {
        setImageError("Category image is required.");
        return;
      }

      await onSave({
        name: values.name.trim(),
        slug: slugifyCategoryName(values.slug || values.name),
        image: imageUrl,
        description: initial?.description ?? "",
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not save category");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => !busy && onClose()}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: { borderRadius: 2 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ADMIN_ACCENT,
              }}
            >
              {mode === "add" ? "New category" : "Edit category"}
            </Typography>
            <Typography sx={{ mt: 0.5, fontWeight: 700, fontSize: "1.25rem" }}>
              {mode === "add" ? "Add category" : "Edit category"}
            </Typography>
          </Box>
          <IconButton aria-label="Close" onClick={onClose} size="small" disabled={busy}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            label="Category name"
            fullWidth
            required
            margin="normal"
            disabled={busy}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register("name", {
              required: "Category name is required",
              minLength: { value: 2, message: "Too short" },
            })}
          />

          <TextField
            label="Slug"
            fullWidth
            margin="normal"
            disabled={busy}
            error={Boolean(errors.slug)}
            helperText={errors.slug?.message ?? "Used in URLs, e.g. /shop/your-slug"}
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Use lowercase letters, numbers, and hyphens",
              },
              onChange: () => setSlugTouched(true),
            })}
          />

          <Typography sx={{ mt: 2, mb: 1, fontSize: "0.85rem", fontWeight: 600 }}>
            Category image <Box component="span" sx={{ color: "#dc2626" }}>*</Box>
          </Typography>
          <Box
            role="button"
            tabIndex={0}
            onClick={() => !busy && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (busy) return;
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            sx={{
              border: "2px dashed",
              borderColor: imageError ? "#dc2626" : `${ADMIN_ACCENT}66`,
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: busy ? "default" : "pointer",
              bgcolor: "rgba(31,111,91,0.04)",
              opacity: busy ? 0.7 : 1,
              "&:hover": busy ? undefined : { bgcolor: "rgba(31,111,91,0.08)" },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <Box
                component="img"
                src={imagePreview}
                alt="Category preview"
                sx={{
                  maxHeight: 160,
                  maxWidth: "100%",
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                <ImageOutlinedIcon sx={{ fontSize: 40, color: ADMIN_ACCENT }} />
                <Typography sx={{ mt: 1, fontWeight: 600, color: ADMIN_ACCENT }}>
                  Upload category image
                </Typography>
              </>
            )}
          </Box>
          {imageError ? (
            <Typography sx={{ mt: 0.75, fontSize: "0.75rem", color: "#dc2626" }}>
              {imageError}
            </Typography>
          ) : null}
          {uploadError ? (
            <Typography sx={{ mt: 0.75, fontSize: "0.75rem", color: "#dc2626" }}>
              {uploadError}
            </Typography>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
          <Button
            onClick={onClose}
            disabled={busy}
            sx={{ fontWeight: 600, color: "text.primary", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={busy}
            startIcon={<CloudUploadOutlinedIcon />}
            sx={{
              bgcolor: ADMIN_ACCENT,
              fontWeight: 600,
              px: 2.5,
              textTransform: "none",
              "&:hover": { bgcolor: "#185a4a" },
            }}
          >
            {uploading ? "Uploading…" : saving ? "Saving…" : "Save category"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
