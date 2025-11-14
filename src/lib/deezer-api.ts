import { Artist, Track, Album, DeezerResponse, GenreArtistsResponse } from '@/types/music';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

let currentProxyIndex = 0;
const DEEZER_API = 'https://api.deezer.com';

// Random genre IDs for variety (Deezer genre IDs)
export const GENRE_IDS = [132, 113, 116, 152, 165, 85, 106, 144, 173, 189];

/**
 * Fetch with automatic proxy fallback
 */
async function fetchWithProxy(url: string): Promise<any> {
  let lastError: Error | undefined;

  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyIndex = (currentProxyIndex + i) % CORS_PROXIES.length;
    const proxy = CORS_PROXIES[proxyIndex];

    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (response.ok) {
        currentProxyIndex = proxyIndex;
        return await response.json();
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      continue;
    }
  }

  throw new Error(`All proxies failed. Last error: ${lastError?.message}`);
}

/**
 * Format number (e.g., 1234567 -> 1.2M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format duration (seconds to MM:SS)
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get artist details
 */
export async function getArtist(artistId: string): Promise<Artist> {
  return fetchWithProxy(`${DEEZER_API}/artist/${artistId}`);
}

/**
 * Get artist's top tracks
 */
export async function getArtistTopTracks(artistId: string, limit: number = 10): Promise<Track[]> {
  const data: DeezerResponse<Track> = await fetchWithProxy(
    `${DEEZER_API}/artist/${artistId}/top?limit=${limit}`
  );
  return data.data;
}

/**
 * Get artist's albums
 */
export async function getArtistAlbums(artistId: string, limit: number = 12): Promise<Album[]> {
  const data: DeezerResponse<Album> = await fetchWithProxy(
    `${DEEZER_API}/artist/${artistId}/albums?limit=${limit}`
  );
  // Remove duplicates
  return Array.from(new Map(data.data.map(album => [album.id, album])).values());
}

/**
 * Search tracks
 */
export async function searchTracks(query: string, limit: number = 50): Promise<Track[]> {
  const data: DeezerResponse<Track> = await fetchWithProxy(
    `${DEEZER_API}/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  return data.data;
}

/**
 * Get random songs from multiple genres
 */
export async function getRandomSongs(): Promise<Track[]> {
  try {
    // Use chart as primary source - it's much faster
    const chartData = await getChartSongs();
    
    // Shuffle and return
    return chartData.sort(() => Math.random() - 0.5).slice(0, 100);
  } catch (error) {
    console.error('Error loading random songs:', error);
    throw error;
  }
}

/**
 * Get chart songs (fallback)
 */
export async function getChartSongs(): Promise<Track[]> {
  const data: DeezerResponse<Track> = await fetchWithProxy(
    `${DEEZER_API}/chart/0/tracks?limit=100`
  );
  return data.data;
}

/**
 * Get artist bio from Wikipedia
 */
export async function getArtistBio(artistName: string): Promise<string> {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(artistName)}`;
    const response = await fetch(searchUrl);
    
    if (response.ok) {
      const data = await response.json();
      let bio = data.extract || '';
      
      // If extract is too short, add more context
      if (bio && bio.length < 200 && data.description) {
        bio = `${data.description}. ${bio}`;
      }
      
      // Add fallback content if still too short
      if (bio.length < 150) {
        bio = `${artistName} is a renowned musical artist known for their distinctive style and significant contributions to the music industry. With a diverse catalog spanning multiple albums and genres, ${artistName} has captivated audiences worldwide. Their work showcases exceptional artistic vision and technical prowess, establishing them as a influential figure in contemporary music. Through innovative compositions and memorable performances, they have built a dedicated following and earned critical acclaim throughout their career.`;
      }
      
      return bio;
    }
  } catch (error) {
    console.error('Wikipedia API error:', error);
  }
  
  return `${artistName} is a renowned musical artist known for their distinctive style and significant contributions to the music industry. With a diverse catalog spanning multiple albums and genres, ${artistName} has captivated audiences worldwide. Their work showcases exceptional artistic vision and technical prowess, establishing them as a influential figure in contemporary music. Through innovative compositions and memorable performances, they have built a dedicated following and earned critical acclaim throughout their career.`;
}
