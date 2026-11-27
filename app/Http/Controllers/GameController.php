<?php

namespace App\Http\Controllers;

use App\Services\CharacterService;
use App\Services\RoomService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class GameController extends Controller
{
    public function __construct(
        private readonly CharacterService $characters,
        private readonly RoomService $rooms,
    ) {}

    public function themes(): JsonResponse
    {
        return response()->json([
            'themes' => $this->characters->getThemesSummary(),
        ]);
    }

    public function createRoom(Request $request): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
            'nickname' => ['required', 'string', 'min:1', 'max:20'],
            'settings' => ['required', 'array'],
            'settings.maxPlayers' => ['integer', 'min:2', 'max:8'],
            'settings.rounds' => ['integer', 'min:1', 'max:10'],
            'settings.difficulties' => ['array', 'min:1'],
            'settings.themes' => ['array', 'min:1'],
            'settings.hideSpoilers' => ['boolean'],
        ]);

        try {
            $room = $this->rooms->createRoom($data['playerId'], $data['nickname'], $data['settings']);

            return response()->json(['room' => $room], 201);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function joinRoom(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
            'nickname' => ['required', 'string', 'min:1', 'max:20'],
        ]);

        try {
            $room = $this->rooms->joinRoom($code, $data['playerId'], $data['nickname']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function getState(Request $request, string $code): JsonResponse
    {
        $playerId = (string) $request->query('playerId', '');
        if ($playerId === '') {
            return response()->json(['message' => 'playerId diperlukan.'], 422);
        }

        try {
            $room = $this->rooms->getState($code, $playerId);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
    }

    public function updateSettings(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
            'settings' => ['required', 'array'],
        ]);

        try {
            $room = $this->rooms->updateSettings($code, $data['playerId'], $data['settings']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function startGame(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        try {
            $room = $this->rooms->startGame($code, $data['playerId']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function submitGuess(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
            'guess' => ['required', 'string', 'max:80'],
        ]);

        try {
            $room = $this->rooms->submitGuess($code, $data['playerId'], $data['guess']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function skipRound(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        try {
            $room = $this->rooms->skipRound($code, $data['playerId']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function nextTurn(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        try {
            $room = $this->rooms->nextTurn($code, $data['playerId']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function nextRound(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        try {
            $room = $this->rooms->nextRound($code, $data['playerId']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function playAgain(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        try {
            $room = $this->rooms->playAgain($code, $data['playerId']);

            return response()->json(['room' => $room]);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function leaveRoom(Request $request, string $code): JsonResponse
    {
        $data = $request->validate([
            'playerId' => ['required', 'string', 'max:64'],
        ]);

        $this->rooms->leaveRoom($code, $data['playerId']);

        return response()->json(['ok' => true]);
    }
}