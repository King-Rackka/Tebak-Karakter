<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;

Route::get('/themes', [GameController::class, 'themes']);
Route::post('/rooms', [GameController::class, 'createRoom']);
Route::post('/rooms/{code}/join', [GameController::class, 'joinRoom']);
Route::get('/rooms/{code}', [GameController::class, 'getState']);
Route::patch('/rooms/{code}/settings', [GameController::class, 'updateSettings']);
Route::post('/rooms/{code}/start', [GameController::class, 'startGame']);
Route::post('/rooms/{code}/guess', [GameController::class, 'submitGuess']);
Route::post('/rooms/{code}/skip', [GameController::class, 'skipRound']);
Route::post('/rooms/{code}/next-turn', [GameController::class, 'nextTurn']);
Route::post('/rooms/{code}/next-round', [GameController::class, 'nextRound']);
Route::post('/rooms/{code}/play-again', [GameController::class, 'playAgain']);
Route::post('/rooms/{code}/leave', [GameController::class, 'leaveRoom']);