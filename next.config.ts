import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The six legal pages moved from the old flat URLs to /legal/*.
   * These were live, indexed URLs on the old site, so each gets a
   * permanent redirect to its exact equivalent — one hop, no chains,
   * and never to the homepage.
   */
  async redirects() {
    const legal = [
      "privacy",
      "terms",
      "cookie-policy",
      "payment-refund-policy",
      "complaints-policy",
      "consumer-feedback",
    ];
    return legal.map((slug) => ({
      source: `/${slug}`,
      destination: `/legal/${slug}`,
      permanent: true,
    }));
  },

  images: {
    // next/image refuses remote hosts that aren't declared, which is a
    // deliberate safety default -- otherwise the optimizer could be
    // pointed at arbitrary URLs. Each host below corresponds to an image
    // carried over from the original homepage.
    remotePatterns: [
      // Self-hosted assets now served from the img subdomain.
      { protocol: "https", hostname: "img.myonlineclasspro.com" },
      // Kept alongside it: harmless, and it keeps existing URLs working
      // during the DNS cutover rather than breaking images mid-switch.
      { protocol: "https", hostname: "myonlineclasspro.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "quincycollege.edu" },
      { protocol: "https", hostname: "www.collegeworks.org" },
      { protocol: "https", hostname: "marcom.purdue.edu" },
      { protocol: "https", hostname: "njbmagazine.com" },
      { protocol: "https", hostname: "www.asurams.edu" },
      { protocol: "https", hostname: "youredc.com" },
      { protocol: "https", hostname: "ctstate.edu" },
      { protocol: "https", hostname: "mma.prnewswire.com" },
      { protocol: "https", hostname: "studycrumb.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "hirecoursenerds.com" },
    ],
  },
};

export default nextConfig;
