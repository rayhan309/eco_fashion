import type { SiteSettings } from "@/types/site-settings";
import type { SteadfastConfig } from "@/lib/steadfast/client";

export type ResolvedSteadfastConfig = SteadfastConfig & {
  enabled: boolean;
  source: {
    apiKey: "db" | "env" | "missing";
    secretKey: "db" | "env" | "missing";
    baseUrl: "db" | "env" | "default";
  };
};

export function resolveSteadfastConfig(settings: SiteSettings): ResolvedSteadfastConfig {
  const dbApiKey = settings.steadfastApiKey.trim();
  const dbSecretKey = settings.steadfastSecretKey.trim();
  const dbBaseUrl = settings.steadfastBaseUrl.trim();

  const envApiKey = process.env.STEADFAST_API_KEY?.trim() ?? "";
  const envSecretKey = process.env.STEADFAST_SECRET_KEY?.trim() ?? "";
  const envBaseUrl = process.env.STEADFAST_BASE_URL?.trim() ?? "";

  const apiKey = dbApiKey || envApiKey;
  const secretKey = dbSecretKey || envSecretKey;
  const baseUrl =
    dbBaseUrl || envBaseUrl || "https://portal.packzy.com/api/v1";

  return {
    enabled: settings.steadfastEnabled,
    apiKey,
    secretKey,
    baseUrl,
    source: {
      apiKey: dbApiKey ? "db" : envApiKey ? "env" : "missing",
      secretKey: dbSecretKey ? "db" : envSecretKey ? "env" : "missing",
      baseUrl: dbBaseUrl ? "db" : envBaseUrl ? "env" : "default",
    },
  };
}

export function assertSteadfastReady(config: ResolvedSteadfastConfig) {
  if (!config.enabled) {
    throw new Error("Steadfast is disabled. Enable it in Settings → Steadfast.");
  }
  if (!config.apiKey || !config.secretKey) {
    throw new Error(
      "Steadfast API credentials are missing. Save API key and secret key in Settings → Steadfast, or set STEADFAST_API_KEY and STEADFAST_SECRET_KEY in .env.",
    );
  }
}
