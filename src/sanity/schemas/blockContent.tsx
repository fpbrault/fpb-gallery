import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from 'react';
import { Fa3, FaBox, FaHighlighter, FaImages, FaSquare, FaStrikethrough, FaUnderline } from 'react-icons/fa6';
import { defineType, defineArrayMember, defineField } from 'sanity';
import { RoughNotation } from "react-rough-notation";

const HighlightDecorator = (props: any ) => (
  <RoughNotation type="highlight" color="yellow" show={true}><span style={{color: 'black'}}>{props.children}</span></RoughNotation>
)
const StrikethroughDecorator = (props: any ) => (
  <RoughNotation type="strike-through" show={true}>{props.children}</RoughNotation>
)

const UnderlineDecorator = (props: any ) => (
  <RoughNotation type="underline" show={true}>{props.children}</RoughNotation>
)

const BoxDecorator = (props: any ) => (
  <RoughNotation type="box" show={true}>{props.children}</RoughNotation>
)


const JustifyStyle = (props: any ) => (
  <div className='text-justify'>{props.children} </div>
)
const CenterStyle = (props: any ) => (
  <div className='text-center'>{props.children} </div>
)

export const styledBlock = defineType({
  title: 'Block Content',
  name: 'styledBlock',
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'H1', value: 'h1'},
    {title: 'H2', value: 'h2'},
    {title: 'H3', value: 'h3'},
    {title: 'Quote', value: 'blockquote'},
    {
      title: 'Justify',
      value: 'justify',
      component: JustifyStyle
    },
    {
      title: 'Center',
      value: 'center',
      component: CenterStyle
    },
  ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis',
          value: 'em' },
          { title: 'Underline', 
          component: UnderlineDecorator,
          icon: FaUnderline,
          value: 'un' },
          { title: 'Strikethrough', 
          component: StrikethroughDecorator,
          icon: FaStrikethrough,
          value: 's' },
          {
            title: 'Highlight',
            value: 'highlight',
            icon: FaHighlighter,
            component: HighlightDecorator
          },
          {
            title: 'Box',
            value: 'box',
            icon: FaBox,
            component: BoxDecorator
          }
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [
                  { type: 'post' as const },
                ]
              }
            ]
          }
        ],
      },
      
});

export const innerblockContent = defineType({
  title: 'Block Content',
  name: 'innerblockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'styledBlock',
    }),
    defineArrayMember({ type: 'image' }),
  ],
});

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'styledBlock',
    }),
    defineArrayMember({
      title: '2 Column Layout',
      name: 'layout-col-2',
      type: 'object',
      fields: [
        defineField({
          title: 'Left Column',
          name: 'leftCol',
          type: 'innerblockContent',
        }),
        defineField({
          title: 'Right Column',
          name: 'rightCol',
          type: 'innerblockContent',
        })
      ]}),

    defineArrayMember({ type: 'image' }),
    { type: 'reference', name: 'Post', to: { type: 'post' as const } },
    { type: 'reference', name: 'album', to: { type: 'album' as const } },
    { type: 'reference', icon: FaImages, title: "Album Card", name: 'albumCard', to: { type: 'album' as const } }
  ],
});