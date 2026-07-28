export type ProductAttribute = {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  placeholder: string;
};

export const dummyProductAttributes: ProductAttribute[] = [
  {
    id: "attr-size",
    name: "Size",
    nameBn: "সাইজ",
    slug: "size",
    placeholder: "S, M, L, XL",
  },
  {
    id: "attr-weight",
    name: "Weight",
    nameBn: "ওজন",
    slug: "weight",
    placeholder: "500g, 1kg, 2kg",
  },
  {
    id: "attr-color",
    name: "Color",
    nameBn: "রং",
    slug: "color",
    placeholder: "Red, Blue, Green",
  },
  {
    id: "attr-fit",
    name: "Fit",
    nameBn: "ফিট",
    slug: "fit",
    placeholder: "Slim, Regular, Relaxed",
  },
  {
    id: "attr-material",
    name: "Material",
    nameBn: "কাপড়",
    slug: "material",
    placeholder: "Cotton, Linen, Wool",
  },
];
