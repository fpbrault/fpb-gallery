export type SocialLink = { name: string; type: string; url: string };

export type SiteMetadata = {
  author: string;
  description: string;
  siteTitle: string;
  socialLinks: SocialLink[];
};

export type NavigationItem = { slug: string; title: string };

export type HeaderData = {
  pages: NavigationItem[];
  showHome: boolean;
};
