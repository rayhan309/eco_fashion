import { redirect } from "next/navigation";

export default function AccountWishlistRedirectPage() {
  redirect("/account?tab=wishlist");
}
