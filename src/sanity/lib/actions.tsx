import { useMemo, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useSecrets } from "@sanity/studio-secrets";


interface Secrets {
  apiKey?: string;
}


export function createAsyncPublishAction(originalAction: any, context: any) {
  const client = context.getClient({ apiVersion: "2022-11-29" });
  const AsyncPublishAction = (props: any) => {
    const originalResult = originalAction(props);
    const [status, setStatus] = useState("pending");

    const label = useMemo(() => {
      switch (status) {
        case "success":
          return "Updated";
        case "error":
          return "Something went wrong";
        default:
          return "Update blog";
      }
    }, [status]);

    if (props.type !== "post") {
      return null;
    }
    return {
      ...originalResult,
      onHandle: async () => {
        try {
          const rev = await fetch(`/api/revalidate?slug=${props.draft.slug.current}`);

          setStatus("success");
        } catch (err) {
          setStatus("error");
        } finally {
          // Signal that the action is completed
          props.onComplete();
        }
        originalResult.onHandle();
      }
    };
  };
  return AsyncPublishAction;
}

export function PostUpdate(props: {
  id: any;
  published: any; type: string; onComplete: () => void
}) {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [status, setStatus] = useState("pending");

  const label = useMemo(() => {
    switch (status) {
      case "success":
        return "Updated";
      case "error":
        return "Something went wrong";
      default:
        return "Update blog";
    }
  }, [status]);

  if (props.type !== "post") {
    return null;
  }

  const fetchAdjacentPosts = async (publishDate: string) => {
    const nextPost = await client.fetch('*[_type == "post" && publishDate > $publishDate]|order(publishDate asc)[0]', { publishDate });
    const previousPost = await client.fetch('*[_type == "post" && publishDate < $publishDate]|order(publishDate desc)[0]', { publishDate });
    return { nextPost, previousPost };
  }

  /**
   * Generates an array of paths based on the current slug, current French slug, next post, and previous post.
   * 
   * @param currentSlug - The current slug.
   * @param currentSlugFr - The current French slug.
   * @param nextPost - The next post object.
   * @param previousPost - The previous post object.
   * @returns An array of paths.
   */
  const generatePaths = (currentSlug: string, currentSlugFr: string, nextPost: any, previousPost: any) => {
    const paths = [`/blog/${currentSlug}`, `/fr/blog/${currentSlugFr}`, '/blog/', '/fr/blog/', '/', '/fr/'];
    if (nextPost?.slug?.current) paths.push(`/blog/${nextPost.slug.current}`);
    if (nextPost?.slug_fr?.current) paths.push(`/fr/blog/${nextPost.slug_fr.current}`);
    if (previousPost?.slug?.current) paths.push(`/blog/${previousPost.slug.current}`);
    if (previousPost?.slug_fr?.current) paths.push(`/fr/blog/${previousPost.slug_fr.current}`);
    return paths;
  }

  return {
    label,
    onHandle: async () => {
      
      try {
        const currentPost = await client.fetch('*[_id == $id]', { id: props.id });
        const currentPostCreatedAt = currentPost[0].publishDate;

        const { nextPost, previousPost } = await fetchAdjacentPosts(currentPostCreatedAt);

        const paths = generatePaths(props.published.slug.current, props.published.slug_fr.current, nextPost, previousPost);

        await RevalidatePaths([...paths, '/blog/'], secrets);

        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        props.onComplete();
      }
    }
  };
}

export function UpdateCategoryPath(props: { id: any; onComplete: () => void }) {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [status, setStatus] = useState("pending");

  return {
    label: status === "success" ? "Updated" : "Update category",
    onHandle: async () => {
      try {
        const currentCategory = await client.fetch('*[_id == $id]', { id: props.id });
        const paths = [
          `/category/${currentCategory.slug.current}`,
          `/fr/category/${currentCategory.slug.current}`,
          '/',
          '/fr/'
        ];

        await RevalidatePaths(paths, secrets);

        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        props.onComplete();
      }
    }
  };
}

export function UpdatePagePath(props: { id: any; onComplete: () => void }) {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [status, setStatus] = useState("pending");

  return {
    label: status === "success" ? "Updated" : "Update page",
    onHandle: async () => {
      try {
        const currentPage = await client.fetch('*[_id == $id][0]', { id: props.id });
        const prefix = currentPage.language === 'en' ? '' : '/fr';
        const paths = [
          `${prefix}/${currentPage.slug.current}`,
          prefix === '' ? '/' : '/fr'
        ];

        await RevalidatePaths(paths, secrets);

        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        props.onComplete();
      }
    }
  };
}

export function UpdateAlbumPath(props: { id: any; category: any; onComplete: () => void }) {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [status, setStatus] = useState("pending");

  return {
    label: status === "success" ? "Updated" : "Update album",
    onHandle: async () => {
      try {
        const currentAlbum = await client.fetch('*[_id == $id]{...,category->}[0]', { id: props.id });
        const paths = [
          `/album/${currentAlbum.albumId}`,
          `/fr/album/${currentAlbum.albumId}`,
          `/category/${currentAlbum.category.slug.current}`,
          `/fr/category/${currentAlbum.category.slug.current}`,
          '/',
          '/fr/'
        ];

        await RevalidatePaths(paths, secrets);

        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        props.onComplete();
      }
    }
  };
}

export function UpdateAllPaths(props: any) {
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  const [status, setStatus] = useState("pending");
  const [dialogOpen, setDialogOpen] = useState(false)
  const onComplete = async () => {
    try {
      const pages = await client.fetch('*[_type == "page"]');
      const posts = await client.fetch('*[_type == "post"]');
      const albums = await client.fetch('*[_type == "album"]');
      const categories = await client.fetch('*[_type == "category"]');

      const paths = [
        '/',
        '/blog',
        '/fr/blog',
        '/fr',
        '/album/featured',
        '/album/all',
        '/fr/album/featured',
        '/fr/album/all',
        ...pages.map((page: { slug: { current: any; }; }) => `/${page.slug.current}`),
        ...pages.map((page: { slug: { current: any; }; }) => `/fr/${page.slug.current}`),
        ...posts.map((post: { slug: { current: any; }; slug_fr: { current: any; }; }) => `/blog/${post.slug.current}`),
        ...posts.map((post: { slug: { current: any; }; slug_fr: { current: any; }; }) => `/fr/blog/${post.slug_fr.current}`),
        ...albums.map((album: { slug: { current: any; }; }) => `/album/${album.slug.current}`),
        ...albums.map((album: { slug: { current: any; }; }) => `/fr/album/${album.slug.current}`),
        ...categories.map((category: { slug: { current: any; }; }) => `/category/${category.slug.current}`),
        ...categories.map((category: { slug: { current: any; }; }) => `/fr/category/${category.slug.current}`),
      ];

      await RevalidatePaths(paths, secrets);

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      props.onComplete();
    }
  }
  return {
    label: status === "success" ? "Updated" : "Update all paths",
    onHandle: () => {
      setDialogOpen(true)
    },
    dialog: dialogOpen && {
      key: dialogOpen ? 'open' : 'closed',
      type: 'confirm',
      onCancel: () => setDialogOpen(false),
      onConfirm: () => {
        alert('Starting revalidation!')
        setDialogOpen(false);
        onComplete();
      },
      message: "Are you sure? This will revalidate (update) all the paths/page, which can take a while... You can alternatively revalidate only a specific page/post/album in their own section."
    },

  };
}

async function RevalidatePaths(paths: string[], secrets?: any) {

  try {
    const endpoint = new URL("/api/revalidate", window.location.origin);

    endpoint.searchParams.append("paths", paths.join(","));
    endpoint.searchParams.append("secret", secrets?.apiKey ?? "");


    await fetch(endpoint.href);
  } catch (err) {
    console.error(err);

    return null;
  }
}
