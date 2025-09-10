import React from 'react'
import { LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import { internalDocToHref } from './internalLink'
import { headingConverter } from './headingConverter'

export const jsxConverter = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
})