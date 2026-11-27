import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    api,
    getPlayerId,
    getSavedNickname,
    getSavedRoomCode,
    saveNickname,
    saveRoomCode,
} from './lib/api';
import { GameLoadingScreen } from './components/GameLoadingScreen';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThemePattern } from './components/ThemePattern';
import { HowToPlayModal } from './components/HowToPlayModal';
import { HomePage } from './pages/HomePage';
import { SetupRoomPage } from './pages/SetupRoomPage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { RoundResultPage } from './pages/RoundResultPage';
import { ScoreboardPage } from './pages/ScoreboardPage';

export default function MainApp() {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const isNotFound = currentPath !== '/';

    const playerId = useMemo(() => getPlayerId(), []);
    const [nickname, setNickname] = useState(() => getSavedNickname());
    const [screen, setScreen] = useState('home'); // home | setup | room
    const [themes, setThemes] = useState([]);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reconnecting, setReconnecting] = useState(false);
    const [howToPlayOpen, setHowToPlayOpen] = useState(false);

    // Overlay loading khusus transisi halaman & inisialisasi awal
    const [transitionLoading, setTransitionLoading] = useState({
        active: !isNotFound,
        title: 'Menyiapkan Arena...',
        subtitle: 'Memuat tema permainan dan memeriksa sesi aktif.',
    });

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const withTransition = useCallback(async (title, subtitle, task, minDelayMs = 380) => {
        if (mountedRef.current) {
            setTransitionLoading({ active: true, title, subtitle });
        }
        try {
            const [result] = await Promise.all([
                typeof task === 'function' ? task() : Promise.resolve(),
                new Promise((resolve) => setTimeout(resolve, minDelayMs)),
            ]);
            return result;
        } finally {
            if (mountedRef.current) {
                setTransitionLoading((prev) => ({ ...prev, active: false }));
            }
        }
    }, []);

    // Read ?room=CODE from URL if shared via link
    const urlRoomCode = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return (params.get('room') || '').trim().toUpperCase();
    }, []);

    // Load themes summary & auto-reconnect saat pertama kali dibuka / di-refresh
    useEffect(() => {
        if (isNotFound) return;

        withTransition(
            'Menyiapkan Arena...',
            'Memuat tema permainan dan memeriksa sesi room aktif.',
            async () => {
                const themesPromise = api
                    .getThemes()
                    .then((res) => {
                        if (mountedRef.current) setThemes(res.themes || []);
                    })
                    .catch(() => {});

                const savedCode = getSavedRoomCode();
                const reconnectPromise = savedCode
                    ? api
                          .getState(savedCode, playerId)
                          .then((res) => {
                              if (mountedRef.current && res?.room) {
                                  setRoom(res.room);
                                  setScreen('room');
                              }
                          })
                          .catch(() => {
                              saveRoomCode('');
                          })
                    : Promise.resolve();

                await Promise.all([themesPromise, reconnectPromise]);
            },
            420
        );
    }, [isNotFound, playerId, withTransition]);

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
        if (isNotFound || screen !== 'room' || !room?.code) return;

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
    }, [isNotFound, screen, room?.code, playerId]);

    const handleNicknameChange = useCallback((val) => {
        setNickname(val);
        saveNickname(val);
    }, []);

    const handleGoSetup = useCallback(() => {
        setError('');
        withTransition(
            'Menyiapkan Pengaturan Room...',
            'Memuat daftar tema karakter dan konfigurasi permainan.',
            () => {
                setScreen('setup');
            },
            320
        );
    }, [withTransition]);

    const handleBackHome = useCallback(() => {
        setError('');
        withTransition(
            'Kembali ke Beranda...',
            'Memuat halaman utama permainan.',
            () => {
                setScreen('home');
            },
            250
        );
    }, [withTransition]);

    const handleCreateRoom = async (settings) => {
        setLoading(true);
        setError('');
        try {
            await withTransition(
                'Membuat Room...',
                'Mendaftarkan room baru dan menyiapkan kode undangan.',
                async () => {
                    const res = await api.createRoom({
                        playerId,
                        nickname: nickname.trim(),
                        settings,
                    });
                    setRoom(res.room);
                    saveRoomCode(res.room.code);
                    setScreen('room');
                }
            );
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
            await withTransition(
                `Masuk ke Room ${String(code || '').toUpperCase()}...`,
                'Menyinkronkan daftar pemain di lobby.',
                async () => {
                    const res = await api.joinRoom(code, {
                        playerId,
                        nickname: nickname.trim(),
                    });
                    setRoom(res.room);
                    saveRoomCode(res.room.code);
                    setScreen('room');
                }
            );
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
            await withTransition(
                'Mengacak Karakter...',
                'Membagikan karakter rahasia dan menentukan urutan giliran.',
                async () => {
                    const res = await api.startGame(room.code, playerId);
                    setRoom(res.room);
                }
            );
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
            const isLastRound = room.currentRound >= (room.settings?.rounds || 1);
            await withTransition(
                isLastRound ? 'Menghitung Skor Akhir...' : `Menyiapkan Ronde ${room.currentRound + 1}...`,
                isLastRound
                    ? 'Menyusun klasemen akhir seluruh pemain.'
                    : 'Mengacak karakter baru untuk ronde berikutnya.',
                async () => {
                    const res = await api.nextRound(room.code, playerId);
                    setRoom(res.room);
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAgain = async () => {
        if (!room) return;
        setLoading(true);
        try {
            await withTransition(
                'Kembali ke Lobby...',
                'Mereset skor untuk pertandingan ulang.',
                async () => {
                    const res = await api.playAgain(room.code, playerId);
                    setRoom(res.room);
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        await withTransition(
            'Keluar dari Room...',
            'Membersihkan sesi dan kembali ke beranda.',
            async () => {
                if (room?.code) {
                    await api.leaveRoom(room.code, playerId).catch(() => {});
                }
                saveRoomCode('');
                setRoom(null);
                setError('');
                setScreen('home');
            },
            300
        );
    };

    if (isNotFound) {
        return (
            <NotFoundPage
                onGoHome={() => {
                    window.history.pushState({}, '', '/');
                    window.location.reload();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen relative">
            {transitionLoading.active && (
                <GameLoadingScreen
                    title={transitionLoading.title}
                    subtitle={transitionLoading.subtitle}
                />
            )}

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
                    onGoSetup={handleGoSetup}
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
                    onBack={handleBackHome}
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