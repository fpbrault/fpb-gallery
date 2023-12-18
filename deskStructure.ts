import { SanityDocument } from "next-sanity";
import {
  FaImages,
  FaFile,
  FaUsers,
  FaGear,
  FaCircleInfo,
  FaHouse,
  FaPalette
} from "react-icons/fa6";
import { MdOutlineArticle } from "react-icons/md";
import Iframe from "sanity-plugin-iframe-pane";


function getPreviewUrl(doc: any) {
  return `${window.location.origin}/api/preview/?slug=test`;
}

export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Posts")
        .icon(MdOutlineArticle)
        .child(S.documentTypeList("post").title("posts")),
      S.listItem()
        .title("Albums")
        .icon(FaImages)
        .child(
          S.list()
            .title("Filters")
            .items([
              S.listItem()
                .title("All Albums")
                .child(S.documentTypeList("album").title("All Albums")),
              S.listItem()
                .title("Categories")
                .child(S.documentTypeList("category").title("Categorie")),
              S.listItem()
                .title("Albums By Category")
                .child(
                  S.documentTypeList("category")
                    .title("Albums By Category")
                    .child((categoryId: any) =>
                      S.documentList()
                        .title("Albums")
                        .filter('_type == "album" && $categoryId == category._ref')
                        .params({ categoryId })
                    )
                ),
              S.listItem()
                .title("Albums with no Category")
                .child(
                  S.documentTypeList("album")
                    .title("Albums By Category")
                    .filter('_type == "album" && (!defined(category))')
                )
            ])
        ),
      S.listItem()
        .title("Pages")
        .icon(FaFile)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Translations")
                .child(
                  S.documentList()
                    .title("Translations")
                    .filter('_type == "translation.metadata"')
                    .defaultLayout("default")

                    .child((documentId: any) =>
                      S.document()
                        .title(documentId)
                        .documentId(documentId)
                        .schemaType("translation.metadata")
                    )
                ),
              S.listItem()
                .title("All Pages")
                .child(S.documentTypeList("page").title("All Pages").filter('_type == "page"')),
              S.listItem()
                .title("English Pages")
                .child(
                  S.documentTypeList("page")
                    .title("English Pages")
                    .filter('_type == "page" && language == "en"')
                ),
              S.listItem()
                .title("French Pages")
                .child(
                  S.documentTypeList("page")
                    .title("French Pages")
                    .filter('_type == "page" && language == "fr"')
                )
            ])
        ),
      S.listItem()
        .title("Authors")
        .icon(FaUsers)
        .child(S.documentTypeList("author").title("Authors")),
      S.listItem()
        .title("Settings")
        .icon(FaGear)
        .child(
          S.list()
            .title("Settings Documents")
            .items([
              S.listItem()
                .title("Metadata")
                .icon(FaCircleInfo)
                .child(S.document().schemaType("siteSettings").documentId("siteSettings") .views([
                  S.view.form(),
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: SanityDocument) => getPreviewUrl(doc),
                    })
                    .title('Preview')
                ])
                ),
              S.listItem()
                .title("Main Navigation")
                .icon(FaHouse)
                .child(S.document().schemaType("pageList").documentId("mainNavigation")),
              S.listItem()
                .title("Custom Theme Colors")
                .icon(FaPalette)
                .child(S.documentTypeList("customTheme").title("Custom Themes Colors"))
            ])
        ),
      ...S.documentTypeListItems().filter(
        (listItem: { getId: () => any }) =>
          ![
            "siteSettings",
            "album",
            "page",
            "post",
            "category",
            "pageList",
            "author",
            "translation.metadata",
            "customTheme"
          ].includes(listItem.getId() ?? "")
      )
    ]);

export default structure;
