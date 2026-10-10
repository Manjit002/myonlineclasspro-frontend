import Script from "next/script";

/** GA4 measurement ID. Single source — nothing else hard-codes it. */
export const GA_MEASUREMENT_ID = "G-BVYBZV0EYX";

/**
 * Google Analytics 4 (gtag.js).
 *
 * Mounted once in the root layout, so every route — home, all twelve
 * service pages, and the rest of the public site — is covered by one
 * initialisation. Adding it per-page would fire `gtag('config', …)`
 * repeatedly and double-count.
 *
 * Both tags are `afterInteractive`: analytics must not compete with
 * content for the main thread. Order between them doesn't matter —
 * the inline snippet only queues commands onto `dataLayer`, and
 * gtag.js drains that queue whenever it finishes loading, whichever
 * lands first.
 *
 * next/script dedupes by `id`, so client-side navigation re-uses the
 * already-loaded tag instead of injecting a second copy.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        id="ga4-gtag-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
