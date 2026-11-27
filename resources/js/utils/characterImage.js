import aotData from '../../../storage/app/characters/aot.json';
import narutoData from '../../../storage/app/characters/naruto.json';

const CACHE_PREFIX = 'tk_wiki_char_v6_';
const memoryCache = new Map();
const inFlightRequests = new Map();

const ALL_CHARACTERS = [...aotData, ...narutoData];
const BY_ID = new Map();
const BY_NAME = new Map();

for (const item of ALL_CHARACTERS) {
  if (item.id) BY_ID.set(item.id.toLowerCase(), item);
  if (item.name) BY_NAME.set(`${item.anime}:${item.name.toLowerCase()}`, item);
}

const WIKI_ENDPOINTS = {
  AOT: {
    fullName: 'Attack on Titan',
    api: 'https://attackontitan.fandom.com/api.php',
  },
  Naruto: {
    fullName: 'Naruto',
    api: 'https://naruto.fandom.com/api.php',
  },
};

function normalizeAnime(anime) {
  const key = String(anime || '').toLowerCase().replace(/[^a-z]/g, '');
  if (key === 'aot' || key === 'attackontitan') return 'AOT';
  if (key === 'naruto') return 'Naruto';
  return null;
}

async function fetchCombinedWikiImage(name, animeKey) {
  const cfg = WIKI_ENDPOINTS[animeKey];
  if (!cfg) return '';

  const cleanName = String(name || '').replace(/\([^)]*\)/g, '').trim();
  const combinedQuery = `${cleanName} ${cfg.fullName}`;

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: combinedQuery,
    gsrlimit: '3',
    prop: 'pageimages',
    pithumbsize: '500',
    format: 'json',
    origin: '*',
  });

  try {
    const res = await fetch(`${cfg.api}?${params.toString()}`);
    if (!res.ok) return '';
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {});
    if (!pages.length) return '';

    pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
    const match =
      pages.find((p) => p.title?.toLowerCase() === cleanName.toLowerCase()) ||
      pages.find((p) => p.thumbnail?.source);

    return match?.thumbnail?.source || '';
  } catch {
    return '';
  }
}

export async function getCharacterImageUrl(characterOrName, animeHint) {
  const isObj = typeof characterOrName === 'object' && characterOrName !== null;
  const id = isObj ? characterOrName.id : '';
  const name = isObj ? characterOrName.name : String(characterOrName || '');
  const animeKey = normalizeAnime(isObj ? characterOrName.anime : animeHint);

  const jsonRecord =
    (id && BY_ID.get(id.toLowerCase())) ||
    (animeKey && name && BY_NAME.get(`${animeKey}:${name.toLowerCase()}`));

  if (jsonRecord?.image) return jsonRecord.image;
  if (isObj && characterOrName.image) return characterOrName.image;
  if (!name) return '';

  const cacheKey = `${animeKey || 'any'}_${name.toLowerCase()}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  try {
    const cached = localStorage.getItem(CACHE_PREFIX + cacheKey);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }
  } catch {
    // Abaikan error storage
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const req = fetchCombinedWikiImage(name, animeKey).then((url) => {
    inFlightRequests.delete(cacheKey);
    if (url) {
      memoryCache.set(cacheKey, url);
      try {
        localStorage.setItem(CACHE_PREFIX + cacheKey, url);
      } catch {
        // Abaikan error storage
      }
    }
    return url;
  });

  inFlightRequests.set(cacheKey, req);
  return req;
}