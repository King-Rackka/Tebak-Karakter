import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    api,
    getPlayerId,
    getSavedNickname,
    getSavedRoomCode,
    saveNickname,
    saveRoomCode,
} from './lib/api';
import { ThemePattern } from './components/ThemePattern';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HomePage } from './pages/HomePage';
import { SetupRoomPage } from './pages/SetupRoomPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { RoundResultPage } from './pages/RoundResultPage';
import { ScoreboardPage } from './pages/ScoreboardPage';

export default function MainApp() {
    const playerId = useMemo(() => getPlayerId(), []);
    const [nickname, setNickname] = useState(() => getSavedNickname());
    const [screen, setScreen] = useState('home'); // home | setup | room
    const [themes, setThemes] = useState([]);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reconnecting, setReconnecting] = useState(false);
    const [howToPlayOpen, setHowToPlayOpen] = useState(false);

    // Read ?room=CODE from URL if shared via link
    const urlRoomCode = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return (params.get('room') || '').trim().toUpperCase();
    }, []);

    // Load themes summary once
    useEffect(() => {
        api.getThemes()
            .then((res) => setThemes(res.themes || []))
            .catch(() => {});
    }, []);

    // Auto-reconnect to active room if tab was refreshed/reopened (PRD 8.1)
    useEffect(() => {
        const savedCode = getSavedRoomCode();
        if (!savedCode) return;

        api.getState(savedCode, playerId)
            .then((res) => {
                setRoom(res.room);
                setScreen('room');
            })
            .catch(() => {
                saveRoomCode('');
            });
    }, [playerId]);

    // Apply visual theme based on current screen & room settings (PRD 9.3)
    const activeTheme = useMemo(() => {
        if (!room || screen !== 'room') return 'Netral';
        const selected = room.settings?.themes || [];
        if (selected.length > 1) return 'Campur';
        if (selected[0] === 'AOT') return 'AOT';
        if (selected[0] === 'Naruto') return 'Naruto';
        return 'Campur';
    }, [room, screen]);

    useEffect(() => {
        if (activeTheme === 'Netral') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', activeTheme);
        }
    }, [activeTheme]);

    // Real-time room sync (< 1 second latency, PRD 8.2)
    useEffect(() => {
        if (screen !== 'room' || !room?.code) return;

        let active = true;
        const poll = async () => {
            try {
                const res = await api.getState(room.code, playerId);
                if (!active) return;
                setReconnecting(false);
                setRoom((prev) => {
                    if (
                        !prev ||
                        prev.version !== res.room.version ||
                        prev.status !== res.room.status ||
                        prev.currentRound !== res.room.currentRound
                    ) {
                        return res.room;
                    }
                    return prev;
                });
            } catch {
                if (!active) return;
                setReconnecting(true);
            }
        };

        const timer = setInterval(poll, 800);
        const onVisible = () => {
            if (document.visibilityState === 'visible') {
                poll();
            }
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            active = false;
            clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [screen, room?.code, playerId]);

    const handleNicknameChange = useCallback((val) => {
        setNickname(val);
        saveNickname(val);
    }, []);

    const handleCreateRoom = async (settings) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.createRoom({
                playerId,
                nickname: nickname.trim(),
                settings,
            });
            setRoom(res.room);
            saveRoomCode(res.room.code);
            setScreen('room');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (code) => {
        setLoading(true);
        setError('');
        try {
            const res = await api.joinRoom(code, {
                playerId,
                nickname: nickname.trim(),
            });
            setRoom(res.room);
            saveRoomCode(res.room.code);
            setScreen('room');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSettings = async (settings) => {
        if (!room) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.updateSettings(room.code, { playerId, settings });
            setRoom(res.room);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = async () => {
        if (!room) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.startGame(room.code, playerId);
            setRoom(res.room);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuess = async (guess) => {
        if (!room) return;
        setLoading(true);
        try {
            const res = await api.submitGuess(room.code, playerId, guess);
            setRoom(res.room);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        if (!room) return;
        setLoading(true);
        try {
            const res = await api.skipRound(room.code, playerId);
            setRoom(res.room);
        } finally {
            setLoading(false);
        }
    };

    const handleNextRound = async () => {
        if (!room) return;
        setLoading(true);
        try {
            const res = await api.nextRound(room.code, playerId);
            setRoom(res.room);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAgain = async () => {
        if (!room) return;
        setLoading(true);
        try {
            const res = await api.playAgain(room.code, playerId);
            setRoom(res.room);
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (room?.code) {
            await api.leaveRoom(room.code, playerId).catch(() => {});
        }
        saveRoomCode('');
        setRoom(null);
        setError('');
        setScreen('home');
    };

    return (
        <div className="min-h-screen relative">
            <ThemePattern theme={activeTheme} />

            {reconnecting && screen === 'room' && (
                <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-black text-xs font-bold shadow-lg">
                    Koneksi terputus, menghubungkan ulang...
                </div>
            )}

            {screen === 'home' && (
                <HomePage
                    nickname={nickname}
                    onNicknameChange={handleNicknameChange}
                    initialCode={urlRoomCode}
                    onGoSetup={() => {
                        setError('');
                        setScreen('setup');
                    }}
                    onJoinRoom={handleJoinRoom}
                    onOpenHowToPlay={() => setHowToPlayOpen(true)}
                    loading={loading}
                    error={error}
                />
            )}

            {screen === 'setup' && (
                <SetupRoomPage
                    themes={themes}
                    nickname={nickname}
                    onBack={() => {
                        setError('');
                        setScreen('home');
                    }}
                    onCreateRoom={handleCreateRoom}
                    loading={loading}
                    error={error}
                />
            )}

            {screen === 'room' && room && (
                <>
                    {room.status === 'lobby' && (
                        <LobbyPage
                            room={room}
                            themes={themes}
                            onStartGame={handleStartGame}
                            onUpdateSettings={handleUpdateSettings}
                            onLeave={handleLeave}
                            loading={loading}
                            error={error}
                        />
                    )}
                    {room.status === 'playing' && (
                        <GamePage
                            room={room}
                            onGuess={handleGuess}
                            onSkip={handleSkip}
                            onLeave={handleLeave}
                            loading={loading}
                        />
                    )}
                    {room.status === 'round_result' && (
                        <RoundResultPage
                            room={room}
                            onNextRound={handleNextRound}
                            loading={loading}
                        />
                    )}
                    {room.status === 'finished' && (
                        <ScoreboardPage
                            room={room}
                            onPlayAgain={handlePlayAgain}
                            onLeave={handleLeave}
                            loading={loading}
                        />
                    )}
                </>
            )}

            <HowToPlayModal open={howToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
        </div>
    );
}
