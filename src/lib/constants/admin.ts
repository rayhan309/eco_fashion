import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: SvgIconComponent;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: DashboardOutlinedIcon },
  { label: "Products", href: "/dashboard/admin/products", icon: Inventory2OutlinedIcon },
  { label: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBagOutlinedIcon },
  { label: "Categories", href: "/dashboard/admin/categories", icon: CategoryOutlinedIcon },
  { label: "Collections", href: "/dashboard/admin/collections", icon: ViewCarouselOutlinedIcon },
  { label: "Customers", href: "/dashboard/admin/customers", icon: PeopleOutlineOutlinedIcon },
  { label: "Settings", href: "/dashboard/admin/settings", icon: SettingsOutlinedIcon },
];

export const ADMIN_SIDEBAR_WIDTH = 260;
export const ADMIN_TOPBAR_HEIGHT = 64;
