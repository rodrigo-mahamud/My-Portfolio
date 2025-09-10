import React from 'react'
import type { RichTextBlock as RichTextProps } from '../../../utils/payload'

// Componente placeholder - aquí puedes implementar renderizado adicional si es necesario
export default function RichTextBlock(props: RichTextProps) {
  // Este bloque ya se renderiza por el convertidor principal
  // Solo lo incluimos para completar el sistema
  return (
    <div className="rich-text-block">
      {/* El contenido se renderiza automáticamente por el convertidor */}
      <div>Nested RichText Block</div>
    </div>
  )
}