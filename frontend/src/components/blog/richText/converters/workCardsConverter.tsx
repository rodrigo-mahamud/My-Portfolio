import React from 'react'
import WorkCardsBlockWrapper from '../blocks/WorkCardsBlockWrapper'

export const workCardsConverter = {
  blocks: {
    workCards: ({ node }: any) => {
      const { cards } = node.fields
      
      if (!cards || cards.length === 0) {
        return null
      }

      return <WorkCardsBlockWrapper cards={cards} />
    },
  },
}