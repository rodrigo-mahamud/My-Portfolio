import React from 'react'
import { LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import { internalDocToHref } from './internalLink'
import { headingConverter } from './headingConverter'
import { workCardsConverter } from './workCardsConverter'

export const jsxConverter = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
  ...workCardsConverter,
})