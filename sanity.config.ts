import { visionTool } from "@sanity/vision";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { colorInput } from "@sanity/color-input";
import {
  DeleteTranslationAction,
  documentInternationalization
} from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { defineConfig } from "sanity";

import structure from "./deskStructure";

export const config = defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: schemaTypes,
  plugins: [
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        previewMode: { enable: "/api/preview" }
      }
    }),
    structureTool({
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
    media()
  ],
  document: {
    actions: (prev, { schemaType }) => {
      if (["pageList", "siteSettings"].includes(schemaType)) {
        return prev.filter(
          (originalAction) =>
            originalAction.action !== "delete" &&
            originalAction.action !== "duplicate" &&
            originalAction.action !== "unpublish"
        );
      }

      return schemaType === "page" ? [...prev, DeleteTranslationAction] : prev;
    }
  }
});

export default config;
