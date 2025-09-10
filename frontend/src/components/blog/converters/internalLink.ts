export const internalDocToHref = ({ linkNode }: { linkNode: any }) => {
  const { value, relationTo } = linkNode.fields.doc!
  const slug = typeof value !== 'string' && value.slug

  if (relationTo === 'works') {
    return `/works/${slug}`
  } else if (relationTo === 'users') {
    return `/users/${slug}`
  } else {
    return `/${slug}`
  }
}