import React from 'react'
import type { SinglePostSectionBlock as SinglePostSectionProps } from '../../../utils/payload'

export default function SinglePostSectionBlock(props: SinglePostSectionProps) {
  return (
    <div className="single-post-section-block mb-8">
      <h3 className="text-2xl font-semibold text-white mb-4">{props.title}</h3>
      <p className="text-gray-300">SinglePostSection Block</p>
    </div>
  )
}