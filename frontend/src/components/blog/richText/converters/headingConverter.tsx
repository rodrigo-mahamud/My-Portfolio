import React from 'react'

// Función helper para generar ID único desde el texto
function generateAnchorId(textElements: any[]): string {
  return textElements
    .map(el => typeof el === 'string' ? el : el?.props?.children || '')
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s]/g, '') // Solo letras, números y espacios
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .substring(0, 50) // Limitar longitud
}

export const headingConverter = {
  heading: ({ node, nodesToJSX }: any) => {
    const text = nodesToJSX({ nodes: node.children })
    const Tag = node.tag
    const id = generateAnchorId(text)

    // Estilos por tipo de encabezado
    const headingStyles = {
      h1: 'text-5xl font-bold mb-6 mt-8 text-white scroll-mt-8',
      h2: 'text-4xl font-bold mb-5 mt-7 text-white scroll-mt-8', 
      h3: 'text-3xl font-semibold mb-4 mt-6 text-white scroll-mt-8',
      h4: 'text-2xl font-semibold mb-3 mt-5 text-white scroll-mt-8',
      h5: 'text-xl font-medium mb-3 mt-4 text-white scroll-mt-8',
      h6: 'text-lg font-medium mb-2 mt-3 text-white scroll-mt-8',
    }

    const className = headingStyles[node.tag as keyof typeof headingStyles] || 'text-white'

    return React.createElement(
      Tag,
      { 
        id, 
        className,
        'data-heading-level': node.tag,
        'data-heading-text': text.join('').replace(/[^\w\s]/gi, '').trim()
      },
      text
    )
  }
}