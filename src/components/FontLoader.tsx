import {
  Raleway,
  Montserrat,
  Inter,
  Nunito,
  Comfortaa,
  Sarabun,
  Amatic_SC,
  DM_Sans,
  Space_Grotesk,
  Work_Sans,
  Libre_Franklin,
  Roboto
} from "next/font/google";

export const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const sarabun = Sarabun({
  weight: "600",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const amaticSC = Amatic_SC({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});
export const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export function getFontFamily(fontName: string): any {
  let selectedFont = null;

  if (fontName === "raleway") {
    selectedFont = raleway;
  } else if (fontName === "montserrat") {
    selectedFont = montserrat;
  } else if (fontName === "inter") {
    selectedFont = inter;
  } else if (fontName === "nunito") {
    selectedFont = nunito;
  } else if (fontName === "comfortaa") {
    selectedFont = comfortaa;
  } else if (fontName === "sarabun") {
    selectedFont = sarabun;
  } else if (fontName === "amaticSC") {
    selectedFont = amaticSC;
  } else if (fontName === "dmSans") {
    selectedFont = dmSans;
  } else if (fontName === "spaceGrotesk") {
    selectedFont = spaceGrotesk;
  } else if (fontName === "workSans") {
    selectedFont = workSans;
  } else if (fontName === "libreFranklin") {
    selectedFont = libreFranklin;
  } else if (fontName === "roboto") {
    selectedFont = roboto;
  } else {
    selectedFont = raleway;
  }
  return selectedFont;
}
