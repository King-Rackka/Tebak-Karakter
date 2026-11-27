import React, { useState, useEffect } from 'react';

const AVATAR_STYLES = [
  'from-[#6246ea] to-[#9d7cff] border-[#b8a3ff]',
  'from-[#f59e0b] to-[#fbbf24] border-[#fde68a]',
  'from-[#10b981] to-[#34d399] border-[#a7f3d0]',
  'from-[#ec4899] to-[#f472b6] border-[#fbcfe8]',
  'from-[#3b82f6] to-[#60a5fa] border-[#bfdbfe]',
  'from-[#8b5cf6] to-[#c084fc] border-[#e9d5ff]',
  'from-[#ef4444] to-[#f87171] border-[#fecaca]',
  'from-[#14b8a6] to-[#2dd4bf] border-[#99f6e4]',
];

export function LobbyPage({
  room,
  themes = [],
  onStartGame,
  onUpdateSettings,
  onLeave,
  loading = false,
  error = '',
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draftSettings, setDraftSettings] = useState(room.settings);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setEditOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const shareUrl = `${window.location.origin}/?room=${room.code}`;
  const canStart = room.isHost && room.players.length >= 2;
  const hostPlayer = room.players.find((p) => p.isHost);
  const emptySlots = Math.max(0, room.settings.maxPlayers - room.players.length);

  const copyText = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 1800);
    } catch {
      // fallback silent
    }
  };

  const openEditModal = () => {
    setDraftSettings(room.settings);
    setEditOpen(true);
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    await onUpdateSettings(draftSettings);
    setEditOpen(false);
  };

  const toggleDraftDiff = (diff) => {
    setDraftSettings((prev) => {
      const exists = prev.difficulties.includes(diff);
      if (exists && prev.difficulties.length === 1) return prev;
      return {
        ...prev,
        difficulties: exists
          ? prev.difficulties.filter((d) => d !== diff)
          : [...prev.difficulties, diff],
      };
    });
  };

  const toggleDraftTheme = (themeId) => {
    setDraftSettings((prev) => {
      const exists = prev.themes.includes(themeId);
      if (exists && prev.themes.length === 1) return prev;
      return {
        ...prev,
        themes: exists
          ? prev.themes.filter((t) => t !== themeId)
          : [...prev.themes, themeId],
      };
    });
  };

  const formatThemeLabel = (themeIds) => {
    if (themes.length > 0 && themeIds.length === themes.length) {
      return 'Campur Semua';
    }
    return themeIds
      .map((id) => (id === 'AOT' ? 'Attack on Titan' : id))
      .join(' + ');
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden bg-[#0c0a18] text-white relative overflow-x-hidden flex flex-col justify-between selection:bg-[#6246ea] selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Background Dot Grid & Ambient Glows */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4f39d6 1.2px, transparent 1.2px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute top-[-10%] left-[8%] w-[460px] h-[460px] bg-[#5d3fd3]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[8%] right-[8%] w-[420px] h-[420px] bg-[#6246ea]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top-Right Tilted Checkerboard Accent */}
      <div
        className="hidden sm:block absolute -top-2 right-0 w-36 h-24 opacity-25 pointer-events-none -rotate-6 origin-top-right"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #6c52ee 25%, transparent 25%), linear-gradient(-45deg, #6c52ee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6c52ee 75%), linear-gradient(-45deg, transparent 75%, #6c52ee 75%)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
        }}
      />

      {/* ================= NAVBAR ================= */}
      <header className="relative z-40 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-3.5 sm:pt-4 lg:pt-[2vh] pb-1 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 select-none">
          <DetectiveLogo className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
          <div className="leading-none">
            <span className="block font-extrabold text-[15px] sm:text-[18px] tracking-tight text-white">
              Tebak
            </span>
            <span className="block font-bold text-[13px] sm:text-[16px] tracking-tight text-[#8f74ff] mt-0.5">
              Karakter
            </span>
          </div>
        </div>

        {/* Status Pill Tengah */}
        <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17132c] border border-[#322b5e] text-xs font-semibold text-gray-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Menunggu Pemain Bergabung</span>
        </div>

        {/* Tombol Keluar Room */}
        <button
          type="button"
          onClick={onLeave}
          className="bg-[#1b1733] hover:bg-rose-500/20 text-gray-200 hover:text-rose-200 border border-[#362e63] hover:border-rose-500/40 px-4 py-2 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition cursor-pointer"
        >
          <LogoutIcon className="w-4 h-4 text-rose-400" />
          <span>Keluar Room</span>
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-30 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex-1 min-h-0 flex flex-col justify-center py-2 lg:py-0">
        {/* TOP ROW: Tilted "Lobby Room" + Ticket Kode Room */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 lg:mb-[2vh]">
          {/* Left Tilted Title */}
          <div className="-rotate-[3deg] origin-left select-none">
            <div className="inline-flex items-center gap-2">
              <h1
                className="font-extrabold tracking-[-0.02em] leading-none text-[clamp(34px,4vw,52px)]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <span className="text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                  Lobby{' '}
                </span>
                <span className="text-[#8f6eff] drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                  Room
                </span>
              </h1>
              <StarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#facc15] -mt-2" />
            </div>
            <p className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
              Bagikan kode atau link room ke temanmu sebelum permainan dimulai!
            </p>
          </div>

          {/* Right Room Code Ticket Card */}
          <div className="bg-[#16132c]/95 backdrop-blur-md border-2 border-[#43397a] rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-[0_14px_35px_rgba(0,0,0,0.55)] flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-bold text-[#a799ff]">
                Kode Room
              </span>
              <span
                className="font-bold text-2xl sm:text-3xl tracking-[0.18em] text-white"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {room.code}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyText(room.code, setCopiedCode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  copiedCode
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#241f42] hover:bg-[#2f2857] border-[#3d346e] text-white'
                }`}
              >
                {copiedCode ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Tersalin' : 'Kode'}</span>
              </button>

              <button
                type="button"
                onClick={() => copyText(shareUrl, setCopiedLink)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#6246ea] hover:bg-[#5338d8] border-[#8b74f5] text-white shadow-[0_4px_14px_rgba(98,70,234,0.45)]'
                }`}
              >
                {copiedLink ? <CheckIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Disalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs sm:text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* TWO MAIN PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          {/* ── LEFT PANEL: Daftar Pemain (2 Kolom Card agar muat 8 pemain tanpa scroll) ── */}
          <div className="lg:col-span-7 bg-[#151228]/95 backdrop-blur-md border border-[#302959] rounded-[22px] p-4 sm:p-5 shadow-[0_20px_55px_rgba(0,0,0,0.65)] flex flex-col justify-start">
            <div className="flex items-center justify-between border-b border-[#29234a] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <UsersGroupIcon className="w-5 h-5 text-[#8f6eff]" />
                <h2 className="font-bold text-sm sm:text-base text-white">
                  Daftar Pemain ({room.players.length}/{room.settings.maxPlayers})
                </h2>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#241f42] text-[#a799ff] border border-[#362e63]">
                Min. 2 Pemain
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.players.map((p, index) => {
                const avatarTone = AVATAR_STYLES[index % AVATAR_STYLES.length];
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition ${
                      p.isSelf
                        ? 'bg-[#6246ea]/18 border-[#8f6eff] shadow-[0_0_18px_rgba(143,110,255,0.2)]'
                        : 'bg-[#1e1a36] border-[#2f2857]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarTone} border flex items-center justify-center font-extrabold text-xs text-white shadow shrink-0`}
                        style={{ fontFamily: "'Fredoka', sans-serif" }}
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{p.name}</span>
                          {p.isSelf && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6246ea] text-white shrink-0">
                              Kamu
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-medium block ${
                            p.connected ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {p.connected ? '● Siap bermain' : '○ Koneksi terputus'}
                        </span>
                      </div>
                    </div>

                    {p.isHost && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#facc15]/15 border border-[#facc15]/40 text-[#facc15] text-[11px] font-bold shrink-0 ml-2">
                        <CrownIcon className="w-3.5 h-3.5" />
                        Host
                      </span>
                    )}
                  </div>
                );
              })}

              {Array.from({ length: emptySlots }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="px-3.5 py-2.5 rounded-2xl border border-dashed border-[#342d5e] bg-[#110e21]/60 text-xs text-gray-400/70 flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl border border-dashed border-[#3d356e] flex items-center justify-center text-gray-500 text-sm shrink-0">
                    ?
                  </div>
                  <span>Menunggu pemain...</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL: Ringkasan Pengaturan Room ── */}
          <div className="lg:col-span-5 bg-[#151228]/95 backdrop-blur-md border border-[#302959] rounded-[22px] p-4 sm:p-5 shadow-[0_20px_55px_rgba(0,0,0,0.65)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#29234a] pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <GearIcon className="w-5 h-5 text-[#facc15]" />
                  <h2 className="font-bold text-sm sm:text-base text-white">
                    Aturan Permainan
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-gray-400">
                  Mode Party
                </span>
              </div>

              <dl className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between bg-[#1e1a36] px-3.5 py-2.5 rounded-xl border border-[#2d2654]">
                  <dt className="text-gray-300 font-medium">Tema Anime</dt>
                  <dd className="font-bold text-[#a799ff] text-right">
                    {formatThemeLabel(room.settings.themes)}
                  </dd>
                </div>

                <div className="flex items-center justify-between bg-[#1e1a36] px-3.5 py-2.5 rounded-xl border border-[#2d2654]">
                  <dt className="text-gray-300 font-medium">Jumlah Ronde</dt>
                  <dd className="font-bold text-white">
                    {room.settings.rounds} Ronde
                  </dd>
                </div>

                <div className="flex items-center justify-between bg-[#1e1a36] px-3.5 py-2.5 rounded-xl border border-[#2d2654]">
                  <dt className="text-gray-300 font-medium">Tingkat Kesulitan</dt>
                  <dd className="flex items-center gap-1.5">
                    {room.settings.difficulties.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-0.5 rounded-full bg-[#6246ea]/25 border border-[#8f6eff]/50 text-[#c4b5fd] text-xs font-bold capitalize"
                      >
                        {d}
                      </span>
                    ))}
                  </dd>
                </div>

                <div className="flex items-center justify-between bg-[#1e1a36] px-3.5 py-2.5 rounded-xl border border-[#2d2654]">
                  <dt className="text-gray-300 font-medium">Filter Spoiler</dt>
                  <dd
                    className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${
                      room.settings.hideSpoilers
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {room.settings.hideSpoilers ? 'Aktif (Aman)' : 'Semua Karakter'}
                  </dd>
                </div>
              </dl>
            </div>

            {room.isHost && (
              <button
                type="button"
                onClick={openEditModal}
                className="w-full mt-3.5 py-2.5 px-4 rounded-xl bg-[#241f42] hover:bg-[#2f2857] border border-[#3f3673] text-xs sm:text-sm font-bold text-white inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <SlidersIcon className="w-4 h-4 text-[#a799ff]" />
                <span>Ubah Pengaturan Room</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= BOTTOM CTA BAR ================= */}
        <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 lg:pt-[2vh] pb-1">
          <div className="hidden md:flex items-center gap-2 -rotate-[2.5deg] select-none">
            <span className="text-xs font-semibold text-[#b3a8e6] leading-tight">
              Pastikan semua temanmu sudah masuk
              <br />
              sebelum memulai ronde pertama!
            </span>
            <StarIcon className="w-4 h-4 text-[#facc15]" />
          </div>

          {room.isHost ? (
            <button
              type="button"
              onClick={onStartGame}
              disabled={!canStart || loading}
              className="w-full sm:w-auto bg-[#6c52ee] hover:bg-[#5b41dc] disabled:bg-[#2a244a] disabled:text-gray-400 disabled:border-[#3d356b] disabled:shadow-none active:scale-[0.98] text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-3.5 rounded-2xl border-2 border-[#9d87ff]/60 shadow-[0_10px_30px_rgba(108,82,238,0.55)] flex items-center justify-center gap-2.5 transition cursor-pointer ml-auto"
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              <span>
                {room.players.length < 2
                  ? 'Menunggu Minimal 2 Pemain...'
                  : loading
                  ? 'Memulai Game...'
                  : 'Mulai Game Sekarang'}
              </span>
            </button>
          ) : (
            <div className="w-full sm:w-auto ml-auto bg-[#1b1733]/95 border border-[#3f3773] rounded-2xl px-6 py-3 text-xs sm:text-sm text-gray-200 flex items-center justify-center gap-2.5 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] animate-ping" />
              <span>
                Menunggu host{' '}
                <strong className="text-[#facc15]">
                  {hostPlayer?.name || 'Host'}
                </strong>{' '}
                memulai permainan...
              </span>
            </div>
          )}
        </div>
      </main>

      {/* ================= BOTTOM DECORATIVE TORN NOTEBOOK PAPER ================= */}
      <div className="relative w-full z-10 pointer-events-none select-none shrink-0 -mt-6 lg:-mt-8">
        <svg
          viewBox="0 0 1440 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14 sm:h-18 lg:h-[9vh] lg:max-h-20 block"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="lobby-torn-edge" x="-5%" y="-25%" width="110%" height="150%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="4"
                seed="5"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <pattern
              id="lobby-notebook-grid"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-4)"
            >
              <path
                d="M 22 0 L 0 0 0 22"
                fill="none"
                stroke="#cfc9e8"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <path
            d="M-20 35 C 120 40, 260 58, 420 82 L -20 100 Z"
            fill="#6c52ee"
            filter="url(#lobby-torn-edge)"
          />
          <path
            d="M-20 46 C 170 55, 350 75, 530 95 L -20 100 Z"
            fill="#ece9f7"
            filter="url(#lobby-torn-edge)"
          />
          <path
            d="M-20 46 C 170 55, 350 75, 530 95 L -20 100 Z"
            fill="url(#lobby-notebook-grid)"
            filter="url(#lobby-torn-edge)"
          />

          <path
            d="M920 95 C 1095 65, 1275 38, 1460 12 L 1460 100 L 920 100 Z"
            fill="#6c52ee"
            filter="url(#lobby-torn-edge)"
          />
          <path
            d="M970 95 C 1135 72, 1300 48, 1460 28 L 1460 100 L 970 100 Z"
            fill="#ece9f7"
            filter="url(#lobby-torn-edge)"
          />
          <path
            d="M970 95 C 1135 72, 1300 48, 1460 28 L 1460 100 L 970 100 Z"
            fill="url(#lobby-notebook-grid)"
            filter="url(#lobby-torn-edge)"
          />
        </svg>
      </div>

      {/* ================= MODAL UBAH PENGATURAN ================= */}
      {editOpen && (
        <div
          onClick={() => setEditOpen(false)}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070612]/80 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSaveDraft}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16132b] border-2 border-[#383066] w-full max-w-md rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative space-y-4 text-white"
          >
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#252042] hover:bg-[#6246ea] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Ubah Pengaturan Room
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Maks. Pemain
                </label>
                <select
                  value={draftSettings.maxPlayers}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      maxPlayers: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#221d3b] border border-[#362f5e] text-sm text-white outline-none"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option
                      key={n}
                      value={n}
                      disabled={n < room.players.length}
                      className="bg-[#181430]"
                    >
                      {n} Pemain
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Jumlah Ronde
                </label>
                <select
                  value={draftSettings.rounds}
                  onChange={(e) =>
                    setDraftSettings({
                      ...draftSettings,
                      rounds: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#221d3b] border border-[#362f5e] text-sm text-white outline-none"
                >
                  {[3, 5, 7, 10].map((r) => (
                    <option key={r} value={r} className="bg-[#181430]">
                      {r} Ronde
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tema Anime
              </label>
              <div className="flex flex-wrap gap-2">
                {themes.map((t) => {
                  const active = draftSettings.themes.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleDraftTheme(t.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition ${
                        active
                          ? 'bg-[#6246ea] border-[#8f74ff] text-white'
                          : 'bg-[#221d3b] border-[#352e5c] text-gray-400 hover:text-white'
                      }`}
                    >
                      {t.id === 'AOT' ? 'Attack on Titan' : t.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Tingkat Kesulitan
              </label>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((d) => {
                  const active = draftSettings.difficulties.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDraftDiff(d)}
                      className={`flex-1 py-1.5 rounded-full text-xs font-bold capitalize border cursor-pointer transition ${
                        active
                          ? 'bg-[#6246ea] border-[#8f74ff] text-white'
                          : 'bg-[#221d3b] border-[#352e5c] text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-gray-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={draftSettings.hideSpoilers}
                onChange={(e) =>
                  setDraftSettings({
                    ...draftSettings,
                    hideSpoilers: e.target.checked,
                  })
                }
                className="accent-[#6246ea] w-4 h-4"
              />
              Sembunyikan karakter spoiler
            </label>

            <button
              type="submit"
              className="w-full bg-[#6246ea] hover:bg-[#5338d8] text-white font-bold text-sm py-3 rounded-full shadow-[0_6px_20px_rgba(98,70,234,0.45)] cursor-pointer transition"
            >
              Simpan Perubahan
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* ================= ICONS ================= */

function DetectiveLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <path d="M14 21L17 10L24 12L31 10L34 21H14Z" fill="currentColor" />
      <ellipse cx="24" cy="21" rx="17" ry="3.5" fill="currentColor" />
      <circle cx="17.5" cy="30.5" r="5" stroke="currentColor" strokeWidth="3" />
      <circle cx="30.5" cy="30.5" r="5" stroke="currentColor" strokeWidth="3" />
      <path d="M22.5 30.5H25.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
    </svg>
  );
}

function UsersGroupIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function GearIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CrownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

function CopyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function SlidersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

export default LobbyPage;