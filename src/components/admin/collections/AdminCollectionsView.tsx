"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CollectionImageUpload } from "@/components/admin/collections/CollectionImageUpload";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CollectionProductSelect } from "@/components/admin/collections/CollectionProductSelect";
import type { Collection } from "@/types/collection";
import { useToast } from "@/context/toast/ToastProvider";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { queryKeys } from "@/lib/queries/query-keys";
import {
  collectionFormSchema,
  slugifyCollectionTitle,
  type CollectionFormValues,
} from "@/lib/validations/collection";
import { fetchAdminProductsCatalog } from "@/services/store-queries";
import {
  createCollection,
  deleteCollection,
  updateCollection,
} from "@/services/admin-collections";
import { uploadImageToImageKit } from "@/lib/imagekit/upload-client";

function toFormValues(collection: Collection): CollectionFormValues {
  return {
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    productIds: collection.productIds,
  };
}

type AdminCollectionsViewProps = {
  collections: Collection[];
};

const emptyForm: CollectionFormValues = {
  title: "",
  slug: "",
  description: "",
  image: "",
  productIds: [],
};

export function AdminCollectionsView({ collections }: AdminCollectionsViewProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: queryKeys.admin.productsCatalog(),
    queryFn: fetchAdminProductsCatalog,
    enabled: formOpen,
  });

  const catalogProducts = productsQuery.data?.products ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    defaultValues: emptyForm,
  });

  const title = watch("title");
  const slug = watch("slug");
  const imageUrl = watch("image");

  function openCreate() {
    setEditing(null);
    reset(emptyForm);
    setFormOpen(true);
  }

  function openEdit(collection: Collection) {
    setEditing(collection);
    reset(toFormValues(collection));
    setFormOpen(true);
  }

  function closeFormDialog() {
    setFormOpen(false);
    setEditing(null);
    reset(emptyForm);
    setImageError(null);
    setUploadingImage(false);
  }

  async function handleImagePick(file: File) {
    try {
      setImageError(null);
      setUploadingImage(true);
      const url = await uploadImageToImageKit(file, "/eco-fashion/collections");
      setValue("image", url, { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed";
      setImageError(message);
      showToast(message, "error");
    } finally {
      setUploadingImage(false);
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      const parsed = collectionFormSchema.parse(values);
      if (editing) {
        return updateCollection(editing.id, parsed);
      }
      return createCollection(parsed);
    },
    onSuccess: async () => {
      showToast(editing ? "Collection updated successfully" : "Collection created successfully");
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.collections() });
      closeFormDialog();
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : "Failed to save collection", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: async () => {
      setDeleteTarget(null);
      showToast("Collection deleted successfully");
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.collections() });
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : "Failed to delete collection", "error");
    },
  });

  function autoSlugFromTitle() {
    if (!slug.trim() && title.trim()) {
      setValue("slug", slugifyCollectionTitle(title), { shouldValidate: true });
    }
  }

  function onSubmit(values: CollectionFormValues) {
    const parsed = collectionFormSchema.parse(values);
    saveMutation.mutate(parsed);
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
            Catalog
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "1.5rem", fontWeight: 700 }}>
            Collections
          </Typography>
          <Typography sx={{ mt: 0.5, color: "text.secondary" }}>
            Curated product groups stored in your database.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openCreate}
          sx={{
            flexShrink: 0,
            bgcolor: ADMIN_ACCENT,
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            "&:hover": { bgcolor: "#185a4a" },
          }}
        >
          Add collection
        </Button>
      </Box>

      {collections.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "rgba(0,0,0,0.12)",
            bgcolor: "#fafafa",
          }}
        >
          <Typography color="text.secondary">No collections yet. Add one to get started.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {collections.map((collection) => (
            <Grid key={collection.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", height: "100%" }}>
                <Box sx={{ position: "relative", height: 160, bgcolor: "#f4f5f7" }}>
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : null}
                </Box>
                <CardContent>
                  <Typography sx={{ fontWeight: 700 }}>{collection.title}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>
                    {collection.description}
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: "0.75rem", color: "text.secondary" }}>
                    {collection.productIds.length} products · /{collection.slug}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      aria-label={`Edit ${collection.title}`}
                      onClick={() => openEdit(collection)}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18, color: ADMIN_ACCENT }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      aria-label={`Delete ${collection.title}`}
                      onClick={() => setDeleteTarget(collection)}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={formOpen} onClose={() => !saveMutation.isPending && closeFormDialog()} fullWidth maxWidth="md">
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editing ? "Edit collection" : "Add collection"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register("title")}
              onBlur={autoSlugFromTitle}
            />
            <TextField
              label="Slug"
              fullWidth
              required
              error={Boolean(errors.slug)}
              helperText={errors.slug?.message}
              {...register("slug")}
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              minRows={3}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              {...register("description")}
            />
            <input type="hidden" {...register("image")} />
            <CollectionImageUpload
              previewUrl={imageUrl || undefined}
              uploading={uploadingImage}
              onPick={handleImagePick}
            />
            {imageError ? (
              <Typography sx={{ fontSize: "0.8rem", color: "error.main" }}>{imageError}</Typography>
            ) : null}
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <CollectionProductSelect
                  products={catalogProducts}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  loading={productsQuery.isPending}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={closeFormDialog}
              disabled={saveMutation.isPending}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saveMutation.isPending || uploadingImage}
              sx={{ bgcolor: ADMIN_ACCENT, textTransform: "none", "&:hover": { bgcolor: "#185a4a" } }}
            >
              {saveMutation.isPending ? "Saving…" : editing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleteMutation.isPending && setDeleteTarget(null)}
      >
        <DialogTitle>Delete collection?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {deleteTarget
              ? `“${deleteTarget.title}” will be removed. This cannot be undone.`
              : ""}
          </Typography>
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
