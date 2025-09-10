import React from 'react'
import type { SinglePostInfoBlock as SinglePostInfoProps } from '../../../utils/payload'

export default function SinglePostInfoBlock(props: SinglePostInfoProps) {
  return (
    <div className="single-post-info-block bg-gray-900 p-6 rounded-lg mb-8">
      <p className="text-gray-300">SinglePostInfo Block - {props.rol}</p>
    </div>
  )
}