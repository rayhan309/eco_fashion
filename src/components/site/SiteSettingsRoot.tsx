"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { trackPixelEvent } from "@/lib/pixel/track";

type SiteSettingsRootProps = {
  children: ReactNode;
};

export function SiteSettingsRoot({ children }: SiteSettingsRootProps) {
  const settings = useSiteSettings();
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  const metaOn = settings.metaPixelEnabled && Boolean(settings.metaPixelId.trim());
  const tiktokOn = settings.tiktokPixelEnabled && Boolean(settings.tiktokPixelId.trim());

  useEffect(() => {
    if (!metaOn && !tiktokOn && !settings.metaCapiEnabled && !settings.tiktokCapiEnabled) {
      return;
    }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // Wait briefly so Meta/TikTok scripts can install their stubs.
    const timer = window.setTimeout(() => {
      void trackPixelEvent({ eventName: "PageView" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    pathname,
    metaOn,
    tiktokOn,
    settings.metaCapiEnabled,
    settings.tiktokCapiEnabled,
  ]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
  --eco-primary: ${settings.primaryColor};
  --eco-primary-hover: ${settings.primaryColorHover};
  --eco-primary-dark: ${settings.primaryColorDark};
  --eco-primary-soft: ${settings.primaryColorSoft};
  --eco-primary-border: ${settings.primaryColorBorder};
}`,
        }}
      />

      {metaOn ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${settings.metaPixelId.trim()}');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(settings.metaPixelId.trim())}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}

      {tiktokOn ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;
e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
ttq.load('${settings.tiktokPixelId.trim()}');}(window,document,'ttq');`}
        </Script>
      ) : null}

      {children}
    </>
  );
}
