import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type AboutArgs = {
  primaryImage?: Media
  secondaryImage?: Media
}

export const about: (args?: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = (
  args = {},
) => {
  const { primaryImage, secondaryImage } = args
  const images =
    primaryImage || secondaryImage
      ? {
          primary: primaryImage?.id,
          secondary: secondaryImage?.id,
        }
      : undefined

  return {
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'aboutMe',
        heroTitle: 'About Me',
        heroSubtitle: 'Little Brief About Myself',
        showDivider: true,
        missionTitle: 'My mission is to make design easier.',
        missionBody:
          'Create custom designs that convert more visitors with a clear story and an elegant flow.\nWith thoughtful iterations and a focused process, I help teams launch brands and landing pages that look sharp and feel effortless.',
        ...(images ? { images } : {}),
        socialHeading: 'Follow me on:',
        socialLinks: [
          {
            link: {
              type: 'custom',
              label: 'LinkedIn',
              url: 'https://www.linkedin.com',
              newTab: true,
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Twitter',
              url: 'https://x.com',
              newTab: true,
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Facebook',
              url: 'https://www.facebook.com',
              newTab: true,
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Instagram',
              url: 'https://www.instagram.com',
              newTab: true,
            },
          },
        ],
      },
    ],
    title: 'About Me',
  }
}
