import type { HomePageData } from "@/lib/data/home";
import type { AdminOverviewData } from "@/services/admin";
import type { AdminCustomersData } from "@/services/admin-customers";
import type { AdminProductsCatalog } from "@/services/admin-products";
import type { AdminOrder } from "@/data/dummy/admin-orders";
import type { AdminCategory } from "@/types/admin-category";
import type { ProductAttribute } from "@/data/dummy/product-attributes";
import type { Collection } from "@/types/collection";
import type { PublicSiteSettings } from "@/types/site-settings";
import { api } from "@/lib/axios";

export async function fetchSiteSettings(): Promise<PublicSiteSettings> {
  const { data } = await api.get<PublicSiteSettings>("/api/store/settings");
  return data;
}

export async function fetchHomePageData(): Promise<HomePageData> {
  const { data } = await api.get<HomePageData>("/api/store/home");
  return data;
}

export async function fetchAdminOverviewData(): Promise<AdminOverviewData> {
  const { data } = await api.get<AdminOverviewData>("/api/admin/overview");
  return data;
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const { data } = await api.get<AdminOrder[]>("/api/admin/orders");
  return data;
}

export async function fetchAdminProductsCatalog(): Promise<AdminProductsCatalog> {
  const { data } = await api.get<AdminProductsCatalog>("/api/admin/products-catalog");
  return data;
}

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const { data } = await api.get<AdminCategory[]>("/api/admin/categories");
  return data;
}

export async function fetchAdminCustomers(): Promise<AdminCustomersData> {
  const { data } = await api.get<AdminCustomersData>("/api/admin/customers");
  return data;
}

export async function fetchProductAttributes(): Promise<ProductAttribute[]> {
  const { data } = await api.get<ProductAttribute[]>("/api/admin/product-attributes");
  return data;
}

export async function fetchAdminCollections(): Promise<Collection[]> {
  const { data } = await api.get<Collection[]>("/api/admin/collections");
  return data;
}
