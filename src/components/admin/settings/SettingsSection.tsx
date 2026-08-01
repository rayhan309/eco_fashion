import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type SettingsSectionProps = {
  title: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  headerAction,
  children,
}: SettingsSectionProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</Typography>
          {description ? (
            <Typography sx={{ mt: 0.35, fontSize: "0.85rem", color: "text.secondary" }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {headerAction ?? null}
      </Box>
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>{children}</Box>
    </Box>
  );
}

type SettingsPageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function SettingsPageHeader({ title, description, action }: SettingsPageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 2.5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "flex-start" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.4rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary", maxWidth: 640 }}>
          {description}
        </Typography>
      </Box>
      {action ?? null}
    </Box>
  );
}
