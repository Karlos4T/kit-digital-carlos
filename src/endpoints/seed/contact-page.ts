import type { Form, Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
  contactImage?: Media
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
  contactImage,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'contactLayout',
        heroHeading: 'Contact Me',
        heroSubheading: 'For Any Project Knock Us',
        formHeading: 'Get in
Touch With
Us',
        form: contactForm,
        media: contactImage,
        infoItems: [
          {
            label: 'Address',
            value: 'Street Avenue 21, CA',
          },
          {
            label: 'Phone',
            value: '+9 0283353',
          },
          {
            label: 'Email',
            value: 'info@aaronn.com',
            href: 'mailto:info@aaronn.com',
          },
        ],
        ctaHeading: 'Get in Touch With Us',
        ctaEmail: 'info@aaronn.com',
      },
    ],
    title: 'Contact',
  }
}
