<?php

namespace Tests\Feature;

use App\Services\CharacterService;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class GameFlowTest extends TestCase
{
    public function test_themes_endpoint_returns_aot_and_naruto(): void
    {
        $response = $this->getJson('/api/themes');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'themes' => [
                    '*' => ['id', 'name', 'total', 'nonSpoilerTotal', 'counts', 'nonSpoilerCounts'],
                ],
            ]);

        $ids = collect($response->json('themes'))->pluck('id')->all();
        $this->assertContains('AOT', $ids);
        $this->assertContains('Naruto', $ids);
    }

    public function test_full_game_round_and_anti_cheat_null_character(): void
    {
        Cache::store('file')->flush();

        // 1. Create room
        $createRes = $this->postJson('/api/rooms', [
            'playerId' => 'p1',
            'nickname' => 'Ari',
            'settings' => [
                'maxPlayers' => 4,
                'rounds' => 2,
                'roundDuration' => 90,
                'difficulties' => ['easy'],
                'themes' => ['AOT', 'Naruto'],
                'hideSpoilers' => true,
                'speedBonus' => false,
            ],
        ])->assertStatus(201);

        $code = $createRes->json('room.code');
        $this->assertNotEmpty($code);

        // 2. Join player 2
        $this->postJson("/api/rooms/{$code}/join", [
            'playerId' => 'p2',
            'nickname' => 'Budi',
        ])->assertStatus(200);

        // 3. Start game
        $startRes = $this->postJson("/api/rooms/{$code}/start", [
            'playerId' => 'p1',
        ])->assertStatus(200);

        $p1View = $startRes->json('room');
        $this->assertSame('playing', $p1View['status']);

        $p1Self = collect($p1View['players'])->firstWhere('id', 'p1');
        $p1Other = collect($p1View['players'])->firstWhere('id', 'p2');

        // Anti-intip: karakter p1 sendiri bernilai null, milik p2 terlihat
        $this->assertNull($p1Self['roundState']['character']);
        $this->assertNotNull($p1Other['roundState']['character']['name']);

        // Ambil state dari sudut pandang p2 untuk melihat karakter asli p1
        $p2View = $this->getJson("/api/rooms/{$code}?playerId=p2")->assertStatus(200)->json('room');
        $p2SeesP1 = collect($p2View['players'])->firstWhere('id', 'p1');
        $p1ActualName = $p2SeesP1['roundState']['character']['name'];
        $p2ActualName = $p1Other['roundState']['character']['name'];

        $this->assertNotSame($p1ActualName, $p2ActualName);

        // 4. P1 salah tebak sekali, lalu benar di tebakan ke-2 (60 poin)
        $wrongRes = $this->postJson("/api/rooms/{$code}/guess", [
            'playerId' => 'p1',
            'guess' => 'Karakter Ngawur 123',
        ])->assertStatus(200);

        $p1AfterWrong = collect($wrongRes->json('room.players'))->firstWhere('id', 'p1');
        $this->assertSame(2, $p1AfterWrong['roundState']['attemptsLeft']);

        $correctRes = $this->postJson("/api/rooms/{$code}/guess", [
            'playerId' => 'p1',
            'guess' => '  '.strtolower($p1ActualName).'  ',
        ])->assertStatus(200);

        $p1AfterCorrect = collect($correctRes->json('room.players'))->firstWhere('id', 'p1');
        $this->assertSame('correct', $p1AfterCorrect['roundState']['status']);
        $this->assertSame(60, $p1AfterCorrect['score']);

        // 5. P2 benar di tebakan ke-1 (100 poin) -> ronde otomatis selesai & terbuka
        $endRes = $this->postJson("/api/rooms/{$code}/guess", [
            'playerId' => 'p2',
            'guess' => $p2ActualName,
        ])->assertStatus(200);

        $this->assertSame('round_result', $endRes->json('room.status'));
        $this->assertCount(2, $endRes->json('room.roundResults'));
    }

    public function test_character_service_normalization_works(): void
    {
        $this->assertSame('eren yeager', CharacterService::normalizeText('  Eren-Yeager!!  '));
    }
}
