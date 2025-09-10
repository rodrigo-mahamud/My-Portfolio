import React from 'react'

export const headingConverter = {
  heading: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children })
    const Tag = node.tag

    if (node.tag === 'h2') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h2 id={id} className="text-4xl font-bold mb-5 mt-7 text-white">{text}</h2>
    } else if (node.tag === 'h1') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h1 id={id} className="text-5xl font-bold mb-6 mt-8 text-white">{text}</h1>
    } else if (node.tag === 'h3') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h3 id={id} className="text-3xl font-semibold mb-4 mt-6 text-white">{text}</h3>
    } else if (node.tag === 'h4') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h4 id={id} className="text-2xl font-semibold mb-3 mt-5 text-white">{text}</h4>
    } else if (node.tag === 'h5') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h5 id={id} className="text-xl font-medium mb-3 mt-4 text-white">{text}</h5>
    } else if (node.tag === 'h6') {
      const id = text.join("").toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      return <h6 id={id} className="text-lg font-medium mb-2 mt-3 text-white">{text}</h6>
    } else {
      return <Tag className="text-white">{text}</Tag>
    }
  }
}