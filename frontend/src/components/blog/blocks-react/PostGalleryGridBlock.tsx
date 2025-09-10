import React from 'react'
import type { PostGalleryGridBlock as PostGalleryGridProps } from '../../../utils/payload'

export default function PostGalleryGridBlock(props: PostGalleryGridProps) {
  return (
    <div className="post-gallery-grid-block mb-8">
      <p className="text-gray-300">PostGalleryGrid Block</p>
    </div>
  )
}