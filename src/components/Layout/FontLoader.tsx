import {
  Raleway,
  Montserrat,
  Inter,
  Nunito,
  Comfortaa,
  Rokkitt,
  Josefin_Sans,
  DM_Sans,
  Space_Grotesk,
  Dosis,
  Libre_Franklin,
  Vollkorn
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
export const rokkitt = Rokkitt({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
});
export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
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
export const dosis = Dosis({
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
export const vollkorn = Vollkorn({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: "variable",
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
  } else if (fontName === "rokkitt") {
    selectedFont = rokkitt;
  } else if (fontName === "josefinSans") {
    selectedFont = josefinSans;
  } else if (fontName === "dmSans") {
    selectedFont = dmSans;
  } else if (fontName === "spaceGrotesk") {
    selectedFont = spaceGrotesk;
  } else if (fontName === "dosis") {
    selectedFont = dosis;
  } else if (fontName === "libreFranklin") {
    selectedFont = libreFranklin;
  } else if (fontName === "vollkorn") {
    selectedFont = vollkorn
  } else {
    selectedFont = raleway;
  }
 // selectedFont.variable = display ? displayName: sansName;
  return selectedFont;
}
