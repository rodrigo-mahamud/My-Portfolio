import type { SerializedEditorState } from 'lexical';

export interface LexicalNode {
  type: string;
  tag?: string;
  format?: number;
  indent?: number;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  url?: string;
  fields?: {
    linkType?: string;
    newTab?: boolean;
    doc?: {
      value: any;
      relationTo: string;
    };
    blockType?: string;
    cards?: any;
  };
}

export interface HeadingInfo {
  id: string;
  text: string;
  level: string;
}

function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function extractTextFromNodes(nodes: LexicalNode[]): string {
  let text = '';
  for (const node of nodes) {
    if (node.text) {
      text += node.text;
    }
    if (node.children) {
      text += extractTextFromNodes(node.children);
    }
  }
  return text;
}

export interface BlockItem {
  type: 'html' | 'block';
  content?: string;
  blockType?: string;
  data?: any;
}

function convertNodeToBlocks(node: LexicalNode, headings: HeadingInfo[] = []): BlockItem[] {
  if (!node) return [];

  switch (node.type) {
    case 'root':
      return node.children?.flatMap((child) => convertNodeToBlocks(child, headings)) || [];

    case 'block': {
      if (node.fields) {
        // Check if it's a WorkCards block
        if (node.fields.blockType === 'workCards' && node.fields.cards) {
          return [{
            type: 'block',
            blockType: 'workCards',
            data: { cards: node.fields.cards }
          }];
        }
        // Handle other block types here if needed
      }
      return [];
    }

    default:
      // For non-block elements, convert to HTML
      const html = convertNodeToHTML(node, headings);
      return html ? [{ type: 'html', content: html }] : [];
  }
}

function convertNodeToHTML(node: LexicalNode, headings: HeadingInfo[] = []): string {
  if (!node) return '';

  switch (node.type) {
    case 'root':
      return node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';

    case 'paragraph':
      const paragraphContent = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return paragraphContent ? `<p class="text-gray-300 mb-4">${paragraphContent}</p>` : '';

    case 'heading': {
      const headingContent = extractTextFromNodes(node.children || []);
      const id = generateAnchorId(headingContent);
      const level = node.tag || 'h2';

      headings.push({
        id,
        text: headingContent,
        level,
      });

      const headingClasses = {
        h1: 'text-5xl font-bold mb-6 mt-8 text-white scroll-mt-8',
        h2: 'text-4xl font-bold mb-5 mt-7 text-white scroll-mt-8',
        h3: 'text-3xl font-semibold mb-4 mt-6 text-white scroll-mt-8',
        h4: 'text-2xl font-semibold mb-3 mt-5 text-white scroll-mt-8',
        h5: 'text-xl font-medium mb-3 mt-4 text-white scroll-mt-8',
        h6: 'text-lg font-medium mb-2 mt-3 text-white scroll-mt-8',
      };

      const className = headingClasses[level as keyof typeof headingClasses] || 'text-white';
      const content = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return `<${level} id="${id}" class="${className}">${content}</${level}>`;
    }

    case 'text': {
      let text = node.text || '';

      if (node.format) {
        if (node.format & 1) text = `<strong class="text-white font-semibold">${text}</strong>`;
        if (node.format & 2) text = `<em class="text-gray-200 italic">${text}</em>`;
        if (node.format & 8) text = `<u>${text}</u>`;
        if (node.format & 16) text = `<s>${text}</s>`;
        if (node.format & 32) text = `<code class="text-blue-300 bg-gray-900 px-1 py-0.5 rounded">${text}</code>`;
      }

      return text;
    }

    case 'list': {
      const listTag = node.tag === 'ol' ? 'ol' : 'ul';
      const listClass =
        node.tag === 'ol'
          ? 'list-decimal list-inside text-gray-300 mb-4 ml-4'
          : 'list-disc list-inside text-gray-300 mb-4 ml-4';
      const items = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return `<${listTag} class="${listClass}">${items}</${listTag}>`;
    }

    case 'listitem':
      const itemContent = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return `<li class="mb-2">${itemContent}</li>`;

    case 'quote':
      const quoteContent = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return `<blockquote class="border-l-4 border-blue-500 pl-4 text-gray-400 italic mb-4">${quoteContent}</blockquote>`;

    case 'link': {
      const linkContent = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      const url = node.fields?.doc ? `/works/${node.fields.doc.value?.slug || ''}` : node.url || '#';
      const target = node.fields?.newTab ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" class="text-blue-400 hover:text-blue-300 underline" ${target}>${linkContent}</a>`;
    }

    case 'horizontalrule':
      return '<hr class="border-gray-700 my-8" />';

    case 'linebreak':
      return '<br />';

    case 'code': {
      const codeContent = node.children?.map((child) => convertNodeToHTML(child, headings)).join('') || '';
      return `<pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-blue-300">${codeContent}</code></pre>`;
    }

    case 'block':
      // Blocks are handled separately in convertNodeToBlocks
      return '';

    default:
      if (node.children) {
        return node.children.map((child) => convertNodeToHTML(child, headings)).join('');
      }
      return '';
  }
}

export function convertLexicalToHTML(data: SerializedEditorState | null): { html: string; headings: HeadingInfo[]; blocks: BlockItem[] } {
  if (!data || !data.root) {
    return {
      html: '<p class="text-gray-500 italic">No hay contenido para mostrar</p>',
      headings: [],
      blocks: [{ type: 'html', content: '<p class="text-gray-500 italic">No hay contenido para mostrar</p>' }]
    };
  }

  const headings: HeadingInfo[] = [];
  const blocks = convertNodeToBlocks(data.root as LexicalNode, headings);
  const html = convertNodeToHTML(data.root as LexicalNode, headings);

  return { html, headings, blocks };
}
