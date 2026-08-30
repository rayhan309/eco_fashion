"use client";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { Box, Tooltip, Typography } from "@mui/material";

type SteadfastConsignmentBadgeProps = {
  consignmentId: string | number;
  compact?: boolean;
  onCopied?: () => void;
};

export function SteadfastConsignmentBadge({
  consignmentId,
  compact = false,
  onCopied,
}: SteadfastConsignmentBadgeProps) {
  const label = String(consignmentId);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(label);
      onCopied?.();
    } catch {
      /* ignore */
    }
  }

  return (
    <Tooltip title="Copy consignment ID">
      <Box
        component="button"
        type="button"
        onClick={handleCopy}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: compact ? 1 : 1.25,
          py: compact ? 0.35 : 0.5,
          border: "1px solid #bbf7d0",
          borderRadius: 999,
          bgcolor: "#ecfdf5",
          color: "#15803d",
          cursor: "pointer",
          maxWidth: compact ? 120 : 160,
          ml: compact ? 0 : 0.5,
          mr: compact ? 0 : 0.5,
          "&:hover": {
            bgcolor: "#dcfce7",
          },
        }}
      >
        <ContentCopyRoundedIcon sx={{ fontSize: compact ? 13 : 14, flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: compact ? "0.68rem" : "0.75rem",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
}
