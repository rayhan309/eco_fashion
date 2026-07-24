export type Category = {
  id: string;
  title: string;
  slug: string;
  image: string;
  rating: number;
};

/** Same shape expected from a future database / API response */
export type CategoryRecord = Category;
