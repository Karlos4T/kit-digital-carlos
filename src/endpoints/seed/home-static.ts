import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'none',
  },
  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'Payload Website Template',
  },
  title: 'Home',
  layout: [
    {
      blockName: 'Landing Hero',
      blockType: 'landingHero',
      title: 'Convierte tu idea en realidad',
      cta: {
        type: 'custom',
        newTab: false,
        url: '/my-works',
        label: 'Explore more',
        appearance: 'default',
      },
    },
    {
      blockName: 'About Closer',
      blockType: 'aboutCloser',
      title: "Let's get to know about me closer",
      body:
        'Soy desarrollador y explorador constante de herramientas. Desde siempre he tenido la necesidad de convertir ideas en realidades.\n\nDesarrollo para dar forma a la imaginacion y transformarla en algo tangible.',
      cta: {
        type: 'custom',
        newTab: false,
        url: '/about',
        label: 'Discover more about me',
        appearance: 'outline',
      },
    },
    {
      blockName: 'Projects Highlight',
      blockType: 'projectsHighlight',
      title: 'My Projects Highlight',
      cta: {
        type: 'custom',
        newTab: false,
        url: '/projects',
        label: 'Explore more',
        appearance: 'outline',
      },
      projects: [
        {
          title: 'Solanialacto',
          scope: 'Redes Sociales',
          tags: [
            {
              tag: 'Branding',
            },
            {
              tag: 'Logo design',
            },
          ],
        },
        {
          title: 'NearU',
          scope: 'Desarrollo',
          tags: [
            {
              tag: 'Web',
            },
            {
              tag: 'Flutter',
            },
          ],
        },
        {
          title: 'NFT Glimps',
          scope: 'Branding',
          tags: [
            {
              tag: 'NFT Design',
            },
          ],
        },
        {
          title: 'Brand Suggestions',
          scope: 'Identidad',
          tags: [
            {
              tag: 'NFT Logo',
            },
          ],
        },
      ],
    },
    {
      blockName: 'Work Philosophy',
      blockType: 'workPhilosophy',
      title: 'Work philosophy',
      body:
        'Mi forma de trabajar nace de la curiosidad y del impulso constante por crear. A lo largo del tiempo he explorado herramientas, aprendido ideas y afinado mi proceso, entendiendo que cada paso es parte del camino.\n\nDesarrollo con claridad, construyendo formas y detalles hasta que las ideas dejan de ser abstractas y se convierten en algo real, claro y tangible.',
      author: 'Carlos Garcia',
    },
  ],
}
