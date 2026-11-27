import fs from 'node:fs/promises';
import path from 'node:path';

const FILES = [
  path.resolve('storage/app/characters/aot.json'),
  path.resolve('storage/app/characters/naruto.json'),
];

const ANIME_CONFIG = {
  AOT: {
    fullName: 'Attack on Titan',
    wikiApi: 'https://attackontitan.fandom.com/api.php',
    keywords: ['shingeki no kyojin', 'attack on titan'],
  },
  Naruto: {
    fullName: 'Naruto',
    wikiApi: 'https://naruto.fandom.com/api.php',
    keywords: ['naruto', 'shippuuden', 'shippuden'],
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. Cari kombinasi "Nama Karakter + Anime" di Fandom Wiki API
async function searchFandomWiki(charName, animeKey) {
  const cfg = ANIME_CONFIG[animeKey];
  if (!cfg) return '';

  const cleanName = charName.replace(/\([^)]*\)/g, '').trim();
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
    const res = await fetch(`${cfg.wikiApi}?${params.toString()}`);
    if (!res.ok) return '';
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {});
    if (!pages.length) return '';

    pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));

    const exactPage =
      pages.find((p) => p.title?.toLowerCase() === cleanName.toLowerCase()) ||
      pages.find((p) => p.thumbnail?.source);

    return exactPage?.thumbnail?.source || '';
  } catch {
    return '';
  }
}

// 2. Cadangan: Cari di Jikan API dengan query gabungan "Nama Karakter + Anime"
async function searchJikanCombined(charName, animeKey) {
  const cfg = ANIME_CONFIG[animeKey];
  const cleanName = charName.replace(/\([^)]*\)/g, '').trim();
  const combinedQuery = cfg ? `${cleanName} ${cfg.fullName}` : cleanName;

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(combinedQuery)}&limit=3`
    );
    if (!res.ok) return '';
    const json = await res.json();
    const first = json?.data?.[0];
    return (
      first?.images?.jpg?.image_url ||
      first?.images?.webp?.image_url ||
      ''
    );
  } catch {
    return '';
  }
}

async function processFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const characters = JSON.parse(raw);
  let updated = 0;

  for (const char of characters) {
    if (char.image && char.image.startsWith('http')) continue;

    // Coba cari kombinasi nama utama + anime, lalu coba alias jika belum ketemu
    const candidates = Array.from(
      new Set([char.name, ...(char.aliases || []).filter((a) => a.length >= 4)])
    ).slice(0, 3);

    let imageUrl = '';
    for (const candidateName of candidates) {
      imageUrl = await searchFandomWiki(candidateName, char.anime);
      await sleep(250);
      if (imageUrl) break;
    }

    if (!imageUrl) {
      imageUrl = await searchJikanCombined(char.name, char.anime);
      await sleep(650);
    }

    if (imageUrl) {
      char.image = imageUrl;
      updated++;
      console.log(`[OK] ${char.name} (${char.anime}) -> ${imageUrl}`);
    } else {
      console.warn(`[MISS] ${char.name} (${char.anime})`);
    }
  }

  await fs.writeFile(filePath, JSON.stringify(characters, null, 2) + '\n', 'utf8');
  console.log(`Selesai ${path.basename(filePath)}: ${updated} gambar terisi.\n`);
}

for (const file of FILES) {
  await processFile(file);
}