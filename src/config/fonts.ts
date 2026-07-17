import { Raleway } from "next/font/google";

import { presentationConfig } from "@/config/presentation";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  // next/font requires this option to remain an inline literal.
  variable: "--font-site",
  weight: "variable"
});

const configuredFonts = { raleway } satisfies Record<
  (typeof presentationConfig.fonts)["body" | "display"],
  typeof raleway
>;

export const bodyFont = configuredFonts[presentationConfig.fonts.body];
export const displayFont = configuredFonts[presentationConfig.fonts.display];
