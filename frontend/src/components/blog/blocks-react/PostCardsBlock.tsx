import React from 'react'
import type { PostCardsBlock as PostCardsProps } from '../../../utils/payload'

export default function PostCardsBlock(props: PostCardsProps) {
  return (
    <div className="post-cards-block mb-8">
      <p className="text-gray-300">PostCards Block</p>
    </div>
  )
}