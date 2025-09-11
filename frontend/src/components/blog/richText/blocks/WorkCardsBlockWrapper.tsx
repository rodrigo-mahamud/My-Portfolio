import React from 'react'

interface WorkCard {
  ytId: string
  title: string
  description: string
  info: Array<{
    icon: string
    text: string
  }>
}

interface WorkCardsBlockWrapperProps {
  cards: WorkCard[]
}

// This is a wrapper component that passes data to be rendered by the Astro component
const WorkCardsBlockWrapper: React.FC<WorkCardsBlockWrapperProps> = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return null
  }

  // Pass data as a data attribute for Astro component to pick up
  return (
    <div 
      className="work-cards-block-container"
      data-cards={JSON.stringify(cards)}
      data-component="WorkCardsBlock"
    />
  )
}

export default WorkCardsBlockWrapper