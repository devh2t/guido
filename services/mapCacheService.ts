
import { Tour } from '../types';

const TILE_CACHE_NAME = 'kuratour-map-tiles-v1';
const TILE_URL_TEMPLATE = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

/**
 * Caches map tiles for a specific tour to allow offline map viewing.
 * Limits caching to a reasonable zoom range around stops to save space.
 */
export const cacheTourMapTiles = async (tour: Tour): Promise<void> => {
  if (!('caches' in window)) return;

  const cache = await caches.open(TILE_CACHE_NAME);
  const zoomLevels = [13, 14, 15]; // Detail levels needed for city exploration
  const subdomains = ['a', 'b', 'c', 'd'];
  
  const urlsToCache: string[] = [];

  for (const stop of tour.stops) {
    for (const z of zoomLevels) {
      const x = Math.floor((stop.longitude + 180) / 360 * Math.pow(2, z));
      const y = Math.floor((1 - Math.log(Math.tan(stop.latitude * Math.PI / 180) + 1 / Math.cos(stop.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));

      // Cache a 3x3 grid around each stop for better coverage
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const s = subdomains[Math.abs(x + dx + y + dy) % subdomains.length];
          const url = TILE_URL_TEMPLATE
            .replace('{s}', s)
            .replace('{z}', z.toString())
            .replace('{x}', (x + dx).toString())
            .replace('{y}', (y + dy).toString())
            .replace('{r}', '');
          urlsToCache.push(url);
        }
      }
    }
  }

  // Remove duplicates and add to cache
  const uniqueUrls = Array.from(new Set(urlsToCache));
  try {
    await cache.addAll(uniqueUrls);
    console.log(`Cached ${uniqueUrls.length} map tiles for ${tour.city}`);
  } catch (e) {
    console.warn('Failed to cache some map tiles', e);
  }
};
