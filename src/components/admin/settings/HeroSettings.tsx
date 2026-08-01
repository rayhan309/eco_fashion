"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  SettingsPageHeader,
  SettingsSection,
} from "@/components/admin/settings/SettingsSection";
import { useAdminSiteSettings } from "@/hooks/useAdminSiteSettings";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import { uploadImageToImageKit } from "@/lib/imagekit/upload-client";
import type { HeroSideBanner, HeroSlide } from "@/types/hero";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const emptySlide = (): HeroSlide => ({
  id: newId("slide"),
  title: "",
  subtitle: "",
  ctaLabel: "Shop now",
  href: "/shop",
  image: "",
  imageAlt: "",
});

const emptySide = (): HeroSideBanner => ({
  id: newId("side"),
  title: "",
  subtitle: "",
  href: "/shop",
  image: "",
  imageAlt: "",
  tone: "forest",
});

export function HeroSettings() {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [sideBanners, setSideBanners] = useState<HeroSideBanner[]>([]);
  const { data: siteSettings, isLoading, saveMutation } = useAdminSiteSettings();

  useEffect(() => {
    if (!siteSettings) return;
    setSlides(siteSettings.heroSlides ?? []);
    setSideBanners(siteSettings.heroSideBanners ?? []);
  }, [siteSettings]);

  async function handleImageUpload(
    file: File | undefined,
    key: string,
    onUrl: (url: string) => void,
  ) {
    if (!file) return;
    setSaveError(null);
    setUploadingKey(key);
    try {
      const url = await uploadImageToImageKit(file, "/hidden-urban/hero");
      onUrl(url);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploadingKey(null);
    }
  }

  async function onSave() {
    const cleanSlides = slides
      .map((slide) => ({
        ...slide,
        title: slide.title.trim(),
        subtitle: slide.subtitle.trim(),
        ctaLabel: slide.ctaLabel.trim() || "Shop now",
        href: slide.href.trim() || "/shop",
        image: slide.image.trim(),
        imageAlt: slide.imageAlt.trim() || slide.title.trim(),
      }))
      .filter((slide) => slide.title && slide.image);

    const cleanSides = sideBanners
      .map((banner) => ({
        ...banner,
        title: banner.title.trim(),
        subtitle: banner.subtitle.trim(),
        href: banner.href.trim() || "/shop",
        image: banner.image.trim(),
        imageAlt: banner.imageAlt.trim() || banner.title.trim(),
      }))
      .filter((banner) => banner.title && banner.image);

    setSaveError(null);
    try {
      await saveMutation.mutateAsync({
        heroSlides: cleanSlides,
        heroSideBanners: cleanSides,
      });
      setSlides(cleanSlides);
      setSideBanners(cleanSides);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Could not save hero settings. Try again.");
    }
  }

  const busy = isLoading || saveMutation.isPending || Boolean(uploadingKey);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <SettingsPageHeader
        title="Homepage hero"
        description="Only slides and side banners you add here will appear on the storefront."
        action={
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={onSave}
            disabled={busy}
            sx={{
              bgcolor: ADMIN_ACCENT,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#185a4a" },
            }}
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </Button>
        }
      />

      {saveError ? (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
          {saveError}
        </Alert>
      ) : null}
      {saved ? (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
          Hero settings saved.
        </Alert>
      ) : null}

      <Stack spacing={2.5}>
        <SettingsSection
          title="Slider slides"
          description="Main left carousel. Leave empty to hide the slider."
          headerAction={
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={<AddRoundedIcon />}
              disabled={busy}
              onClick={() => setSlides((prev) => [...prev, emptySlide()])}
              sx={{ textTransform: "none", borderColor: ADMIN_ACCENT, color: ADMIN_ACCENT }}
            >
              Add slide
            </Button>
          }
        >
          {slides.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              No slides yet. Add one to show the homepage slider.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {slides.map((slide, index) => (
                <Box
                  key={slide.id}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      Slide {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Remove slide"
                      disabled={busy}
                      onClick={() =>
                        setSlides((prev) => prev.filter((item) => item.id !== slide.id))
                      }
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                    </IconButton>
                  </Box>
                  <Stack spacing={1.5}>
                    <TextField
                      label="Title"
                      size="small"
                      fullWidth
                      value={slide.title}
                      disabled={busy}
                      onChange={(e) =>
                        setSlides((prev) =>
                          prev.map((item) =>
                            item.id === slide.id ? { ...item, title: e.target.value } : item,
                          ),
                        )
                      }
                    />
                    <TextField
                      label="Subtitle"
                      size="small"
                      fullWidth
                      value={slide.subtitle}
                      disabled={busy}
                      onChange={(e) =>
                        setSlides((prev) =>
                          prev.map((item) =>
                            item.id === slide.id ? { ...item, subtitle: e.target.value } : item,
                          ),
                        )
                      }
                    />
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.5,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        label="Button label"
                        size="small"
                        fullWidth
                        value={slide.ctaLabel}
                        disabled={busy}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((item) =>
                              item.id === slide.id
                                ? { ...item, ctaLabel: e.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                      <TextField
                        label="Link"
                        size="small"
                        fullWidth
                        value={slide.href}
                        disabled={busy}
                        onChange={(e) =>
                          setSlides((prev) =>
                            prev.map((item) =>
                              item.id === slide.id ? { ...item, href: e.target.value } : item,
                            ),
                          )
                        }
                      />
                    </Box>
                    <Button
                      component="label"
                      variant="outlined"
                      disabled={busy}
                      sx={{ textTransform: "none", alignSelf: "flex-start" }}
                    >
                      {uploadingKey === `slide-${slide.id}`
                        ? "Uploading…"
                        : slide.image
                          ? "Change image"
                          : "Upload image"}
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          void handleImageUpload(e.target.files?.[0], `slide-${slide.id}`, (url) =>
                            setSlides((prev) =>
                              prev.map((item) =>
                                item.id === slide.id
                                  ? { ...item, image: url, imageAlt: item.imageAlt || item.title }
                                  : item,
                              ),
                            ),
                          )
                        }
                      />
                    </Button>
                    {slide.image ? (
                      <Box
                        component="img"
                        src={slide.image}
                        alt=""
                        sx={{
                          width: "100%",
                          maxHeight: 160,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    ) : null}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </SettingsSection>

        <SettingsSection
          title="Side banners"
          description="Right column cards (up to 2 recommended). Leave empty to hide."
          headerAction={
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={<AddRoundedIcon />}
              disabled={busy || sideBanners.length >= 2}
              onClick={() => setSideBanners((prev) => [...prev, emptySide()])}
              sx={{ textTransform: "none", borderColor: ADMIN_ACCENT, color: ADMIN_ACCENT }}
            >
              Add banner
            </Button>
          }
        >
          {sideBanners.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              No side banners. Add one or two promo cards for the right column.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {sideBanners.map((banner, index) => (
                <Box
                  key={banner.id}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "rgba(0,0,0,0.08)",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      Banner {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Remove banner"
                      disabled={busy}
                      onClick={() =>
                        setSideBanners((prev) => prev.filter((item) => item.id !== banner.id))
                      }
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: "#dc2626" }} />
                    </IconButton>
                  </Box>
                  <Stack spacing={1.5}>
                    <TextField
                      label="Title"
                      size="small"
                      fullWidth
                      value={banner.title}
                      disabled={busy}
                      onChange={(e) =>
                        setSideBanners((prev) =>
                          prev.map((item) =>
                            item.id === banner.id ? { ...item, title: e.target.value } : item,
                          ),
                        )
                      }
                    />
                    <TextField
                      label="Subtitle"
                      size="small"
                      fullWidth
                      value={banner.subtitle}
                      disabled={busy}
                      onChange={(e) =>
                        setSideBanners((prev) =>
                          prev.map((item) =>
                            item.id === banner.id
                              ? { ...item, subtitle: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <Box
                      sx={{
                        display: "grid",
                        gap: 1.5,
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      }}
                    >
                      <TextField
                        label="Link"
                        size="small"
                        fullWidth
                        value={banner.href}
                        disabled={busy}
                        onChange={(e) =>
                          setSideBanners((prev) =>
                            prev.map((item) =>
                              item.id === banner.id ? { ...item, href: e.target.value } : item,
                            ),
                          )
                        }
                      />
                      <FormControl size="small" fullWidth>
                        <InputLabel id={`tone-${banner.id}`}>Tone</InputLabel>
                        <Select
                          labelId={`tone-${banner.id}`}
                          label="Tone"
                          value={banner.tone}
                          disabled={busy}
                          onChange={(e) =>
                            setSideBanners((prev) =>
                              prev.map((item) =>
                                item.id === banner.id
                                  ? {
                                      ...item,
                                      tone: e.target.value === "sand" ? "sand" : "forest",
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          <MenuItem value="forest">Forest</MenuItem>
                          <MenuItem value="sand">Sand</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Button
                      component="label"
                      variant="outlined"
                      disabled={busy}
                      sx={{ textTransform: "none", alignSelf: "flex-start" }}
                    >
                      {uploadingKey === `side-${banner.id}`
                        ? "Uploading…"
                        : banner.image
                          ? "Change image"
                          : "Upload image"}
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          void handleImageUpload(e.target.files?.[0], `side-${banner.id}`, (url) =>
                            setSideBanners((prev) =>
                              prev.map((item) =>
                                item.id === banner.id
                                  ? {
                                      ...item,
                                      image: url,
                                      imageAlt: item.imageAlt || item.title,
                                    }
                                  : item,
                              ),
                            ),
                          )
                        }
                      />
                    </Button>
                    {banner.image ? (
                      <Box
                        component="img"
                        src={banner.image}
                        alt=""
                        sx={{
                          width: "100%",
                          maxHeight: 140,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    ) : null}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </SettingsSection>
      </Stack>
    </Box>
  );
}
