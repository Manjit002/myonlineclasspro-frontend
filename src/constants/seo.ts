/**
 * Shared Open Graph / Twitter defaults.
 *
 * A page-level `openGraph` or `twitter` object REPLACES the root
 * layout's wholesale — it does not merge — so any page defining its own
 * silently loses siteName, locale, type and images. Spreading these
 * keeps every page complete without repeating the values by hand.
 *
 * Values carried over from the old HTML <head>.
 */
import type { Metadata } from "next";

export const OG_IMAGE = {
  url: "https://img.myonlineclasspro.com/photos/my%20online%20class%20pro%20png%204.png",
  width: 1200,
  height: 630,
  alt: "MyOnlineClassPro",
};

export const OG_DEFAULTS: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "en_US",
  siteName: "MyOnlineClassPro",
  images: [OG_IMAGE],
};

export const TWITTER_DEFAULTS: NonNullable<Metadata["twitter"]> = {
  card: "summary_large_image",
  site: "@MyOnlineClassPro",
  images: [OG_IMAGE.url],
};
