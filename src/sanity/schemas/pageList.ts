import { defineField, defineType } from "sanity";

export const pageList = {
    name: 'pageList',
    type: 'document',
    title: 'Page List',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            hidden: true,
            title: 'Title', 
            initialValue: "Main Navigation"
        }),
        defineField({

            name: 'pages',
            type: 'array',
            title: 'Pages',
            description: 'List of pages in the desired order',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'page' },
                    ],
                },
                {
                    type: 'object',
                    name: 'hardcodedPage',
                    title: 'Hardcoded Page',
                    fields: [
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Page Title',
                        },
                        {
                            name: 'slug',
                            type: 'string',
                            title: 'Page slug',
                        },
                    ],
                },
            ],
        }),
    ],
};

export default pageList;
