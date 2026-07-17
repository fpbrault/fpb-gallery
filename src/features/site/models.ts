export type SocialLink = { name: string; type: string; url: string };

export type SiteMetadata = {
  author: string;
  customDisplayFont?: string;
  customFont?: string;
  customThemeVariables?: {
    dark?: Record<string, string>;
    light?: Record<string, string>;
  };
  description: string;
  siteTitle: string;
  socialLinks: SocialLink[];
  themes: { darkThemeName: string; lightThemeName: string };
};

export type NavigationItem = { slug: string; title: string };

export type HeaderData = {
  pages: NavigationItem[];
  showHome: boolean;
};
