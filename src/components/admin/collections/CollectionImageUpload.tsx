"use client";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRef } from "react";
import { ADMIN_ACCENT } from "@/lib/constants/admin";

type CollectionImageUploadProps = {
  previewUrl?: string;
  uploading?: boolean;
  onPick: (file: File) => void;
};

export function CollectionImageUpload({
  previewUrl,
  uploading,
  onPick,
}: CollectionImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      <Typography sx={{ mb: 1, fontSize: "0.85rem", fontWeight: 600 }}>Cover image</Typography>
      <Box
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (uploading) return;
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        sx={{
          border: "1px dashed",
          borderColor: "rgba(0,0,0,0.15)",
          borderRadius: 1.5,
          bgcolor: "#fafafa",
          p: 2,
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          opacity: uploading ? 0.7 : 1,
          "&:hover": { borderColor: ADMIN_ACCENT, bgcolor: "rgba(31,111,91,0.04)" },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPick(file);
            event.target.value = "";
          }}
        />
        {previewUrl ? (
          <Box sx={{ position: "relative", width: "100%", height: 120, borderRadius: 1, overflow: "hidden" }}>
            <Image src={previewUrl} alt="" fill style={{ objectFit: "cover" }} />
          </Box>
        ) : uploading ? (
          <>
            <CircularProgress size={28} sx={{ color: ADMIN_ACCENT, mb: 1 }} />
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Uploading…</Typography>
          </>
        ) : (
          <>
            <CloudUploadOutlinedIcon sx={{ color: ADMIN_ACCENT, mb: 1 }} />
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>Upload cover image</Typography>
            <Typography sx={{ mt: 0.5, fontSize: "0.75rem", color: "text.secondary" }}>
              PNG, JPG up to 10MB · stored on ImageKit
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
