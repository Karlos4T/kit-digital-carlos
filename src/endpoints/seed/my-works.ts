import type { RequiredDataFromCollectionSlug } from 'payload'

type MyWorksArgs = {
  works?: Array<string | number>
}

export const myWorks: (args?: MyWorksArgs) => RequiredDataFromCollectionSlug<'pages'> = (
  args = {},
) => {
  const { works = [] } = args

  return {
    slug: 'my-works',
    _status: 'published',
    hero: {
      type: 'none',
    },
    meta: {
      description: 'Showcase about works.',
      title: 'My works',
    },
    title: 'My works',
    layout: [
      {
        blockName: 'Works Gallery',
        blockType: 'worksGallery',
        title: 'My works',
        subtitle: 'Showcase About Works',
        searchLabel: 'Search',
        works,
        cta: {
          type: 'custom',
          label: 'Load more works',
          url: '#',
          appearance: 'outline',
        },
      },
    ],
  }
}
