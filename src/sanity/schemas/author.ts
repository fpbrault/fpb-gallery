import { defineField, defineType } from "sanity";


export const author =  defineType({
    name: 'author',
    type: 'document',
    title: 'Author',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
            title: 'Full name'
        }),
        defineField({
            name: 'id',
            type: 'string',
            title: 'User ID',
            readOnly: true,
            description: `This author's user ID. Used for workflow scripts and similar.`
        })
    ]
})

export default author;