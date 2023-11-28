import { defineType } from "sanity";

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Site Title',
            type: 'string'
        },
        {
            name: 'description',
            title: 'Site Description',
            type: 'text'
        },
        {
            name: 'siteColors',
            type: 'reference',
            title: 'Colors',
            to: [{ type: 'colors' }],
          },
    ]
})

export const colors = defineType({
    name: 'colors',
    title: 'Site Colors',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: "Name",
            description: "Name of the color set",
            type: 'string'
        },
        {
            name: 'primary',
            title: "Primary",
            type: 'color',
            options: {
                disableAlpha: true
              }
        },
        {
            name: 'secondary',
            title: "Secondary",
            type: 'color',
            options: {
                disableAlpha: true
              }
        }
    ]
})

export default siteSettings;