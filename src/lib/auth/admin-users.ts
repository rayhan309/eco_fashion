import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import { AdminUser, type AdminUserDocument } from "@/models/AdminUser";
import { hashPassword } from "@/lib/auth/password";

export function toPublicAdminUser(doc: AdminUserDocument) {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function getAdminUserModel() {
  await dbConnect();
  return AdminUser;
}

/** Creates the first Super Admin from env if none exists. */
export async function ensureSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";

  if (!email || !password) {
    throw new Error(
      "Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD to seed the Super Admin.",
    );
  }

  const User = await getAdminUserModel();
  const existing = await User.findOne({ role: "super_admin" });
  if (existing) {
    return toPublicAdminUser(existing);
  }

  const passwordHash = await hashPassword(password);
  const created = await User.create({
    email,
    name,
    role: "super_admin",
    passwordHash,
  });

  return toPublicAdminUser(created);
}

export async function findAdminUserByEmail(email: string) {
  const User = await getAdminUserModel();
  return User.findOne({ email: email.trim().toLowerCase() });
}

export async function findAdminUserByEmailWithPassword(email: string) {
  const User = await getAdminUserModel();
  return User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
}

export async function listAdminUsers() {
  const User = await getAdminUserModel();
  return User.find({}).sort({ createdAt: -1 });
}

export async function createAdminUserRecord(payload: {
  email: string;
  name: string;
  role: "shop_manager" | "moderator";
  passwordHash: string;
}) {
  const User = await getAdminUserModel();
  return User.create(payload);
}

export async function findAdminUserById(id: string) {
  const User = await getAdminUserModel();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findById(id);
}

export async function deleteAdminUserById(id: string) {
  const User = await getAdminUserModel();
  return User.findByIdAndDelete(id);
}
