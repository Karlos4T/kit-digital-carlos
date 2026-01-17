import type { CollectionBeforeValidateHook } from 'payload'

import { homeStatic } from '@/endpoints/seed/home-static'
import { myWorks } from '@/endpoints/seed/my-works'

export const applyLayoutPreset: CollectionBeforeValidateHook<'pages'> = async ({
  data,
  operation,
}) => {
  if (!data) return data

  const preset = data.layoutPreset
  const hasLayout = Array.isArray(data.layout) && data.layout.length > 0

  if (!preset || hasLayout) return data

  if (preset === 'home') {
    data.layout = homeStatic.layout
  }

  if (preset === 'my-works') {
    data.layout = myWorks().layout
  }

  if (preset === 'contact') {
    const formValue =
      typeof data.presetForm === 'object' && data.presetForm
        ? data.presetForm.id
        : data.presetForm

    if (!formValue) return data

    data.layout = [
      {
        blockType: 'contactLayout',
        heroHeading: 'Contact Me',
        heroSubheading: 'For Any Project Knock Us',
        formHeading: 'Get in Touch With Us',
        form: formValue,
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
    ]
  }

  return data
}
