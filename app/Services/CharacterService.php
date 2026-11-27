<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class CharacterService
{
    private string $directory;

    public function __construct()
    {
        $this->directory = storage_path('app/characters');
    }

    /**
     * Load all character files grouped by theme name.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function allByTheme(): array
    {
        if (! File::isDirectory($this->directory)) {
            return [];
        }

        $grouped = [];

        foreach (File::files($this->directory) as $file) {
            if ($file->getExtension() !== 'json') {
                continue;
            }

            $decoded = json_decode(File::get($file->getPathname()), true);
            if (! is_array($decoded)) {
                continue;
            }

            foreach ($decoded as $item) {
                if (! is_array($item) || empty($item['id']) || empty($item['anime'])) {
                    continue;
                }

                $theme = (string) $item['anime'];
                $grouped[$theme][] = [
                    'id' => (string) $item['id'],
                    'name' => (string) ($item['name'] ?? ''),
                    'anime' => $theme,
                    'aliases' => array_values(array_map('strval', $item['aliases'] ?? [])),
                    'difficulty' => (string) ($item['difficulty'] ?? 'easy'),
                    'spoiler' => (bool) ($item['spoiler'] ?? false),
                    'image' => (string) ($item['image'] ?? ''),
                ];
            }
        }

        return $grouped;
    }

    /**
     * Return theme summaries for the Setup Room screen.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getThemesSummary(): array
    {
        $byTheme = $this->allByTheme();
        $meta = [
            'AOT' => [
                'label' => 'Attack on Titan',
                'tagline' => 'Survey Corps, Titan Shifter & Marley',
                'accent' => '#C9B58A',
            ],
            'Naruto' => [
                'label' => 'Naruto Shippuden',
                'tagline' => 'Konoha, Akatsuki & Lima Desa Besar',
                'accent' => '#F57C00',
            ],
        ];

        $result = [];
        foreach ($byTheme as $theme => $characters) {
            $counts = ['easy' => 0, 'medium' => 0, 'hard' => 0];
            $nonSpoilerCounts = ['easy' => 0, 'medium' => 0, 'hard' => 0];

            foreach ($characters as $char) {
                $diff = $char['difficulty'];
                if (isset($counts[$diff])) {
                    $counts[$diff]++;
                    if (! $char['spoiler']) {
                        $nonSpoilerCounts[$diff]++;
                    }
                }
            }

            $result[] = [
                'id' => $theme,
                'name' => $meta[$theme]['label'] ?? $theme,
                'tagline' => $meta[$theme]['tagline'] ?? 'Koleksi karakter anime',
                'accent' => $meta[$theme]['accent'] ?? '#7C6CF0',
                'total' => count($characters),
                'nonSpoilerTotal' => count(array_filter($characters, fn ($c) => ! $c['spoiler'])),
                'counts' => $counts,
                'nonSpoilerCounts' => $nonSpoilerCounts,
            ];
        }

        return $result;
    }

    /**
     * Get filtered character pool for a room configuration.
     *
     * @param  array<int, string>  $themes
     * @param  array<int, string>  $difficulties
     * @return array<int, array<string, mixed>>
     */
    public function getPool(array $themes, array $difficulties, bool $hideSpoilers = true): array
    {
        $byTheme = $this->allByTheme();
        $pool = [];

        foreach ($themes as $theme) {
            if (! isset($byTheme[$theme])) {
                continue;
            }

            foreach ($byTheme[$theme] as $char) {
                if ($hideSpoilers && $char['spoiler']) {
                    continue;
                }
                if (! in_array($char['difficulty'], $difficulties, true)) {
                    continue;
                }
                $pool[] = $char;
            }
        }

        return $pool;
    }

    /**
     * Find a single character by ID across all themes.
     *
     * @return array<string, mixed>|null
     */
    public function findById(string $id): ?array
    {
        foreach ($this->allByTheme() as $characters) {
            foreach ($characters as $char) {
                if ($char['id'] === $id) {
                    return $char;
                }
            }
        }

        return null;
    }

    /**
     * Normalize guess string for forgiving comparison.
     */
    public static function normalizeText(string $text): string
    {
        $clean = mb_strtolower(trim($text));
        $clean = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $clean) ?? $clean;
        $clean = preg_replace('/\s+/', ' ', $clean) ?? $clean;

        return trim($clean);
    }

    /**
     * Check if a guess matches any alias of the given character.
     */
    public function isMatch(array $character, string $guess): bool
    {
        $normalizedGuess = self::normalizeText($guess);
        if ($normalizedGuess === '') {
            return false;
        }

        $candidates = array_merge([$character['name']], $character['aliases'] ?? []);
        foreach ($candidates as $alias) {
            if (self::normalizeText((string) $alias) === $normalizedGuess) {
                return true;
            }
        }

        return false;
    }
}
