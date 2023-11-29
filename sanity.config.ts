/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { media } from 'sanity-plugin-media'


// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { schemaTypes } from '@/sanity/schemas'
import { defaultDocumentNode } from './defaultDocumentNode';
import { colorInput } from '@sanity/color-input';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: schemaTypes,
  plugins: [
    colorInput(),
    media(),
    deskTool({
      defaultDocumentNode,
      structure: (S) =>
        S.list()
          .title('Base')
          .items([
            S.listItem()
              .title('Albums')
              .child(
                S.list()
                  .title('Filters')
                  .items([
                    S.listItem().title('Albums By Category').child(
                      S.documentTypeList('category')
                        .title('Albums By Category')
                        .child(categoryId =>
                          S.documentList()
                            .title('Albums')
                            .filter('_type == "album" && $categoryId == category._ref')
                            .params({ categoryId })
                        )
                    ),
                    S.listItem().title('Albums with no Category').child(
                      S.documentTypeList('album')
                        .title('Albums By Category')
                        .filter('_type == "album" && (!defined(category))')
                        
                    ),
                  ])
              ),
            // The rest of this document is from the original manual grouping in this series of articles
            ...S.documentTypeListItems().filter(
              (listItem) => !['siteSettings', 'navigation','colors'].includes(listItem.getId() ?? "")
            ),
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings Documents')
                  .items([
                    S.listItem()
                      .title('Metadata')
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                    S.listItem()
                      .title('Site Colors')
                      .child(S.document().schemaType('colors').documentId('colors')),
                    S.listItem()
                      .title('Main Navigation')
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                  ])
              ),
          ])

    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
