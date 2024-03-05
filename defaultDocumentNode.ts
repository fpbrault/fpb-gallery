import { DefaultDocumentNodeResolver } from "sanity/structure";
import { Iframe } from "sanity-plugin-iframe-pane";

// Customise this function to show the correct URL based on the current document
/* function getPreviewUrl(doc: poszt) {
  return doc?.slug?.current
    ? `${window.location.origin}/blog/${doc.slug?.current}`
    : `${window.location.origin}/blog/`
} */

// Import this into the deskTool() plugin
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  // Only show preview pane on `movie` schema type documents
  switch (schemaType) {
    case `post`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: any) =>
              doc?.slug?.current
                ? `${window.location.origin}/api/preview/?slug=${doc.slug.current}`
                : `${window.location.origin}/api/preview`
          })
          .title("Preview")
      ]);
    case `siteMetadata`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: any) =>
              doc?.slug?.current
                ? `${window.location.origin}/api/preview?slug=${doc.slug.current}`
                : `${window.location.origin}/api/preview`
          })
          .title("Preview")
      ]);
    case `page`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: any) =>
              doc?.slug?.current
                ? `${window.location.origin}/api/preview/?pageSlug=${doc.slug.current}`
                : `${window.location.origin}/api/preview `
          })
          .title("Preview")
      ]);
    case `album`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: any) =>
              doc?.slug.current
                ? `${window.location.origin}/api/preview/?albumId=${doc.slug.current}`
                : `${window.location.origin}/api/preview `
          })
          .title("Preview")
      ]);
    case `category`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: any) =>
              doc?.slug.current
                ? `http://localhost:3000/api/preview/?categoryName=${doc.slug.current}`
                : `http://localhost:3000/api/preview `
          })
          .title("Preview")
      ]);
    default:
      return S.document().views([S.view.form()]);
  }
};
