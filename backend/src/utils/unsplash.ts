const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

interface UnsplashImage {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  // other fields you might use
}

/**
 * Fetches up to `count` random images matching `query` from Unsplash.
 * Returns an array of URLs (regular size).
 */
export const getUnsplashImages = async (
  query: string,
  count: number = 2
): Promise<string[]> => {
  const urls: string[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const resp = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          query
        )}&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (!resp.ok) {
        console.warn(
          `Unsplash fetch failed for "${query}" (attempt ${i + 1}) — ${resp.statusText}`
        );
        continue;
      }
      const data = (await resp.json()) as UnsplashImage;
      if (data.urls && data.urls.regular) {
        urls.push(data.urls.regular);
      }
    } catch (err) {
      console.error("Error fetching from Unsplash:", err);
    }
  }

  return urls;
};
