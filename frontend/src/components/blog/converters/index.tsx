import React from 'react'
import type {
  SinglePostInfoBlock as SinglePostInfoProps,
  SinglePostSectionBlock as SinglePostSectionProps,
  PostMediaBlock as PostMediaProps,
  PostGalleryGridBlock as PostGalleryGridProps,
  PostCardsBlock as PostCardsProps,
  StatsBlock as StatsProps,
  PostNextProjectBlock as PostNextProjectProps,
  RichTextBlock as RichTextProps,
} from '../../../utils/payload'

// import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import {
  LinkJSXConverter
} from '@payloadcms/richtext-lexical/react'

import { internalDocToHref } from './internalLink'
import { headingConverter } from './headingConverter'

// Importar componentes de bloques (necesitaremos crearlos como React)
import SinglePostInfoBlock from '../blocks-react/SinglePostInfoBlock'
import SinglePostSectionBlock from '../blocks-react/SinglePostSectionBlock'
import PostMediaBlock from '../blocks-react/PostMediaBlock'
import PostGalleryGridBlock from '../blocks-react/PostGalleryGridBlock'
import PostCardsBlock from '../blocks-react/PostCardsBlock'
import StatsBlock from '../blocks-react/StatsBlock'
import PostNextProjectBlock from '../blocks-react/PostNextProjectBlock'
import RichTextBlock from '../blocks-react/RichTextBlock'

export const jsxConverter = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...headingConverter,
  blocks: {
    singlePostInfo: ({ node }: any) => <SinglePostInfoBlock {...node.fields} />,
    singlePostSection: ({ node }: any) => <SinglePostSectionBlock {...node.fields} />,
    postMedia: ({ node }: any) => <PostMediaBlock {...node.fields} />,
    postGalleryGrid: ({ node }: any) => <PostGalleryGridBlock {...node.fields} />,
    postCards: ({ node }: any) => <PostCardsBlock {...node.fields} />,
    stats: ({ node }: any) => <StatsBlock {...node.fields} />,
    postNextProject: ({ node }: any) => <PostNextProjectBlock {...node.fields} />,
    richText: ({ node }: any) => <RichTextBlock {...node.fields} />,
  },
})