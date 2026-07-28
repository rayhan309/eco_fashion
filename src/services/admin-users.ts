import { api } from "@/lib/axios";
import {
  adminUserPublicSchema,
  type AdminUserPublic,
} from "@/lib/validations/admin-user";
import { z } from "zod";

const listSchema = z.object({
  users: z.array(adminUserPublicSchema),
});

const oneSchema = z.object({
  user: adminUserPublicSchema,
});

export async function fetchAdminUsers(): Promise<AdminUserPublic[]> {
  const { data } = await api.get("/api/admin/users");
  return listSchema.parse(data).users;
}

export async function createAdminUser(payload: {
  email: string;
  name: string;
  password: string;
  role: "shop_manager" | "moderator";
}): Promise<AdminUserPublic> {
  const { data } = await api.post("/api/admin/users", payload);
  return oneSchema.parse(data).user;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete("/api/admin/users", { params: { id } });
}
