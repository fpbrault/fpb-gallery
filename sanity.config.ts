import { visionTool } from "@sanity/vision";
import { deskTool } from "sanity/desk";
import { media } from "sanity-plugin-media";

import {
  FaCircleInfo,
  FaPalette,
  FaHouse,
  FaGear,
  FaFile,
  FaImages,
  FaUsers
} from "react-icons/fa6";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { defaultDocumentNode } from "./defaultDocumentNode";
import { colorInput } from "@sanity/color-input";
import {
  DeleteTranslationAction,
  documentInternationalization
} from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { dashboardTool } from "@sanity/dashboard";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";
import { defineConfig } from "sanity";

import { theme } from "https://themer.sanity.build/api/hues?preset=verdant";
import { MdOutlineArticle } from "react-icons/md";

export const config = defineConfig({
  theme,
  basePath: "/studio",
  projectId,
  dataset,
  schema: schemaTypes,
  plugins: [
    deskTool({
      defaultDocumentNode,
      structure: (S) =>
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
                          .child((categoryId) =>
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

                          .child((documentId) =>
                            S.document()
                              .title(documentId)
                              .documentId(documentId)
                              .schemaType("translation.metadata")
                          )
                      ),
                    S.listItem()
                      .title("All Pages")
                      .child(
                        S.documentTypeList("page").title("All Pages").filter('_type == "page"')
                      ),
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
                      .title("Main Navigation")
                      .icon(FaHouse)
                      .child(S.document().schemaType("pageList").documentId("mainNavigation")),
                    S.listItem()
                      .title("Metadata")
                      .icon(FaCircleInfo)
                      .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
                      S.listItem()
                      .title("Custom Theme Colors")
                      .icon(FaPalette)
                      .child(S.documentTypeList("customTheme").title("Custom Themes Colors"))
                  ])
              ),
            ...S.documentTypeListItems().filter(
              (listItem) =>
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
          ])
    }),
    dashboardTool({
      widgets: [vercelWidget()]
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    internationalizedArray({
      languages: [
        { id: "en", title: "English" },
        { id: "fr", title: "French" }
      ],
      defaultLanguages: ["en"],
      fieldTypes: ["string", "blockContent", "slug"]
    }),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        { id: "fr", title: "French" },
        { id: "en", title: "English" }
      ],
      schemaTypes: ["post", "page"]
    }),
    colorInput(),
    media()
  ],
  document: {
    actions: (prev: any, { schemaType }: any) => {
      // Add to the same schema types you use for internationalization
      if (["page"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action
        return [...prev, DeleteTranslationAction];
      }
      if (["pageList", "siteSettings"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action

        const newActions = prev.filter(
          (originalAction: any) =>
            originalAction.action !== "delete" &&
            originalAction.action !== "duplicate" &&
            originalAction.action !== "unpublish"
        );
        return [...newActions];
      }

      return prev;
    }
  }
});

export const getDefaultDocumentNode = (
  S: {
    document: () => { (): any; new (): any; views: { (arg0: any[]): any; new (): any } };
    view: {
      form: () => any;
      component: (arg0: any) => {
        (): any;
        new (): any;
        title: { (arg0: string): any; new (): any };
      };
    };
  },
  { schemaType }: any
) => {
  // Conditionally return a different configuration based on the schema type
  if (schemaType === "post") {
    return S.document().views([S.view.form()]);
  }
  return S.document().views([S.view.form()]);
};

export default config;
