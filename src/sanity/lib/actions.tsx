import { useEffect, useMemo, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useSecrets } from "@sanity/studio-secrets";
import { groq } from "next-sanity";
import { useDocumentOperation, useValidationStatus } from "sanity";


interface Secrets {
  apiKey?: string;
}

const generatePaths = (currentSlug: string, currentSlugFr: string, nextPost: any, previousPost: any) => {
  const paths = [`/blog/${currentSlug}/`, `/fr/blog/${currentSlugFr}/`, '/blog/', '/fr/blog/', '/', '/fr/'];
  if (nextPost?.slug?.current) paths.push(`/blog/${nextPost.slug.current}/`);
  if (nextPost?.slug_fr?.current) paths.push(`/fr/blog/${nextPost.slug_fr.current}/`);
  if (previousPost?.slug?.current) paths.push(`/blog/${previousPost.slug.current}/`);
  if (previousPost?.slug_fr?.current) paths.push(`/fr/blog/${previousPost.slug_fr.current}/`);
  return paths;
}


export async function RevalidatePaths(paths: string[], secrets?: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const endpoint = new URL("/api/revalidate", window.location.origin);

      endpoint.searchParams.append("paths", paths.join(","));
      endpoint.searchParams.append("secret", secrets?.apiKey ?? "");

      const response = await fetch(endpoint.href);

      resolve(response);
    } catch (err) {
      console.error(err);

      reject(err);
    }
  });
}

const fetchAdjacentPosts = async (publishDate: string) => {
  const nextPost = await client.fetch(groq`*[_type == "post" && publishDate > $publishDate]|order(publishDate asc)[0]`, { publishDate });
  const previousPost = await client.fetch(groq`*[_type == "post" && publishDate < $publishDate]|order(publishDate desc)[0]`, { publishDate });
  return { nextPost, previousPost };
}



async function generatePathsForPost(props: any) {
  const { nextPost, previousPost } = await fetchAdjacentPosts(props.published.publishDate);
  let paths = generatePaths(props.published?.slug?.current, props.published?.slug_fr?.current, nextPost, previousPost);
  // If the old slug is different from the new slug, add it to the paths array
  if (props.draft?.slug?.current !== props.published?.slug?.current) {
    paths.push("/" + props.draft?.slug?.current);
  }
  if (props.draft?.slug_fr?.current !== props.published?.slug_fr?.current) {
    paths.push("/" + props.draft?.slug_fr?.current);
  }
  return paths;
}

async function generatePathsForPage(props: any) {
  console.log(props)
  const currentPage = props.action == 'delete' ? props.published : props.draft
  const language = currentPage?.language
  const slug = currentPage?.slug?.current
  console.log(slug, language)
  const prefix = language === 'en' ? '' : '/fr';
  let paths = [
    `${prefix}/${slug}`,
    prefix === '' ? '/' : '/fr'
  ];
  // If the old slug is different from the new slug, add it to the paths array
  if (props.action !== 'delete' && props.draft?.slug?.current !== props.published?.slug?.current && props.published?.slug?.current) {
    paths.push(`${prefix}/${props.published?.slug?.current}`);
  }
  console.log(paths)
  return paths;
}

async function generatePathsForCategory(props: any) {
  const currentCategory = await client.fetch('*[_id == $id][0]', { id: props.id });
  console.log(props)
  let paths = [
    `/category/${currentCategory?.slug?.current}`,
    `/fr/category/${currentCategory?.slug?.current}`,
    '/',
    '/fr/'
  ];
  // If the old slug is different from the new slug, add it to the paths array
  if (props.draft?.slug?.current !== currentCategory?.slug?.current) {
    paths.push(`/category/${props.draft?.slug?.current}`);
    paths.push(`/fr/category/${props.draft?.slug?.current}`);
  }
  return paths;
}

async function generatePathsForAlbum(props: any) {
  const currentAlbum = await client.fetch('*[_id == $id]{...,category->}[0]', { id: props.id });
  let paths = [
    `/album/${currentAlbum.albumId}`,
    `/fr/album/${currentAlbum.albumId}`,
    `/category/${currentAlbum.category.slug.current}`,
    `/fr/category/${currentAlbum.category.slug.current}`,
    '/',
    '/fr/'
  ];
  // If the old slug is different from the new slug, add it to the paths array
  if (props.draft?.slug?.current !== currentAlbum.albumId) {
    paths.push(`/album/${props.draft?.slug?.current}`);
    paths.push(`/fr/album/${props.draft?.slug?.current}`);
  }
  return paths;
}

export function DeleteAndRevalidate(props: { id: string; type: string; published: unknown; }) {
  const { delete: deleteOperation } = useDocumentOperation(props.id, props.type)
  console.log(props)
  const [isDeleting, setIsDeleting] = useState(false)
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  let paths: string[] = [];

  useEffect(() => {
    // if the isDeleting state was set to true and the published document has changed
    // to become `null` the document has been deleted
    if (isDeleting && !props.published) {
      setIsDeleting(false)
    }
  }, [isDeleting, props.published])
  
  return {
    disabled: deleteOperation.disabled,
    label: isDeleting ? 'Deleting…' : 'Delete & Revalidate',
    onHandle: async () => {
      setIsDeleting(true)

      // Perform the delete
      deleteOperation.execute()
      await new Promise(resolve => setTimeout(resolve, 2000));
      let documentType = props?.type ?? ""
      const newProps = {...props, action: "delete"}
      switch (documentType) {
        case 'post':
          paths = await generatePathsForPost(newProps);
          break;
        case 'page':
          paths = await generatePathsForPage(newProps);
          break;
        case 'category':
          paths = await generatePathsForCategory(newProps);
          break;
        case 'album':
          paths = await generatePathsForAlbum(newProps);
          break;
      }
     
      await RevalidatePaths([...paths], secrets);

    }
  };
};


export function PublishAndRevalidate(props: { id: string; type: string; draft: unknown; }) {
  const { isValidating, validation } = useValidationStatus(
    props.id,
    props.type,
  );
  const { publish } = useDocumentOperation(props.id, props.type)
  const [canPublish, allowPublish] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false)
  const { secrets }: { secrets?: Secrets } = useSecrets('myPlugin');
  let paths: string[] = [];

  useEffect(() => {
    // If the document has no changes or is already published, the publish operation will be disabled
    if (publish.disabled) {
      allowPublish(false);
      return;
    }
    // Otherwise, it might be the case that the document isn't valid, so we must check validity
    if (!isValidating) {
      // If there are no validation markers, the document is perfect and good for publishing
      if (validation.length == 0) {
        allowPublish(true);
      } else {
        allowPublish(false);
      }
    }
  }, [publish.disabled, isValidating, validation.length]);

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false)
    }
  }, [isPublishing, props.draft])

  return {
    disabled: !canPublish,
    label: isPublishing ? 'Publishing…' : 'Publish & Revalidate',
    onHandle: async () => {
      setIsPublishing(true)

      // Perform the publish
      publish.execute()
      await new Promise(resolve => setTimeout(resolve, 1000));
      let documentType = props?.type ?? ""
      switch (documentType) {
        case 'post':
          paths = await generatePathsForPost(props);
          break;
        case 'page':
          paths = await generatePathsForPage(props);
          break;
        case 'category':
          paths = await generatePathsForCategory(props);
          break;
        case 'album':
          paths = await generatePathsForAlbum(props);
          break;
      }
     
      await RevalidatePaths([...paths], secrets);

    }
  };
};
