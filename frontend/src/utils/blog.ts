// Simplified Payload fetching utilities following official Astro-Payload pattern

const PAYLOAD_API_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

export async function fetchWorks() {
  const res = await fetch(`${PAYLOAD_API_URL}/works`);
  const data = await res.json();
  return data.docs;
}

export async function fetchWorkBySlug(slug: string) {
  const res = await fetch(`${PAYLOAD_API_URL}/works?where[slug][equals]=${slug}`);
  const data = await res.json();
  return data.docs[0] || null;
}

export async function fetchLatestWorks(limit: number = 6) {
  const res = await fetch(`${PAYLOAD_API_URL}/works?limit=${limit}&sort=-publishDate`);
  const data = await res.json();
  return data.docs;
}

// Legacy exports for backwards compatibility
export const fetchPosts = fetchWorks;
export const findLatestPosts = fetchLatestWorks;