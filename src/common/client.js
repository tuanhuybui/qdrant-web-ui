export default function qdrantClient({ apiKey }) {
  let url;
  let port = 6333;

  if (import.meta.env.VITE_QDRANT_API_URL) {
    url = import.meta.env.VITE_QDRANT_API_URL;
    try {
      const parsed = new URL(url);
      port = parsed.port || (parsed.protocol === 'https:' ? 443 : 80);
    } catch (e) {
      console.warn('Invalid VITE_QDRANT_API_URL:', url);
    }
  } else if (process.env.NODE_ENV === 'development') {
    url = 'http://localhost:6333';
  } else {
    url = getBaseURL();
    port = window.location.port || (window.location.protocol === 'https:' ? 443 : 80);
  }

  const options = {
    url,
    apiKey,
    port,
  };

  return new QdrantClientExtended(options);
}
