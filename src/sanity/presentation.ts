import {
  defineDocuments,
  defineLocations,
  type DocumentLocationsState,
  type DocumentResolverContext,
  type PresentationPluginOptions
} from "sanity/presentation";

type Location = NonNullable<DocumentLocationsState["locations"]>[number];

const RESERVED_PAGE_SEGMENTS = new Set([
  "_next",
  "_vercel",
  "album",
  "api",
  "blog",
  "category",
  "favicon.ico",
  "gallery",
  "robots.txt",
  "sitemap.xml",
  "studio"
]);

function localizedPath(path: string, language: "en" | "fr") {
  return language === "fr" ? `/fr${path === "/" ? "" : path}` : path;
}

function unavailable(message: string): DocumentLocationsState {
  return { message, tone: "caution" };
}

export function resolveCustomPageDocument({ path }: DocumentResolverContext) {
  const language = path === "/fr" || path.startsWith("/fr/") ? "fr" : "en";
  const localizedPathname = language === "fr" ? path.slice(3) || "/" : path;
  const slug = localizedPathname.replace(/^\//, "").replace(/\/$/, "");

  if (!slug) {
    return {
      filter: `_type == "page" && slug.current == $slug && language == $language`,
      params: { language, slug: "home" }
    };
  }

  if (RESERVED_PAGE_SEGMENTS.has(slug.split("/")[0])) return undefined;

  return {
    filter: `_type == "page" && slug.current == $slug && language == $language`,
    params: { language, slug }
  };
}

export function getPageLocations(
  document: {
    language?: string;
    slug?: string;
    title?: string;
  } | null
): DocumentLocationsState {
  const { language, slug, title } = document ?? {};
  if ((language !== "en" && language !== "fr") || !slug) {
    return unavailable("Add a supported language and slug to preview this page.");
  }
  if (slug !== "home" && RESERVED_PAGE_SEGMENTS.has(slug.split("/")[0])) {
    return unavailable("This slug is reserved by an application route.");
  }

  return {
    locations: [
      {
        title: title || "Untitled page",
        href: localizedPath(slug === "home" ? "/" : `/${slug}`, language)
      }
    ]
  };
}

export function getPostLocations(
  document: {
    slugEn?: string;
    slugFr?: string;
  } | null
): DocumentLocationsState {
  const locations: Location[] = [];
  if (document?.slugEn) {
    locations.push({ title: `Post: ${document.slugEn}`, href: `/blog/${document.slugEn}` });
  }
  if (document?.slugFr) {
    locations.push({
      title: `Article : ${document.slugFr}`,
      href: `/fr/blog/${document.slugFr}`
    });
  }
  if (!locations.length) return unavailable("Add an English or French slug to preview this post.");

  locations.push({ title: "Blog", href: "/blog" }, { title: "Blog (French)", href: "/fr/blog" });
  return { locations };
}

export function getAlbumLocations(
  document: {
    categorySlug?: string;
    images?: Array<{ featured?: boolean }>;
    slug?: string;
    title?: string;
  } | null
): DocumentLocationsState {
  const locations: Location[] = [];
  if (document?.slug) {
    locations.push(
      { title: document.title || "Untitled album", href: `/album/${document.slug}` },
      {
        title: `${document.title || "Untitled album"} (French)`,
        href: `/fr/album/${document.slug}`
      }
    );
  }
  if (document?.categorySlug) {
    locations.push(
      { title: "Category", href: `/category/${document.categorySlug}` },
      { title: "Category (French)", href: `/fr/category/${document.categorySlug}` }
    );
  }
  if ((document?.images?.length ?? 0) > 0) {
    locations.push(
      { title: "All photos", href: "/album/all" },
      { title: "All photos (French)", href: "/fr/album/all" }
    );
  }
  if (document?.images?.some((image) => image.featured)) {
    locations.push(
      { title: "Featured photos", href: "/album/featured" },
      { title: "Featured photos (French)", href: "/fr/album/featured" }
    );
  }

  return locations.length
    ? { locations }
    : unavailable("Add a slug or images to preview this album.");
}

export function getCategoryLocations(
  document: {
    slug?: string;
    title?: string;
  } | null
): DocumentLocationsState {
  if (!document?.slug) return unavailable("Add a slug to preview this category.");

  return {
    locations: [
      { title: document.title || "Untitled category", href: `/category/${document.slug}` },
      {
        title: `${document.title || "Untitled category"} (French)`,
        href: `/fr/category/${document.slug}`
      },
      { title: "Home", href: "/" },
      { title: "Home (French)", href: "/fr" },
      { title: "Gallery", href: "/gallery" },
      { title: "Gallery (French)", href: "/fr/gallery" }
    ]
  };
}

const mainDocuments = defineDocuments([
  {
    route: ["/blog/:slug", "/fr/blog/:slug"],
    filter: `_type == "post" && (slug.current == $slug || slug_fr.current == $slug)`
  },
  {
    route: ["/album/:slug", "/fr/album/:slug"],
    filter: `_type == "album" && slug.current == $slug`
  },
  {
    route: ["/category/:slug", "/fr/category/:slug"],
    filter: `_type == "category" && slug.current == $slug`
  },
  { route: ["/", "/fr"], resolve: resolveCustomPageDocument },
  { route: "/:path*", resolve: resolveCustomPageDocument }
]);

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
  locations: {
    page: defineLocations({
      select: { language: "language", slug: "slug.current", title: "title" },
      resolve: getPageLocations
    }),
    post: defineLocations({
      select: {
        slugEn: "slug.current",
        slugFr: "slug_fr.current"
      },
      resolve: getPostLocations
    }),
    album: defineLocations({
      select: {
        categorySlug: "category->slug.current",
        images: "images",
        slug: "slug.current",
        title: "albumName"
      },
      resolve: getAlbumLocations
    }),
    category: defineLocations({
      select: {
        slug: "slug.current",
        title: "categoryName"
      },
      resolve: getCategoryLocations
    }),
    siteSettings: defineLocations({
      message: "Site settings are used on every page.",
      tone: "positive"
    }),
    pageList: defineLocations({
      message: "The main navigation is used on every page.",
      tone: "positive"
    })
  }
};
