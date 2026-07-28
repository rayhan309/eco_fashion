import mongoose, { type InferSchemaType, type Model, Schema, models } from "mongoose";
import { adminRoles } from "@/lib/validations/admin-user";

const AdminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: adminRoles, required: true },
    passwordHash: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    collection: "admin_users",
  },
);

export type AdminUserDocument = InferSchemaType<typeof AdminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AdminUser: Model<AdminUserDocument> =
  (models.AdminUser as Model<AdminUserDocument> | undefined) ??
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);
