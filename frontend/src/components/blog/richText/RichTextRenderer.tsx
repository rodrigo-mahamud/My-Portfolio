import React from 'react'
import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import { jsxConverter } from './converters'

type Props = {
  data: any // Rich text data from Payload
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export default function RichTextRenderer(props: Props) {
  const { className, data, ...rest } = props

  if (!data) {
    return (
      <div className={`rich-text-content ${className || ''}`}>
        <p className="text-gray-500 italic">No hay contenido para mostrar</p>
      </div>
    )
  }

  return (
    <div 
      className={`rich-text-content prose prose-lg prose-invert max-w-none
        prose-headings:text-white 
        prose-p:text-gray-300 
        prose-strong:text-white
        prose-em:text-gray-200
        prose-blockquote:text-gray-400
        prose-blockquote:border-blue-500
        prose-code:text-blue-300
        prose-pre:bg-gray-900
        prose-ol:text-gray-300
        prose-ul:text-gray-300
        prose-li:text-gray-300
        prose-hr:border-gray-700
        prose-a:text-blue-400
        prose-a:hover:text-blue-300
        ${className || ''}`}
      {...rest}
    >
      <RichTextConverter
        data={data}
        converters={jsxConverter}
      />
    </div>
  )
}