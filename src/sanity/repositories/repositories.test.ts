// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sanityFetch: vi.fn(),
  clientFetch: vi.fn(),
  mapPostList: vi.fn(),
  mapPostSummaries: vi.fn(),
  mapLatestPost: vi.fn(),
  mapPostPage: vi.fn(),
  mapCategories: vi.fn(),
  mapAlbums: vi.fn(),
  mapAlbum: vi.fn(),
  mapImageCollection: vi.fn(),
  mapPage: vi.fn(),
  mapSiteMetadata: vi.fn(),
  mapHeaderData: vi.fn()
}));

vi.mock("server-only", () => ({}));
vi.mock("@/sanity/lib/live", () => ({ sanityFetch: mocks.sanityFetch }));
vi.mock("@/sanity/lib/client", () => ({
  getSanityClient: () => ({ fetch: mocks.clientFetch })
}));
vi.mock("@/features/blog/blogMapper", () => ({
  mapPostList: mocks.mapPostList,
  mapPostSummaries: mocks.mapPostSummaries,
  mapLatestPost: mocks.mapLatestPost,
  mapPostPage: mocks.mapPostPage
}));
vi.mock("@/features/albums/albumMapper", () => ({
  mapCategories: mocks.mapCategories,
  mapAlbums: mocks.mapAlbums,
  mapAlbum: mocks.mapAlbum,
  mapImageCollection: mocks.mapImageCollection
}));
vi.mock("@/features/pages/pageMapper", () => ({ mapPage: mocks.mapPage }));
vi.mock("@/features/site/siteMapper", () => ({
  mapSiteMetadata: mocks.mapSiteMetadata,
  mapHeaderData: mocks.mapHeaderData
}));

import {
  getLatestPost,
  getNextCursor,
  getPost,
  getPosts,
  getPostsAfter,
  getPostSlugs
} from "@/sanity/repositories/blogRepository";
import {
  getAlbum,
  getAlbumSlugs,
  getAllImages,
  getCategories,
  getCategory,
  getCategorySlugs,
  getFeaturedImages
} from "@/sanity/repositories/albumRepository";
import { getPage, getPageSlugs } from "@/sanity/repositories/pageRepository";
import { getSiteShellData } from "@/sanity/repositories/siteRepository";
import {
  ALBUM_QUERY,
  ALBUM_SLUGS_QUERY,
  ALL_IMAGES_QUERY,
  CATEGORY_INDEX_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
  FEATURED_IMAGES_QUERY,
  HEADER_QUERY,
  LATEST_POST_QUERY,
  PAGE_QUERY,
  PAGE_SLUGS_QUERY,
  POST_CURSOR_QUERY,
  POST_LIST_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
  SITE_METADATA_QUERY
} from "@/sanity/queries";
import { encodeBlogCursor } from "@/lib/pagination";

describe("Sanity repositories", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("blogRepository", () => {
    it("queries and maps the first blog page with a server-generated cursor", async () => {
      const raw = { posts: "raw" };
      const mapped = {
        posts: [{ id: "post-1", publishDate: "2026-07-17T00:00:00.000Z" }],
        totalCount: 4
      };
      mocks.sanityFetch.mockResolvedValue({ data: raw });
      mocks.mapPostList.mockReturnValue(mapped);

      await expect(getPosts("fr", 5)).resolves.toEqual({
        ...mapped,
        nextCursor: encodeBlogCursor({
          id: "post-1",
          publishDate: "2026-07-17T00:00:00.000Z"
        })
      });
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: POST_LIST_QUERY,
        params: { locale: "fr", limit: 5 },
        tags: ["posts"]
      });
      expect(mocks.mapPostList).toHaveBeenCalledWith(raw);
    });

    it("passes opaque cursor fields into the cursor query", async () => {
      const raw = [{ _id: "post-2" }];
      const mapped = [{ id: "post-2" }];
      mocks.sanityFetch.mockResolvedValue({ data: raw });
      mocks.mapPostSummaries.mockReturnValue(mapped);

      await expect(
        getPostsAfter(
          "en",
          { id: "post-1", publishDate: "2026-07-17T00:00:00.000Z" },
          3
        )
      ).resolves.toBe(mapped);
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: POST_CURSOR_QUERY,
        params: {
          locale: "en",
          cursorDate: "2026-07-17T00:00:00.000Z",
          cursorId: "post-1",
          limit: 3
        },
        tags: ["posts"]
      });
    });

    it("queries latest and individual posts with the correct contracts", async () => {
      const latest = { id: "latest" };
      const post = { current: { id: "post-1" } };
      mocks.sanityFetch
        .mockResolvedValueOnce({ data: "latest-raw" })
        .mockResolvedValueOnce({ data: "post-raw" });
      mocks.mapLatestPost.mockReturnValue(latest);
      mocks.mapPostPage.mockReturnValue(post);

      await expect(getLatestPost("fr")).resolves.toBe(latest);
      await expect(getPost("hello", "en")).resolves.toBe(post);

      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(1, {
        query: LATEST_POST_QUERY,
        params: { locale: "fr" },
        tags: ["posts"]
      });
      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(2, {
        query: POST_QUERY,
        params: { slug: "hello", locale: "en" },
        tags: ["posts"]
      });
    });

    it("normalizes generated post slugs", async () => {
      mocks.clientFetch.mockResolvedValue([
        { slug: "hello", slugFr: "bonjour" },
        { slug: null, slugFr: "seulement-fr" }
      ]);

      await expect(getPostSlugs()).resolves.toEqual([
        { slug: "hello", slugFr: "bonjour" },
        { slug: undefined, slugFr: "seulement-fr" }
      ]);
      expect(mocks.clientFetch).toHaveBeenCalledWith(POST_SLUGS_QUERY);
    });

    it("returns no next cursor when the final post has no publish date", () => {
      expect(getNextCursor([{ id: "post-1", publishDate: null }])).toBeNull();
    });
  });

  describe("albumRepository", () => {
    it("uses the expected query, tags, and mapper for category reads", async () => {
      mocks.sanityFetch
        .mockResolvedValueOnce({ data: "categories-raw" })
        .mockResolvedValueOnce({ data: "category-raw" });
      mocks.mapCategories.mockReturnValue("categories-mapped");
      mocks.mapAlbums.mockReturnValue("category-mapped");

      await expect(getCategories()).resolves.toBe("categories-mapped");
      await expect(getCategory("portrait")).resolves.toBe("category-mapped");

      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(1, {
        query: CATEGORY_INDEX_QUERY,
        tags: ["categories", "albums"]
      });
      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(2, {
        query: CATEGORY_QUERY,
        params: { slug: "portrait" },
        tags: ["categories", "albums"]
      });
    });

    it("passes locale and slug into album reads", async () => {
      mocks.sanityFetch.mockResolvedValue({ data: "album-raw" });
      mocks.mapAlbum.mockReturnValue("album-mapped");

      await expect(getAlbum("winter", "fr")).resolves.toBe("album-mapped");
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: ALBUM_QUERY,
        params: { locale: "fr", slug: "winter" },
        tags: ["albums"]
      });
    });

    it("filters unusable generated album and category slugs", async () => {
      mocks.clientFetch
        .mockResolvedValueOnce([{ slug: "winter" }, { slug: null }])
        .mockResolvedValueOnce([{ slug: "portrait" }, { slug: null }]);

      await expect(getAlbumSlugs()).resolves.toEqual([{ slug: "winter" }]);
      await expect(getCategorySlugs()).resolves.toEqual([{ slug: "portrait" }]);

      expect(mocks.clientFetch).toHaveBeenNthCalledWith(1, ALBUM_SLUGS_QUERY);
      expect(mocks.clientFetch).toHaveBeenNthCalledWith(2, CATEGORY_SLUGS_QUERY);
    });

    it("keeps all-images and featured-images cache tags aligned", async () => {
      mocks.sanityFetch
        .mockResolvedValueOnce({ data: "all-raw" })
        .mockResolvedValueOnce({ data: "featured-raw" });
      mocks.mapImageCollection
        .mockReturnValueOnce("all-mapped")
        .mockReturnValueOnce("featured-mapped");

      await expect(getAllImages()).resolves.toBe("all-mapped");
      await expect(getFeaturedImages()).resolves.toBe("featured-mapped");

      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(1, {
        query: ALL_IMAGES_QUERY,
        tags: ["albums"]
      });
      expect(mocks.sanityFetch).toHaveBeenNthCalledWith(2, {
        query: FEATURED_IMAGES_QUERY,
        tags: ["albums"]
      });
    });
  });

  describe("pageRepository", () => {
    it("maps localized pages and filters invalid generated params", async () => {
      mocks.sanityFetch.mockResolvedValue({ data: "page-raw" });
      mocks.mapPage.mockReturnValue("page-mapped");
      mocks.clientFetch.mockResolvedValue([
        { language: "en", slug: "about" },
        { language: "fr", slug: "a-propos" },
        { language: "de", slug: "uber" },
        { language: "en", slug: null }
      ]);

      await expect(getPage("about", "en")).resolves.toBe("page-mapped");
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: PAGE_QUERY,
        params: { slug: "about", locale: "en" },
        tags: ["pages"]
      });

      await expect(getPageSlugs()).resolves.toEqual([
        { language: "en", slug: "about" },
        { language: "fr", slug: "a-propos" }
      ]);
      expect(mocks.clientFetch).toHaveBeenCalledWith(PAGE_SLUGS_QUERY);
    });
  });

  describe("siteRepository", () => {
    it("fetches metadata and navigation independently before locale-aware mapping", async () => {
      mocks.sanityFetch
        .mockResolvedValueOnce({ data: "site-raw" })
        .mockResolvedValueOnce({ data: "header-raw" });
      mocks.mapSiteMetadata.mockReturnValue("site-mapped");
      mocks.mapHeaderData.mockReturnValue("header-mapped");

      await expect(getSiteShellData("fr")).resolves.toEqual({
        siteMetadata: "site-mapped",
        headerData: "header-mapped"
      });
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: SITE_METADATA_QUERY,
        tags: ["site-settings"]
      });
      expect(mocks.sanityFetch).toHaveBeenCalledWith({
        query: HEADER_QUERY,
        tags: ["navigation"]
      });
      expect(mocks.mapSiteMetadata).toHaveBeenCalledWith("site-raw");
      expect(mocks.mapHeaderData).toHaveBeenCalledWith("header-raw", "fr");
    });
  });
});
