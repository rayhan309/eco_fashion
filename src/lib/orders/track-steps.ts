import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { ADMIN_ORDER_STATUS_LABELS, type AdminOrderStatus } from "@/types/admin-order";

const TRACK_STEPS = [
  "new_order",
  "order_confirmed",
  "entered_steadfast",
  "out_for_delivery",
  "delivered",
] as const;

type TrackStepStatus = (typeof TRACK_STEPS)[number];

const STEP_META: Record<TrackStepStatus, { description: string; icon: SvgIconComponent }> = {
  new_order: {
    description: "We received your order and will review it shortly.",
    icon: Inventory2OutlinedIcon,
  },
  order_confirmed: {
    description: "Your order is confirmed and being prepared.",
    icon: AssignmentTurnedInOutlinedIcon,
  },
  entered_steadfast: {
    description: "Handed over to courier for dispatch.",
    icon: LocalShippingOutlinedIcon,
  },
  out_for_delivery: {
    description: "Your parcel is on the way to you.",
    icon: LocalShippingOutlinedIcon,
  },
  delivered: {
    description: "Delivered successfully. Enjoy your purchase!",
    icon: HomeOutlinedIcon,
  },
};

export function getTrackStepIndex(status: AdminOrderStatus): number {
  if (status === "cancelled" || status === "scammer_fraudulent") return -1;
  if (status === "no_response" || status === "will_inform_later" || status === "follow_up_needed") {
    return 1;
  }
  const index = (TRACK_STEPS as readonly string[]).indexOf(status);
  return index >= 0 ? index : 0;
}

export function getTrackSteps() {
  return TRACK_STEPS.map((status) => ({
    status,
    label: ADMIN_ORDER_STATUS_LABELS[status],
    description: STEP_META[status].description,
    icon: STEP_META[status].icon,
  }));
}

export { ADMIN_ORDER_STATUS_LABELS };
