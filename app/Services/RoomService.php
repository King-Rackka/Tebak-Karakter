<?php

namespace App\Services;

use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use RuntimeException;

class RoomService
{
    private const CACHE_PREFIX = 'tebak_room:';
    private const ROOM_TTL_SECONDS = 14400; // 4 jam
    private const DISCONNECT_THRESHOLD_SECONDS = 45;
    private const HOST_ABANDON_SECONDS = 180; // Hanya alihkan host jika benar-benar AFK 3 menit atau klik Keluar

    public function __construct(private readonly CharacterService $characters) {}

    /**
     * Create a new game room and add the host player.
     *
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    public function createRoom(string $playerId, string $nickname, array $settings): array
    {
        $code = $this->generateUniqueCode();
        $normalizedSettings = $this->normalizeSettings($settings);

        $room = [
            'code' => $code,
            'status' => 'lobby',
            'hostId' => $playerId,
            'settings' => $normalizedSettings,
            'players' => [
                $playerId => $this->makePlayer($playerId, $nickname),
            ],
            'currentRound' => 0,
            'roundStartedAt' => null,
            'roundEndsAt' => null,
            'turnOrder' => [],
            'currentTurnPlayerId' => null,
            'usedCharacterIds' => [],
            'logs' => [],
            'roundResults' => [],
            'version' => 1,
            'createdAt' => now()->timestamp,
        ];

        $this->saveRoom($room);

        return $this->sanitizeForPlayer($room, $playerId);
    }

    /**
     * Join an existing room or reconnect if already a member.
     *
     * @return array<string, mixed>
     */
    public function joinRoom(string $code, string $playerId, string $nickname): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId, $nickname) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan. Periksa kembali kode room.');
            }

            if (isset($room['players'][$playerId])) {
                $room['players'][$playerId]['name'] = $nickname ?: $room['players'][$playerId]['name'];
                $room['players'][$playerId]['connected'] = true;
                $room['players'][$playerId]['lastSeenAt'] = now()->timestamp;
                $room['version']++;
                $this->saveRoom($room);

                return $this->sanitizeForPlayer($room, $playerId);
            }

            if ($room['status'] !== 'lobby') {
                throw new RuntimeException('Game sudah dimulai. Tunggu ronde selesai atau buat room baru.');
            }

            if (count($room['players']) >= $room['settings']['maxPlayers']) {
                throw new RuntimeException('Room sudah penuh.');
            }

            $room['players'][$playerId] = $this->makePlayer($playerId, $nickname);
            $room['version']++;
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Fetch current room state, updating player heartbeat and server-side timer.
     *
     * @return array<string, mixed>
     */
    public function getState(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan atau sudah kedaluwarsa.');
            }

            if (! isset($room['players'][$playerId])) {
                throw new RuntimeException('Kamu bukan bagian dari room ini.');
            }

            $changed = $this->refreshPresenceAndTimer($room, $playerId);
            if ($changed) {
                $this->saveRoom($room);
            }

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Update room settings from Lobby (host only).
     *
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    public function updateSettings(string $code, string $playerId, array $settings): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId, $settings) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }
            if ($room['hostId'] !== $playerId) {
                throw new RuntimeException('Hanya host yang bisa mengubah pengaturan.');
            }
            if ($room['status'] !== 'lobby') {
                throw new RuntimeException('Pengaturan hanya bisa diubah di lobby.');
            }

            $normalized = $this->normalizeSettings($settings);
            if ($normalized['maxPlayers'] < count($room['players'])) {
                throw new RuntimeException('Maksimal pemain tidak boleh lebih kecil dari jumlah pemain saat ini.');
            }

            $room['settings'] = $normalized;
            $room['version']++;
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Start the game from Lobby (host only).
     *
     * @return array<string, mixed>
     */
    public function startGame(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }
            if ($room['hostId'] !== $playerId) {
                throw new RuntimeException('Hanya host yang bisa memulai game.');
            }
            if (count($room['players']) < 2) {
                throw new RuntimeException('Minimal 2 pemain diperlukan untuk memulai game.');
            }

            foreach ($room['players'] as &$player) {
                $player['score'] = 0;
            }
            unset($player);

            $room['currentRound'] = 0;
            $room['usedCharacterIds'] = [];
            $room['roundResults'] = [];

            $this->startNextRoundInternal($room);
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Submit a character guess during an active round (current turn player only).
     *
     * @return array<string, mixed>
     */
    public function submitGuess(string $code, string $playerId, string $guess): array
    {
        $code = strtoupper(trim($code));
        $guess = trim(mb_substr($guess, 0, 80));

        if ($guess === '') {
            throw new RuntimeException('Tebakan tidak boleh kosong.');
        }

        return $this->withLock($code, function () use ($code, $playerId, $guess) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }

            $this->refreshPresenceAndTimer($room, $playerId);

            if ($room['status'] !== 'playing') {
                throw new RuntimeException('Ronde sedang tidak berlangsung.');
            }

            $this->ensureTurnConsistency($room);
            if (($room['currentTurnPlayerId'] ?? null) !== $playerId) {
                throw new RuntimeException('Bukan giliranmu saat ini.');
            }

            $player = $room['players'][$playerId] ?? null;
            if (! $player || ! $player['roundState']) {
                throw new RuntimeException('Pemain tidak ditemukan.');
            }

            if ($player['roundState']['status'] !== 'guessing') {
                throw new RuntimeException('Kesempatan menebakmu di ronde ini sudah selesai.');
            }

            $character = $this->characters->findById($player['roundState']['characterId']);
            if (! $character) {
                throw new RuntimeException('Data karakter tidak ditemukan.');
            }

            $isCorrect = $this->characters->isMatch($character, $guess);
            $attemptsLeft = $player['roundState']['attemptsLeft'];

            if ($isCorrect) {
                $points = match ($attemptsLeft) {
                    3 => 100,
                    2 => 60,
                    default => 30,
                };

                $room['players'][$playerId]['score'] += $points;
                $room['players'][$playerId]['roundState']['status'] = 'correct';
                $room['players'][$playerId]['roundState']['roundScore'] = $points;
                $room['players'][$playerId]['roundState']['guessedAt'] = now()->timestamp;

                $room['logs'][] = [
                    'id' => Str::uuid()->toString(),
                    'playerId' => $playerId,
                    'playerName' => $player['name'],
                    'text' => "{$player['name']} berhasil menebak karakternya! (+{$points} poin)",
                    'type' => 'correct',
                    'timestamp' => now()->timestamp,
                ];
            } else {
                $attemptsLeft--;
                $room['players'][$playerId]['roundState']['attemptsLeft'] = $attemptsLeft;

                if ($attemptsLeft <= 0) {
                    $room['players'][$playerId]['roundState']['status'] = 'failed';
                }

                $room['logs'][] = [
                    'id' => Str::uuid()->toString(),
                    'playerId' => $playerId,
                    'playerName' => $player['name'],
                    'text' => "{$player['name']} menebak \"{$guess}\": salah (sisa {$attemptsLeft})",
                    'type' => 'wrong',
                    'timestamp' => now()->timestamp,
                ];
            }

            if ($this->shouldFinishRound($room)) {
                $this->finishRoundInternal($room);
            } else {
                $this->advanceTurnInternal($room);
            }

            $room['version']++;
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Advance turn to the next active player without guessing (current turn player only).
     *
     * @return array<string, mixed>
     */
    public function nextTurn(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }

            $this->refreshPresenceAndTimer($room, $playerId);

            if ($room['status'] !== 'playing') {
                throw new RuntimeException('Ronde sedang tidak berlangsung.');
            }

            $this->ensureTurnConsistency($room);
            if (($room['currentTurnPlayerId'] ?? null) !== $playerId) {
                throw new RuntimeException('Bukan giliranmu saat ini.');
            }

            $name = $room['players'][$playerId]['name'] ?? 'Pemain';
            $this->advanceTurnInternal($room);

            $room['logs'][] = [
                'id' => Str::uuid()->toString(),
                'playerId' => $playerId,
                'playerName' => $name,
                'text' => "{$name} meneruskan giliran ke pemain berikutnya.",
                'type' => 'info',
                'timestamp' => now()->timestamp,
            ];

            $room['version']++;
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Allow a player to skip/give up for the current round.
     *
     * @return array<string, mixed>
     */
    public function skipRound(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }

            $this->refreshPresenceAndTimer($room, $playerId);

            if ($room['status'] !== 'playing') {
                throw new RuntimeException('Ronde sedang tidak berlangsung.');
            }

            $this->ensureTurnConsistency($room);

            if (($room['players'][$playerId]['roundState']['status'] ?? '') === 'guessing') {
                $wasCurrentTurn = ($room['currentTurnPlayerId'] ?? null) === $playerId;

                $room['players'][$playerId]['roundState']['status'] = 'failed';
                $room['players'][$playerId]['roundState']['attemptsLeft'] = 0;

                $name = $room['players'][$playerId]['name'];
                $room['logs'][] = [
                    'id' => Str::uuid()->toString(),
                    'playerId' => $playerId,
                    'playerName' => $name,
                    'text' => "{$name} menyerah di ronde ini.",
                    'type' => 'info',
                    'timestamp' => now()->timestamp,
                ];

                if ($this->shouldFinishRound($room)) {
                    $this->finishRoundInternal($room);
                } elseif ($wasCurrentTurn) {
                    $this->advanceTurnInternal($room);
                }

                $room['version']++;
                $this->saveRoom($room);
            }

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Advance to next round or final scoreboard (host only).
     *
     * @return array<string, mixed>
     */
    public function nextRound(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }
            if ($room['hostId'] !== $playerId) {
                throw new RuntimeException('Hanya host yang bisa melanjutkan ronde.');
            }
            if ($room['status'] !== 'round_result') {
                throw new RuntimeException('Belum waktunya lanjut ke ronde berikutnya.');
            }

            if ($room['currentRound'] >= $room['settings']['rounds']) {
                $room['status'] = 'finished';
                $room['turnOrder'] = [];
                $room['currentTurnPlayerId'] = null;
                $room['version']++;
            } else {
                $this->startNextRoundInternal($room);
            }

            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Return everyone back to Lobby for a rematch (host only).
     *
     * @return array<string, mixed>
     */
    public function playAgain(string $code, string $playerId): array
    {
        $code = strtoupper(trim($code));

        return $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room) {
                throw new RuntimeException('Room tidak ditemukan.');
            }
            if ($room['hostId'] !== $playerId) {
                throw new RuntimeException('Hanya host yang bisa memulai ulang ke lobby.');
            }

            $room['status'] = 'lobby';
            $room['currentRound'] = 0;
            $room['roundStartedAt'] = null;
            $room['roundEndsAt'] = null;
            $room['turnOrder'] = [];
            $room['currentTurnPlayerId'] = null;
            $room['usedCharacterIds'] = [];
            $room['logs'] = [];
            $room['roundResults'] = [];

            foreach ($room['players'] as &$player) {
                $player['score'] = 0;
                $player['roundState'] = null;
            }
            unset($player);

            $room['version']++;
            $this->saveRoom($room);

            return $this->sanitizeForPlayer($room, $playerId);
        });
    }

    /**
     * Leave the room cleanly and migrate host/turn if needed.
     */
    public function leaveRoom(string $code, string $playerId): void
    {
        $code = strtoupper(trim($code));

        $this->withLock($code, function () use ($code, $playerId) {
            $room = $this->loadRoom($code);
            if (! $room || ! isset($room['players'][$playerId])) {
                return;
            }

            $name = $room['players'][$playerId]['name'];
            $wasCurrentTurn = ($room['currentTurnPlayerId'] ?? null) === $playerId;

            if ($wasCurrentTurn && $room['status'] === 'playing') {
                $this->advanceTurnInternal($room);
            }

            unset($room['players'][$playerId]);
            $room['turnOrder'] = array_values(array_filter(
                $room['turnOrder'] ?? [],
                fn ($id) => $id !== $playerId
            ));

            if (count($room['players']) === 0) {
                $this->cacheStore()->forget(self::CACHE_PREFIX.$code);

                return;
            }

            if ($room['hostId'] === $playerId) {
                $room['hostId'] = $this->pickNextHost($room['players']);
            }

            if ($room['status'] === 'playing') {
                $room['logs'][] = [
                    'id' => Str::uuid()->toString(),
                    'playerId' => $playerId,
                    'playerName' => $name,
                    'text' => "{$name} keluar dari room.",
                    'type' => 'info',
                    'timestamp' => now()->timestamp,
                ];

                if ($this->shouldFinishRound($room)) {
                    $this->finishRoundInternal($room);
                } else {
                    $this->ensureTurnConsistency($room);
                }
            }

            $room['version']++;
            $this->saveRoom($room);
        });
    }

    private function startNextRoundInternal(array &$room): void
    {
        $settings = $room['settings'];
        $pool = $this->characters->getPool(
            $settings['themes'],
            $settings['difficulties'],
            $settings['hideSpoilers']
        );

        // Fallback ke tingkat medium jika pool easy tidak mencukupi (PRD Bagian 7)
        $available = array_values(array_filter(
            $pool,
            fn ($c) => ! in_array($c['id'], $room['usedCharacterIds'], true)
        ));

        $playerCount = count($room['players']);
        if (count($available) < $playerCount && ! in_array('medium', $settings['difficulties'], true)) {
            $fallbackPool = $this->characters->getPool(
                $settings['themes'],
                array_merge($settings['difficulties'], ['medium']),
                $settings['hideSpoilers']
            );
            $available = array_values(array_filter(
                $fallbackPool,
                fn ($c) => ! in_array($c['id'], $room['usedCharacterIds'], true)
            ));
        }

        if (count($available) < $playerCount) {
            throw new RuntimeException('Karakter yang tersedia tidak cukup untuk jumlah pemain & ronde ini.');
        }

        shuffle($available);

        // Acak urutan giliran pemain setiap ronde baru dimulai
        $turnOrder = array_keys($room['players']);
        shuffle($turnOrder);

        $room['currentRound']++;
        $room['status'] = 'playing';
        $room['roundStartedAt'] = now()->timestamp;
        $room['roundEndsAt'] = null;
        $room['turnOrder'] = $turnOrder;
        $room['currentTurnPlayerId'] = $turnOrder[0] ?? null;
        $room['logs'] = [];

        $idx = 0;
        foreach ($room['players'] as $pid => &$player) {
            $char = $available[$idx++];
            $room['usedCharacterIds'][] = $char['id'];

            $player['roundState'] = [
                'characterId' => $char['id'],
                'characterName' => $char['name'],
                'characterAnime' => $char['anime'],
                'attemptsLeft' => 3,
                'status' => 'guessing',
                'roundScore' => 0,
                'guessedAt' => null,
            ];
        }
        unset($player);

        $room['version']++;
    }

    /**
     * Memajukan giliran ke pemain aktif berikutnya sesuai urutan acak ronde ini.
     */
    private function advanceTurnInternal(array &$room): void
    {
        $activeIds = [];
        foreach ($room['players'] as $pid => $player) {
            if (($player['roundState']['status'] ?? '') === 'guessing') {
                $activeIds[] = $pid;
            }
        }

        if (empty($activeIds)) {
            $room['currentTurnPlayerId'] = null;

            return;
        }

        $orderedActive = array_values(array_filter(
            $room['turnOrder'] ?? $activeIds,
            fn ($id) => in_array($id, $activeIds, true)
        ));

        if (empty($orderedActive)) {
            $orderedActive = $activeIds;
        }

        $currentId = $room['currentTurnPlayerId'] ?? null;
        $currentPos = array_search($currentId, $orderedActive, true);

        if ($currentPos === false) {
            // Jika pemain giliran saat ini baru saja selesai/keluar, cari posisi berikutnya berdasarkan turnOrder penuh
            $fullOrder = $room['turnOrder'] ?? [];
            $fullPos = array_search($currentId, $fullOrder, true);
            if ($fullPos !== false && count($fullOrder) > 0) {
                $total = count($fullOrder);
                for ($step = 1; $step <= $total; $step++) {
                    $candidateId = $fullOrder[($fullPos + $step) % $total];
                    if (in_array($candidateId, $orderedActive, true)) {
                        $room['currentTurnPlayerId'] = $candidateId;

                        return;
                    }
                }
            }

            $room['currentTurnPlayerId'] = $orderedActive[0];

            return;
        }

        $nextPos = ($currentPos + 1) % count($orderedActive);
        $room['currentTurnPlayerId'] = $orderedActive[$nextPos];
    }

    /**
     * Memastikan currentTurnPlayerId valid dan mengarah ke pemain yang masih aktif menebak.
     */
    private function ensureTurnConsistency(array &$room): bool
    {
        if (($room['status'] ?? '') !== 'playing') {
            return false;
        }

        if (empty($room['turnOrder'])) {
            $turnOrder = array_keys($room['players']);
            shuffle($turnOrder);
            $room['turnOrder'] = $turnOrder;
            $room['currentTurnPlayerId'] = $turnOrder[0] ?? null;

            return true;
        }

        $currentId = $room['currentTurnPlayerId'] ?? null;
        $isCurrentActive = $currentId !== null
            && isset($room['players'][$currentId])
            && (($room['players'][$currentId]['roundState']['status'] ?? '') === 'guessing');

        if (! $isCurrentActive) {
            $prev = $room['currentTurnPlayerId'] ?? null;
            $this->advanceTurnInternal($room);

            return ($room['currentTurnPlayerId'] ?? null) !== $prev;
        }

        return false;
    }

    private function shouldFinishRound(array $room): bool
    {
        foreach ($room['players'] as $player) {
            if (($player['roundState']['status'] ?? '') === 'guessing') {
                return false;
            }
        }

        return true;
    }

    private function finishRoundInternal(array &$room): void
    {
        $room['status'] = 'round_result';
        $room['currentTurnPlayerId'] = null;
        $results = [];

        foreach ($room['players'] as $pid => &$player) {
            $rs = $player['roundState'];
            if (! $rs) {
                continue;
            }

            if ($rs['status'] === 'guessing') {
                $player['roundState']['status'] = 'timeout';
                $rs['status'] = 'timeout';
            }

            $results[] = [
                'playerId' => $pid,
                'playerName' => $player['name'],
                'characterName' => $rs['characterName'],
                'characterAnime' => $rs['characterAnime'],
                'status' => $rs['status'],
                'attemptsUsed' => 3 - $rs['attemptsLeft'],
                'roundScore' => $rs['roundScore'],
                'totalScore' => $player['score'],
            ];
        }
        unset($player);

        usort($results, fn ($a, $b) => $b['roundScore'] <=> $a['roundScore']);
        $room['roundResults'] = $results;
        $room['version']++;
    }

    private function refreshPresenceAndTimer(array &$room, string $viewerId): bool
    {
        $now = now()->timestamp;
        $changed = false;

        if (isset($room['players'][$viewerId])) {
            $prevConnected = $room['players'][$viewerId]['connected'];
            $room['players'][$viewerId]['lastSeenAt'] = $now;
            $room['players'][$viewerId]['connected'] = true;
            if (! $prevConnected) {
                $changed = true;
            }
        }

        foreach ($room['players'] as $pid => &$player) {
            if ($player['connected'] && ($now - $player['lastSeenAt']) > self::DISCONNECT_THRESHOLD_SECONDS) {
                $player['connected'] = false;
                $changed = true;
            }
        }
        unset($player);

        if (isset($room['players'][$room['hostId']])) {
            $hostLastSeen = $room['players'][$room['hostId']]['lastSeenAt'] ?? $now;
            if (($now - $hostLastSeen) > self::HOST_ABANDON_SECONDS) {
                $nextHost = $this->pickNextHost($room['players']);
                if ($nextHost !== $room['hostId']) {
                    $room['hostId'] = $nextHost;
                    $changed = true;
                }
            }
        }

        if ($room['status'] === 'playing') {
            if ($this->shouldFinishRound($room)) {
                $this->finishRoundInternal($room);
                $changed = true;
            } elseif ($this->ensureTurnConsistency($room)) {
                $changed = true;
            }
        }

        if ($changed) {
            $room['version']++;
        }

        return $changed;
    }

    /**
     * CRITICAL SECURITY BOUNDARY (PRD 8.1):
     * Never expose a player's own character during an active round.
     *
     * @return array<string, mixed>
     */
    private function sanitizeForPlayer(array $room, string $viewerId): array
    {
        $isRevealed = in_array($room['status'], ['round_result', 'finished'], true);
        $playersOut = [];

        foreach ($room['players'] as $pid => $player) {
            $isSelf = $pid === $viewerId;
            $rs = $player['roundState'];

            $character = null;
            if ($rs) {
                if ($isSelf && ! $isRevealed) {
                    $character = null;
                } else {
                    $character = [
                        'name' => $rs['characterName'],
                        'anime' => $rs['characterAnime'],
                    ];
                }
            }

            $playersOut[] = [
                'id' => $player['id'],
                'name' => $player['name'],
                'score' => $player['score'],
                'isHost' => $pid === $room['hostId'],
                'isSelf' => $isSelf,
                'connected' => $player['connected'],
                'roundState' => $rs ? [
                    'character' => $character,
                    'attemptsLeft' => $rs['attemptsLeft'],
                    'status' => $rs['status'],
                    'roundScore' => $rs['roundScore'],
                ] : null,
            ];
        }

        return [
            'code' => $room['code'],
            'status' => $room['status'],
            'hostId' => $room['hostId'],
            'isHost' => $room['hostId'] === $viewerId,
            'settings' => $room['settings'],
            'currentRound' => $room['currentRound'],
            'roundStartedAt' => $room['roundStartedAt'],
            'roundEndsAt' => $room['roundEndsAt'],
            'turnOrder' => $room['turnOrder'] ?? [],
            'currentTurnPlayerId' => $room['currentTurnPlayerId'] ?? null,
            'serverTime' => now()->timestamp,
            'players' => $playersOut,
            'logs' => array_slice($room['logs'], -30),
            'roundResults' => $room['roundResults'],
            'version' => $room['version'],
        ];
    }

    private function normalizeSettings(array $settings): array
    {
        $maxPlayers = max(2, min(8, (int) ($settings['maxPlayers'] ?? 6)));
        $rounds = max(1, min(10, (int) ($settings['rounds'] ?? 5)));

        $validDifficulties = ['easy', 'medium', 'hard'];
        $difficulties = array_values(array_intersect(
            $validDifficulties,
            array_map('strval', $settings['difficulties'] ?? ['easy'])
        ));
        if (empty($difficulties)) {
            $difficulties = ['easy'];
        }

        $availableThemes = array_keys($this->characters->allByTheme());
        $themes = array_values(array_intersect(
            $availableThemes,
            array_map('strval', $settings['themes'] ?? ['AOT'])
        ));
        if (empty($themes)) {
            $themes = $availableThemes;
        }

        return [
            'maxPlayers' => $maxPlayers,
            'rounds' => $rounds,
            'difficulties' => $difficulties,
            'themes' => $themes,
            'hideSpoilers' => (bool) ($settings['hideSpoilers'] ?? true),
        ];
    }

    private function makePlayer(string $id, string $nickname): array
    {
        return [
            'id' => $id,
            'name' => trim(mb_substr($nickname, 0, 20)) ?: 'Pemain',
            'score' => 0,
            'connected' => true,
            'joinedAt' => now()->timestamp,
            'lastSeenAt' => now()->timestamp,
            'roundState' => null,
        ];
    }

    private function pickNextHost(array $players): string
    {
        foreach ($players as $pid => $player) {
            if ($player['connected']) {
                return $pid;
            }
        }

        return (string) array_key_first($players);
    }

    private function generateUniqueCode(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do {
            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while ($this->cacheStore()->has(self::CACHE_PREFIX.$code));

        return $code;
    }

    private function loadRoom(string $code): ?array
    {
        $data = $this->cacheStore()->get(self::CACHE_PREFIX.$code);

        return is_array($data) ? $data : null;
    }

    private function saveRoom(array $room): void
    {
        $this->cacheStore()->put(
            self::CACHE_PREFIX.$room['code'],
            $room,
            self::ROOM_TTL_SECONDS
        );
    }

    private function withLock(string $code, callable $callback): mixed
    {
        return $this->cacheStore()
            ->lock('lock:'.self::CACHE_PREFIX.$code, 5)
            ->block(5, $callback);
    }

    private function cacheStore(): Repository
    {
        return Cache::store((string) config('cache.default', 'file'));
    }
}