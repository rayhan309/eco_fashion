export type PixelEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

export type PixelContentItem = {
  id: string;
  quantity: number;
  item_price: number;
};

export type PixelEventPayload = {
  eventName: PixelEventName;
  eventId: string;
  eventSourceUrl?: string;
  value?: number;
  currency?: string;
  contentIds?: string[];
  contents?: PixelContentItem[];
  contentType?: string;
  contentName?: string;
  numItems?: number;
  orderId?: string;
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  browser?: {
    fbp?: string;
    fbc?: string;
    ttp?: string;
    ttclid?: string;
    clientUserAgent?: string;
    clientIpAddress?: string;
  };
};

export type OrderTrackingContext = {
  eventId: string;
  fbp?: string;
  fbc?: string;
  ttp?: string;
  ttclid?: string;
  eventSourceUrl?: string;
  clientUserAgent?: string;
};
