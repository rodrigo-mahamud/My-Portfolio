import React from 'react'
import { YouTube } from '@astro-community/astro-embed-youtube'
import { Icon } from 'astro-icon/components'

interface WorkCard {
  ytId: string
  title: string
  description: string
  info: Array<{
    icon: string
    text: string
  }>
}

interface WorkCardsBlockProps {
  cards: WorkCard[]
}

const WorkCardsBlock: React.FC<WorkCardsBlockProps> = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <section className="h-full mt-16 mb-8 md:mb-20">
      <div className="grid md:grid-cols-2 gap-7 gap-y-14">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col border border-[#f2f2f248] rounded-xl md:rounded-2xl overflow-hidden animate-on-scroll"
            data-type="simple"
            data-duration="1.5"
            data-easing="Expo.easeOut"
          >
            <div className="flex h-[30vh] md:h-[17vh] 2xl:h-[40vh]">
              <iframe
                className="w-full cursor-none custom-mouse shadow-[inset_0px_-200px_100px_-100px_#0a0118] bg-center"
                data-typemouse="play"
                src={`https://www.youtube.com/embed/${card.ytId}`}
                title={card.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-col workCardBorderGlow px-5 md:px-8">
              <h2 className="mb-2 mt-10 text-white text-lg font-semibold">{card.title}</h2>
              <h3 className="mb-2">{card.description}</h3>

              {card.info && card.info.map((info, infoIndex) => (
                <div key={infoIndex} className="flex py-2 md:py-3 last:pb-10 justify-start items-center">
                  <span className="w-5 h-5 md:text-2xl mr-5 text-white">
                    {getIconSvg(info.icon)}
                  </span>
                  <p className="text-pretty text-sm w-fit">{info.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function getIconSvg(iconName: string) {
  const icons: { [key: string]: JSX.Element } = {
    calendarTime: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    ),
    thumbUp: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.26l3.03-7.08c.09-.23.12-.47.12-.72v-2z"/>
      </svg>
    ),
    eye: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
    ),
    clock: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    star: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
    heart: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    play: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
  }
  
  return icons[iconName] || icons.star
}

export default WorkCardsBlock