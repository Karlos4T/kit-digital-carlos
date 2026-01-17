import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { LandingHero } from '@/blocks/LandingHero/config'
import { AboutCloser } from '@/blocks/AboutCloser/config'
import { ProjectsHighlight } from '@/blocks/ProjectsHighlight/config'
import { WorkPhilosophy } from '@/blocks/WorkPhilosophy/config'
import { WorksGallery } from '@/blocks/WorksGallery/config'
import { ContactLayout } from '@/blocks/ContactLayout/config'
import { LegalText } from '@/blocks/LegalText/config'
import { AboutMe } from '@/blocks/AboutMe/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { applyLayoutPreset } from './hooks/applyLayoutPreset'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
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
      name: 'layoutPreset',
      type: 'select',
      admin: {
        description: 'Select a preset to auto-fill the layout on save.',
        position: 'sidebar',
      },
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Contact', value: 'contact' },
        { label: 'My Works', value: 'my-works' },
      ],
    },
    {
      name: 'presetForm',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.layoutPreset === 'contact',
        position: 'sidebar',
      },
      relationTo: 'forms',
      validate: (value, { data }) => {
        if (data?.layoutPreset === 'contact' && !value) {
          return 'Contact layout requires a form.'
        }
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                LandingHero,
                AboutMe,
                AboutCloser,
                ProjectsHighlight,
                WorkPhilosophy,
                WorksGallery,
                ContactLayout,
                LegalText,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
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
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeValidate: [applyLayoutPreset],
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
