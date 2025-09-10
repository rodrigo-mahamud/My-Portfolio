import React from 'react'
import type { PostMediaBlock as PostMediaProps } from '../../../utils/payload'

export default function PostMediaBlock(props: PostMediaProps) {
  return (
    <div className="post-media-block mb-8">
      <p className="text-gray-300">PostMedia Block</p>
    </div>
  )
}