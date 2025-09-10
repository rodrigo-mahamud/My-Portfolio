import React from 'react'
import type { StatsBlock as StatsProps } from '../../../utils/payload'

export default function StatsBlock(props: StatsProps) {
  return (
    <div className="stats-block mb-8">
      <p className="text-gray-300">Stats Block</p>
    </div>
  )
}