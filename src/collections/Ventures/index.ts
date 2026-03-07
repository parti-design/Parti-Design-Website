import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDeleteVenture, revalidateVenture } from './hooks/revalidateVenture'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

const services = [
  { label: 'Architecture & Spatial Design', value: 'architecture-spatial' },
  { label: 'Graphic Design & Branding', value: 'graphic-design-branding' },
  { label: 'UX/UI & Digital Development', value: 'ux-ui-digital' },
  { label: 'Co-design & Co-building Workshops', value: 'co-design-workshops' },
  { label: 'Workshop Facilitation & Project Management', value: 'facilitation-project-management' },
  { label: 'Regenerative Placemaking Consulting', value: 'placemaking-consulting' },
  { label: 'Research & Development', value: 'research-development' },
]

export const Ventures: CollectionConfig<'ventures'> = {
  slug: 'ventures',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    tagline: true,
    coverImage: true,
    ventureStatus: true,
    location: true,
    services: true,
    featured: true,
    order: true,
  },
  admin: {
    defaultColumns: ['title', 'ventureStatus', 'location', 'services', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'ventures',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'ventures',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main image shown at the top of the venture page and used for cards',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'Short description for venture cards (1–2 sentences)',
              },
            },
            {
              name: 'description',
              label: 'Description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Banner, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              admin: {
                description: 'Full description of the venture — what it is and where it is heading',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'Images shown in the venture gallery',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
            {
              name: 'externalUrl',
              label: 'External URL',
              type: 'text',
              admin: {
                description: "Link to the venture's own website or project page, if it exists",
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'ventureStatus',
              label: 'Status',
              type: 'select',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'In Development', value: 'in-development' },
                { label: 'Completed', value: 'completed' },
              ],
              defaultValue: 'active',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'location',
              type: 'text',
              admin: {
                position: 'sidebar',
                description: 'e.g. "Umeå, Sweden"',
              },
            },
            {
              name: 'services',
              type: 'select',
              hasMany: true,
              options: services,
              admin: {
                position: 'sidebar',
                description: "Parti Design's contribution to this venture",
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Show on homepage and featured sections',
              },
            },
            {
              name: 'order',
              type: 'number',
              admin: {
                position: 'sidebar',
                description: 'Display order (lower numbers appear first)',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateVenture],
    afterDelete: [revalidateDeleteVenture],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
