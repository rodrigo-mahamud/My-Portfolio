// Payload CMS API utilities
import { convertLexicalToHTML } from './lexicalToHtml'

const PAYLOAD_API_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api'

// Block types
export interface SinglePostInfoBlock {
  blockType: 'singlePostInfo'
  rol: string
  status: 'done' | 'in progress' | 'on hold' | 'cancelled'
  duration: string
  overview: any // Rich text
  title?: string
  team?: any // Rich text
}

export interface SinglePostSectionBlock {
  blockType: 'singlePostSection'
  preTitle?: string
  title: string
  content: any // Rich text
}

export interface PostMediaBlock {
  blockType: 'postMedia'
  mediaFile: {
    id: string
    url: string
    alt?: string
  }
  caption?: any // Rich text
  delay?: number
  frame?: boolean
  layout?: 'single' | 'half' | 'two-columns'
}

export interface PostGalleryGridBlock {
  blockType: 'postGalleryGrid'
  title?: string
  subtitle?: string
  mediaType?: 'videos' | 'images' | 'mixed'
  items: Array<{
    mediaFile: {
      id: string
      url: string
      alt?: string
    }
    title: string
    subtitle?: string
  }>
  columns?: '1' | '2' | '3' | '4'
}

export interface PostCardsBlock {
  blockType: 'postCards'
  cards: Array<{
    ytId: string
    title: string
    description: string
    info?: Array<{
      icon: string
      text: string
    }>
  }>
}

export interface StatsBlock {
  blockType: 'stats'
  title?: string
  stats: Array<{
    title: string
    amount: string
    description?: string
  }>
  layout?: 'grid' | 'row' | 'vertical'
}

export interface PostNextProjectBlock {
  blockType: 'postNextProject'
  nextProject?: PayloadWork
  customImage?: {
    id: string
    url: string
    alt?: string
  }
  customTitle?: string
  customDescription?: string
  customUrl?: string
}

export interface RichTextBlock {
  blockType: 'richText'
  content: any // Rich text
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full'
}

export type PayloadBlock = 
  | SinglePostInfoBlock
  | SinglePostSectionBlock
  | PostMediaBlock
  | PostGalleryGridBlock
  | PostCardsBlock
  | StatsBlock
  | PostNextProjectBlock
  | RichTextBlock

export interface PayloadWork {
  id: string
  title: string
  author: string
  excerpt?: string
  content?: any // Rich text content
  publishDate?: string
  image: {
    id: string
    url: string
    alt?: string
    width?: number
    height?: number
  }
  accentColor?: string
  slug: string
  postIndex?: Array<{
    label: string
    anchor: string
  }>
  layout?: PayloadBlock[]
  canonical?: string
}

export interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

class PayloadAPI {
  private baseUrl: string

  constructor(baseUrl: string = PAYLOAD_API_URL) {
    this.baseUrl = baseUrl
  }

  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`Payload API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching from Payload: ${url}`, error)
      throw error
    }
  }

  // Get all works with pagination
  async getWorks(options: {
    limit?: number
    page?: number
    where?: object
    sort?: string
    depth?: number
  } = {}): Promise<PayloadResponse<PayloadWork>> {
    const params = new URLSearchParams()
    
    if (options.limit) params.set('limit', String(options.limit))
    if (options.page) params.set('page', String(options.page))
    if (options.where) params.set('where', JSON.stringify(options.where))
    if (options.sort) params.set('sort', options.sort)
    // Add depth parameter to populate relationships
    params.set('depth', String(options.depth || 2))

    const queryString = params.toString()
    const endpoint = `/works${queryString ? `?${queryString}` : ''}`
    
    return this.fetchAPI<PayloadResponse<PayloadWork>>(endpoint)
  }

  // Get a single work by slug
  async getWorkBySlug(slug: string): Promise<PayloadWork | null> {
    try {
      const response = await this.getWorks({
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2 // Populate image relationship
      })
      
      return response.docs[0] || null
    } catch (error) {
      console.error(`Error fetching work by slug: ${slug}`, error)
      return null
    }
  }

  // Get recent works for homepage
  async getLatestWorks(limit: number = 6): Promise<PayloadWork[]> {
    try {
      const response = await this.getWorks({
        limit,
        sort: '-publishDate',
        depth: 2 // Populate image relationship
      })
      
      return response.docs
    } catch (error) {
      console.error('Error fetching latest works', error)
      return []
    }
  }

  // Get work by ID
  async getWorkById(id: string): Promise<PayloadWork | null> {
    try {
      return await this.fetchAPI<PayloadWork>(`/works/${id}?depth=2`)
    } catch (error) {
      console.error(`Error fetching work by ID: ${id}`, error)
      return null
    }
  }

  // Convert Payload rich text (Lexical) to HTML.
  // Delegates to the full converter so links, bold, lists, line breaks, etc. render.
  richTextToHTML(richText: any): string {
    if (!richText || !richText.root) return ''
    try {
      return convertLexicalToHTML(richText).html
    } catch (error) {
      console.error('Error converting rich text to HTML', error)
      return ''
    }
  }

  // Get media URL with proper base URL
  getMediaUrl(mediaObject: any): string {
    if (!mediaObject) return ''
    
    if (typeof mediaObject === 'string') {
      return mediaObject.startsWith('http') ? mediaObject : `${this.baseUrl.replace('/api', '')}${mediaObject}`
    }
    
    if (mediaObject.url) {
      return mediaObject.url.startsWith('http') 
        ? mediaObject.url 
        : `${this.baseUrl.replace('/api', '')}${mediaObject.url}`
    }
    
    return ''
  }
}

// Export singleton instance
export const payloadAPI = new PayloadAPI()

// Helper functions for compatibility with existing blog utils
export async function fetchWorksFromPayload(): Promise<PayloadWork[]> {
  try {
    const response = await payloadAPI.getWorks({ 
      sort: '-publishDate',
      depth: 2 // Populate image relationship
    })
    return response.docs
  } catch (error) {
    console.error('Error fetching works from Payload', error)
    return []
  }
}

export async function findLatestWorksFromPayload(limit: number = 6): Promise<PayloadWork[]> {
  return payloadAPI.getLatestWorks(limit)
}

export async function getWorkBySlugFromPayload(slug: string): Promise<PayloadWork | null> {
  return payloadAPI.getWorkBySlug(slug)
}