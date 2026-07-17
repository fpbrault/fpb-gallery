import "../../styles/globals.css";
import "yet-another-react-lightbox/styles.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getSiteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};

const themeScript = `(() => {try {const saved=localStorage.getItem('theme');if(saved) document.documentElement.dataset.theme=saved;} catch {}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-fpb-locale") ?? "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
