import { redirect } from "next/navigation";

/** Wishlist lives in the sidebar drawer — keep this route for old links. */
export default function WishlistPage() {
  redirect("/");
}
