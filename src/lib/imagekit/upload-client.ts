const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function assertImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 10MB or smaller");
  }
}

type ImageKitAuth = {
  token: string;
  expire: number;
  signature: string;
};

type ImageKitUploadResponse = {
  url?: string;
  message?: string;
};

export async function uploadImageToImageKit(
  file: File,
  folder = "/hidden-urban/products",
): Promise<string> {
  assertImageFile(file);

  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not set");
  }

  const authRes = await fetch("/api/products/imagekit-auth", { credentials: "include" });
  if (!authRes.ok) {
    const body = (await authRes.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to get ImageKit upload credentials");
  }

  const authData = (await authRes.json()) as ImageKitAuth;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("signature", authData.signature);
  formData.append("expire", String(authData.expire));
  formData.append("token", authData.token);
  formData.append("useUniqueFileName", "true");
  formData.append("folder", folder);

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as ImageKitUploadResponse;
  if (!response.ok || !result.url) {
    throw new Error(result.message ?? "Image upload failed");
  }

  return result.url;
}
