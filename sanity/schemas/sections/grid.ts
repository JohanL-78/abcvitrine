import { defineType, defineField } from 'sanity'
import { ThLargeIcon } from '@sanity/icons'

export default defineType({
  name: 'grid',
  title: 'Grid Section',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Grid Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
            {
              name: 'link',
              title: 'Link',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          { title: '2 columns', value: 2 },
          { title: '3 columns', value: 3 },
          { title: '4 columns', value: 4 },
        ],
      },
      initialValue: 3,
      validation: (Rule) => Rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      itemsCount: 'items.length',
      columns: 'columns',
    },
    prepare({ title, itemsCount, columns }) {
      return {
        title: title || 'Grid Section',
        subtitle: `${itemsCount || 0} items, ${columns} columns`,
      }
    },
  },
})
