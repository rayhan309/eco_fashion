import { createHash } from "node:crypto";

/** Meta / TikTok require SHA-256 hex of normalized PII. */
export function hashSha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Keep digits only; BD local numbers get a leading country hint when short. */
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) {
    digits = `880${digits.slice(1)}`;
  }
  return digits;
}

export function hashEmail(email: string | undefined): string | undefined {
  if (!email?.trim()) return undefined;
  return hashSha256(normalizeEmail(email));
}

export function hashPhone(phone: string | undefined): string | undefined {
  if (!phone?.trim()) return undefined;
  const normalized = normalizePhone(phone);
  if (!normalized) return undefined;
  return hashSha256(normalized);
}

export function hashName(name: string | undefined): string | undefined {
  if (!name?.trim()) return undefined;
  return hashSha256(name.trim().toLowerCase());
}
