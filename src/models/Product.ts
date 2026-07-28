import mongoose, { type InferSchemaType, type Model, Schema, models } from "mongoose";
import {
  productTypes,
  shippingClasses,
  stockStatuses,
} from "@/lib/validations/product";

const ProductVariantSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    regularPrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    stockQuantity: { type: Number, default: 0 },
    stockStatus: { type: String, enum: stockStatuses, default: "in_stock" },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brandVendor: { type: String, default: "" },
    description: { type: String, default: "" },
    productType: { type: String, enum: productTypes, default: "regular" },
    regularPrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    discountPercent: { type: Number, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    stockStatus: { type: String, enum: stockStatuses, default: "in_stock" },
    variants: { type: [ProductVariantSchema], default: [] },
    categoryId: { type: String, required: true },
    categorySlug: { type: String, default: "" },
    categoryTitle: { type: String, default: "" },
    shippingClass: { type: String, enum: shippingClasses, default: "standard" },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    mainImageUrl: { type: String, default: "" },
    galleryUrls: { type: [String], default: [] },
    variableAttributeId: { type: String, default: "" },
    variableOptionsText: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "products",
  },
);

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ProductModel: Model<ProductDocument> =
  (models.Product as Model<ProductDocument> | undefined) ??
  mongoose.model<ProductDocument>("Product", ProductSchema);
