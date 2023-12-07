import { visionTool } from "@sanity/vision";
import { deskTool } from "sanity/desk";
import { media } from "sanity-plugin-media";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { defaultDocumentNode } from "./defaultDocumentNode";
import { colorInput } from "@sanity/color-input";
import {
  DeleteTranslationAction,
  documentInternationalization
} from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { defineConfig } from "sanity";

import { theme } from "https://themer.sanity.build/api/hues?preset=verdant";
import { noteField } from "sanity-plugin-note-field";
import structure from "./deskStructure";
import { PostUpdate, UpdateAlbumPath, UpdateAllPaths, UpdateCategoryPath, UpdatePagePath } from "@/sanity/lib/actions";
import { secretsToolbar } from "@/sanity/plugins/secrets-toolbar";

export const config = defineConfig({
  theme,
  basePath: "/studio",
  projectId,
  dataset,
  schema: schemaTypes,
  plugins: [
    secretsToolbar(),
    deskTool({
      defaultDocumentNode,
      structure
    }),
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
      schemaTypes: ["page"]
    }),
    colorInput(),
    media(),
    noteField()
  ],
  document: {
    actions: (prev: any, { schemaType }: any) => {
      let actions = [...prev];
      // Add to the same schema types you use for internationalization
      if (["page"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action
        actions = [...actions, DeleteTranslationAction, UpdatePagePath ];
      }
      if (["post"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action
        actions =  [...actions, PostUpdate, ];
      }
      if (["album"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action
        actions =  [...actions, UpdateAlbumPath, ];
      }
      if (["category"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action
        actions =  [...actions, UpdateCategoryPath  , ];
      }
      if (["pageList", "siteSettings"].includes(schemaType)) {
        // You might also like to filter out the built-in "delete" action

        const newActions = prev.filter(
          (originalAction: any) =>
            originalAction.action !== "delete" &&
            originalAction.action !== "duplicate" &&
            originalAction.action !== "unpublish"
        );
        return [...newActions, UpdateAllPaths];
      }

      actions = [...actions, UpdateAllPaths]

      return actions;
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
