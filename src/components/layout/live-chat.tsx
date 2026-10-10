"use client";

import Script from "next/script";

/**
 * Live chat widget (Zoho SalesIQ), bottom-right.
 *
 * Uses the same SalesIQ instance already configured on the live site,
 * so existing operators and chat history carry over.
 *
 * The `$zoho.salesiq` stub this widget depends on is emitted directly
 * in the document head (see app/layout.tsx) rather than as a second
 * Script here: two afterInteractive scripts have no guaranteed order
 * relative to each other, and the widget throws if the global is
 * missing when it runs.
 *
 * next/script dedupes by `id`, so client-side navigation re-uses the
 * already-loaded widget instead of injecting a second launcher -- the
 * specific failure a raw <script> tag in JSX would hit.
 */
export function LiveChat() {
  return (
    <Script
      id="zsiqscript"
      strategy="afterInteractive"
      src="https://salesiq.zohopublic.in/widget?wc=siqb0ab1d4674df9b8cc6a6cfb33efd9886885c19169b04212091b44defc88b620e"
    />
  );
}
