export const presentationConfig = {
  fonts: {
    body: "raleway",
    display: "raleway",
    cssVariable: "--font-site"
  },
  themes: {
    dark: "mytheme",
    light: "light",
    storageKey: "theme"
  }
} as const;

export type ThemeName =
  typeof presentationConfig.themes.dark | typeof presentationConfig.themes.light;

export const isThemeName = (value: string | null | undefined): value is ThemeName =>
  value === presentationConfig.themes.dark || value === presentationConfig.themes.light;

export const resolveTheme = (storedTheme: string | null, prefersDark: boolean): ThemeName => {
  if (isThemeName(storedTheme)) return storedTheme;
  return prefersDark ? presentationConfig.themes.dark : presentationConfig.themes.light;
};

export const createThemeInitializationScript = () => {
  const dark = JSON.stringify(presentationConfig.themes.dark);
  const light = JSON.stringify(presentationConfig.themes.light);
  const storageKey = JSON.stringify(presentationConfig.themes.storageKey);

  return `(() => {const dark=${dark};const light=${light};const key=${storageKey};const preferred=matchMedia('(prefers-color-scheme: dark)').matches?dark:light;let stored=null;try{stored=localStorage.getItem(key);}catch{}const theme=stored===dark||stored===light?stored:preferred;document.documentElement.dataset.theme=theme;try{if(stored!==theme)localStorage.setItem(key,theme);}catch{}})();`;
};
