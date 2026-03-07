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
import { revalidateDeleteProject, revalidateProject } from './hooks/revalidateProject'

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

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
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
    services: true,
    client: true,
    location: true,
    year: true,
    projectStatus: true,
    featured: true,
  },
  admin: {
    defaultColumns: ['title', 'client', 'location', 'year', 'projectStatus', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'projects',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'projects',
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
                description: 'Main image shown at the top of the project page and used for cards',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'Short description for project cards (1–2 sentences)',
              },
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              admin: {
                description: 'Project overview — shown at the top of the project page',
              },
            },
            {
              name: 'content',
              label: 'Full Content',
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
                description: 'Extended write-up with images and blocks — optional',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'Project images shown in the gallery',
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
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'client',
              type: 'text',
              admin: {
                position: 'sidebar',
                description: 'Client or organisation name',
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
              name: 'year',
              type: 'number',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'projectStatus',
              label: 'Status',
              type: 'select',
              options: [
                { label: 'Completed', value: 'completed' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Study / Concept', value: 'study-concept' },
              ],
              defaultValue: 'completed',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'services',
              type: 'select',
              hasMany: true,
              options: services,
              admin: {
                position: 'sidebar',
                description: 'Which disciplines were involved',
              },
            },
            {
              name: 'collaborators',
              type: 'array',
              admin: {
                description: 'External team members and partners on this project',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Structural Engineer", "Landscape Architect"',
                  },
                },
              ],
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
              name: 'relatedProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
              admin: {
                position: 'sidebar',
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
    afterChange: [revalidateProject],
    afterDelete: [revalidateDeleteProject],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
