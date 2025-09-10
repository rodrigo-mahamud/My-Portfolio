export interface HeadingItem {
  id: string;
  text: string;
  level: number;
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50)
}

function extractTextFromNode(node: any): string {
  if (!node) return '';
  
  if (typeof node === 'string') {
    return node;
  }
  
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join('');
  }
  
  if (node.text) {
    return node.text;
  }
  
  if (node.children) {
    return extractTextFromNode(node.children);
  }
  
  return '';
}

function traverseNodes(nodes: any[], headings: HeadingItem[] = []): HeadingItem[] {
  if (!nodes || !Array.isArray(nodes)) return headings;
  
  nodes.forEach(node => {
    if (node.type === 'heading' && node.tag) {
      const text = extractTextFromNode(node.children);
      const level = parseInt(node.tag.replace('h', ''));
      
      if (text.trim()) {
        headings.push({
          id: generateAnchorId(text),
          text: text.trim(),
          level,
          tag: node.tag as HeadingItem['tag']
        });
      }
    }
    
    if (node.children && Array.isArray(node.children)) {
      traverseNodes(node.children, headings);
    }
  });
  
  return headings;
}

export function extractHeadingsFromRichText(richTextData: any): HeadingItem[] {
  if (!richTextData) return [];
  
  try {
    const nodes = richTextData.root?.children || richTextData.children || [];
    return traverseNodes(nodes);
  } catch (error) {
    console.warn('Error extracting headings from rich text:', error);
    return [];
  }
}