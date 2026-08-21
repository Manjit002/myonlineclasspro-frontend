import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Footer } from "@/components/layout/footer";
import { StructuredData } from "@/components/structured-data";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { LiveChat } from "@/components/layout/live-chat";
import "./globals.css";

// Self-hosted via next/font/local rather than next/font/google: this
// sandbox's network policy doesn't allow build-time requests to
// fonts.googleapis.com, but self-hosting is arguably the stronger choice
// for production anyway -- zero third-party font requests, and the exact
// same preloading/font-display/CLS-prevention behavior next/font
// provides for Google-hosted fonts applies equally to local files.
const bebasNeue = localFont({
  src: "../assets/fonts/bebas-neue-400.woff2",
  variable: "--font-bebas-neue",
  weight: "400",
  display: "swap",
});

const plusJakarta = localFont({
  src: "../assets/fonts/plus-jakarta-sans-variable.woff2",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

const siteUrl = "https://myonlineclasspro.com";
const siteName = "MyOnlineClassPro";
const siteDescription =
  "Expert academic support for online classes, assignments, and exams -- built around real experts, transparent pricing, and guaranteed results.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Online Class Help & Academic Support`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | Online Class Help & Academic Support`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Online Class Help & Academic Support`,
    description: siteDescription,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04080f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Zoho SalesIQ requires this global to exist before its widget
            script runs. Emitted here so it is present in the server HTML
            and executes ahead of the deferred widget load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};",
          }}
        />
      </head>
      <body className="bg-bg-0 text-text-primary flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Lets keyboard users jump past the nav straight to content.
              Visually hidden until focused, which is the standard
              treatment -- present for those who need it, invisible to
              everyone else. */}
          <a
            href="#main-content"
            className="focus:bg-gold focus:text-gold-foreground sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold"
          >
            Skip to content
          </a>

          <StructuredData />
          <SiteChrome>
            <Navbar />
            <div className="nav-spacer" aria-hidden />
          </SiteChrome>
          <div id="main-content" className="flex flex-1 flex-col">
            {children}
          </div>
          <SiteChrome>
            <Footer />
            <WhatsAppButton />
            <LiveChat />
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
