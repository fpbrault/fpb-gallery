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
  variable: "--font-sans",
  weight: "variable",
});
export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const sarabun = Sarabun({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
export const amaticSC = Amatic_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "700"],
});
export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["100","300","400", "500", "700"],
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
    selectedFont = roboto
  } else {
    selectedFont = raleway;
  }
 // selectedFont.variable = display ? displayName: sansName;
  return selectedFont;
}
