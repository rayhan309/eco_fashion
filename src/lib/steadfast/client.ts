export type SteadfastConfig = {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
};

export type SteadfastCreateOrderPayload = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
  recipient_email?: string;
  alternative_phone?: string;
  item_description?: string;
  total_lot?: number;
  delivery_type?: 0 | 1;
};

export type SteadfastCreateOrderResult = {
  consignmentId: string | number;
  trackingCode: string;
  invoice: string;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/$/, "") || "https://portal.packzy.com/api/v1";
}

function steadfastHeaders(config: SteadfastConfig) {
  return {
    "Api-Key": config.apiKey.trim(),
    "Secret-Key": config.secretKey.trim(),
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function parseSteadfastJsonBody(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function extractSteadfastError(data: unknown, fallback: string) {
  const body = parseSteadfastJsonBody(data);
  if (typeof body.message === "string" && body.message.trim()) {
    return body.message.trim();
  }
  if (typeof body.error === "string" && body.error.trim()) {
    return body.error.trim();
  }
  return fallback;
}

async function parseSteadfastResponse(response: Response) {
  const text = await response.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text.slice(0, 200) || "Invalid Steadfast response");
    }
  }
  return data;
}

export async function steadfastGetBalance(config: SteadfastConfig): Promise<number> {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const response = await fetch(`${baseUrl}/get_balance`, {
    method: "GET",
    headers: steadfastHeaders(config),
    cache: "no-store",
  });

  const data = await parseSteadfastResponse(response);
  const body = parseSteadfastJsonBody(data);

  if (!response.ok || (typeof body.status === "number" && body.status !== 200)) {
    throw new Error(extractSteadfastError(data, "Could not verify Steadfast credentials"));
  }

  const currentBalance = body.current_balance;
  if (typeof currentBalance === "number") return currentBalance;
  if (typeof currentBalance === "string") {
    const parsed = Number(currentBalance);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

export async function steadfastCreateOrder(
  config: SteadfastConfig,
  payload: SteadfastCreateOrderPayload,
): Promise<SteadfastCreateOrderResult> {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const response = await fetch(`${baseUrl}/create_order`, {
    method: "POST",
    headers: steadfastHeaders(config),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await parseSteadfastResponse(response);
  const body = parseSteadfastJsonBody(data);

  if (!response.ok || (typeof body.status === "number" && body.status !== 200)) {
    throw new Error(extractSteadfastError(data, "Steadfast rejected the order"));
  }

  const consignment = parseSteadfastJsonBody(body.consignment ?? body.data);
  const consignmentId = consignment.consignment_id ?? consignment.id;
  const trackingCode = consignment.tracking_code ?? consignment.trackingCode ?? "";

  if (consignmentId == null || consignmentId === "") {
    throw new Error(extractSteadfastError(data, "Steadfast did not return a consignment ID"));
  }

  const normalizedConsignmentId =
    typeof consignmentId === "string" || typeof consignmentId === "number"
      ? consignmentId
      : String(consignmentId);

  return {
    consignmentId: normalizedConsignmentId,
    trackingCode: String(trackingCode),
    invoice: String(consignment.invoice ?? payload.invoice),
  };
}

export async function steadfastGetStatusByCid(
  config: SteadfastConfig,
  consignmentId: string | number,
) {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const response = await fetch(
    `${baseUrl}/status_by_cid/${encodeURIComponent(String(consignmentId))}`,
    {
      method: "GET",
      headers: steadfastHeaders(config),
      cache: "no-store",
    },
  );

  const data = await parseSteadfastResponse(response);
  const body = parseSteadfastJsonBody(data);

  if (!response.ok || (typeof body.status === "number" && body.status !== 200)) {
    throw new Error(extractSteadfastError(data, "Could not load Steadfast history"));
  }

  return data;
}

export type SteadfastFraudCheckResult = {
  total: number;
  delivered: number;
  cancelled: number;
  fraudReportCount: number;
  successRate: number;
  rating: string;
  risk: string;
};

export function parseSteadfastFraudPayload(data: unknown): SteadfastFraudCheckResult {
  const body = parseSteadfastJsonBody(data);
  const total = Number(body.Total_parcels ?? body.total_parcels ?? 0);
  const delivered = Number(body.total_delivered ?? body.Total_delivered ?? 0);
  const cancelled = Number(body.total_cancelled ?? body.Total_cancelled ?? 0);
  const fraudReports = body.total_fraud_reports;
  const fraudReportCount = Array.isArray(fraudReports)
    ? fraudReports.length
    : Number(fraudReports ?? 0);

  const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

  let rating = "New Customer";
  if (total === 0) {
    rating = "New Customer";
  } else if (successRate >= 80 && total >= 10) {
    rating = "Excellent Customer";
  } else if (successRate >= 60) {
    rating = "Good Customer";
  } else if (successRate < 40) {
    rating = "Risky Customer";
  } else {
    rating = "Regular Customer";
  }

  let risk = "unknown";
  if (fraudReportCount > 0 || (total > 0 && successRate < 40)) {
    risk = "high";
  } else if (total > 0 && successRate >= 70) {
    risk = "low";
  } else if (total > 0) {
    risk = "medium";
  }

  return {
    total,
    delivered,
    cancelled,
    fraudReportCount,
    successRate,
    rating,
    risk,
  };
}

export async function steadfastFraudCheck(
  config: SteadfastConfig,
  phone: string,
): Promise<SteadfastFraudCheckResult> {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const normalized = normalizeSteadfastPhone(phone);
  const response = await fetch(
    `${baseUrl}/fraud_check/${encodeURIComponent(normalized)}`,
    {
      method: "GET",
      headers: steadfastHeaders(config),
      cache: "no-store",
    },
  );

  const data = await parseSteadfastResponse(response);
  const body = parseSteadfastJsonBody(data);

  if (!response.ok || (typeof body.status === "number" && body.status !== 200)) {
    throw new Error(extractSteadfastError(data, "Could not load Steadfast customer history"));
  }

  return parseSteadfastFraudPayload(data);
}

export function sanitizeSteadfastInvoice(value: string) {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
  return cleaned.slice(0, 50) || `HU-${Date.now()}`;
}

export function normalizeSteadfastPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length >= 13) {
    return `0${digits.slice(3, 13)}`;
  }
  if (digits.startsWith("88") && digits.length >= 12) {
    return `0${digits.slice(2, 12)}`;
  }
  if (digits.length === 10) {
    return `0${digits}`;
  }
  return digits.slice(0, 11);
}

export function buildSteadfastAddress(parts: Array<string | undefined | null>) {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ")
    .slice(0, 250);
}
