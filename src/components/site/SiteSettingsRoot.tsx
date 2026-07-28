"use client";

import Script from "next/script";
import type { ReactNode } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type SiteSettingsRootProps = {
  children: ReactNode;
};

export function SiteSettingsRoot({ children }: SiteSettingsRootProps) {
  const settings = useSiteSettings();

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
      {settings.metaPixelEnabled && settings.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${settings.metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {children}
    </>
  );
}
