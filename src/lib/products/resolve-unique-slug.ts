import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import { slugifyTitle } from "@/lib/validations/product";
import { ProductModel } from "@/models/Product";

async function slugExists(slug: string): Promise<boolean> {
  const inAdminProducts = await ProductModel.exists({ slug });
  if (inAdminProducts) return true;

  const CatalogProduct = getSeedModel("catalog_products");
  const inCatalog = await CatalogProduct.exists({ slug });
  return Boolean(inCatalog);
}

/** If slug is taken, returns `base`, `base-1`, `base-2`, … */
export async function resolveUniqueProductSlug(
  requestedSlug: string,
  titleEn: string,
): Promise<string> {
  await dbConnect();

  const base =
    (requestedSlug.trim() || slugifyTitle(titleEn)).replace(/-+\d+$/, "") ||
    slugifyTitle(titleEn) ||
    "product";

  let suffix = 0;
  while (suffix < 500) {
    const slug = suffix === 0 ? base : `${base}-${suffix}`;
    if (!(await slugExists(slug))) return slug;
    suffix += 1;
  }

  throw new Error("Could not generate a unique slug");
}
