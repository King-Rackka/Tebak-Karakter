import React, { useMemo, useState, useEffect } from 'react';

const SETUP_IMAGES = {
  luffy: '/images/setup/luffy-setup.png',
  AOT: '/images/setup/aot-card.jpg',
  Naruto: '/images/setup/naruto-card.jpg',
  mix: '/images/setup/mix-card.jpg',
};

export function SetupRoomPage({
  themes = [],
  nickname = '',
  onBack,
  onCreateRoom,
  loading = false,
  error = '',
}) {
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [rounds, setRounds] = useState(5);
  const [difficulties, setDifficulties] = useState(['easy']);
  const [selectedThemes, setSelectedThemes] = useState(['AOT']);
  const [hideSpoilers, setHideSpoilers] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowHowToPlay(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleDifficulty = (d) =>
    setDifficulties((prev) =>
      prev.includes(d)
        ? prev.length > 1
          ? prev.filter((x) => x !== d)
          : prev
        : [...prev, d]
    );

  const toggleTheme = (id) =>
    setSelectedThemes((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev
        : [...prev, id]
    );

  const availableIds = useMemo(
    () => (themes.length > 0 ? themes.map((t) => t.id) : ['AOT', 'Naruto']),
    [themes]
  );

  const isMixAll =
    availableIds.length > 1 &&
    availableIds.every((id) => selectedThemes.includes(id));

  const selectAll = () => setSelectedThemes([...availableIds]);

  const poolInfo = useMemo(() => {
    let total = 0;
    for (const t of themes) {
      if (!selectedThemes.includes(t.id)) continue;
      const src = hideSpoilers ? t.nonSpoilerCounts : t.counts;
      for (const d of difficulties) total += src?.[d] || 0;
    }
    const needed = maxPlayers * rounds;
    return { total, needed, enough: total >= needed };
  }, [themes, selectedThemes, difficulties, hideSpoilers, maxPlayers, rounds]);

  const estMin = rounds * 2;
  const estMax = rounds * 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRoom({
      maxPlayers,
      rounds,
      difficulties,
      themes: selectedThemes,
      hideSpoilers,
    });
  };

  const themeCards = useMemo(() => {
    const baseThemes =
      themes.length > 0
        ? themes
        : [
            { id: 'AOT', name: 'Attack on Titan', total: 96, nonSpoilerTotal: 96 },
            { id: 'Naruto', name: 'Naruto', total: 131, nonSpoilerTotal: 131 },
          ];

    const mapped = baseThemes.map((t) => ({
      id: t.id,
      label:
        t.id === 'AOT'
          ? 'Attack on Titan'
          : t.id === 'Naruto'
          ? 'Naruto'
          : t.name,
      total: hideSpoilers ? t.nonSpoilerTotal ?? t.total : t.total,
      image: SETUP_IMAGES[t.id] || `/images/setup/${t.id.toLowerCase()}-card.jpg`,
      fallbackImage:
        t.id === 'AOT' ? '/images/Levi-home.png' : '/images/naruto-home.jpg',
      bgTone:
        t.id === 'AOT'
          ? 'from-[#283342] via-[#1c232e] to-[#12161f]'
          : 'from-[#2f3b52] via-[#22293b] to-[#141824]',
      hasSpiralWatermark: t.id === 'Naruto',
    }));

    const combinedTotal = baseThemes.reduce(
      (sum, t) => sum + (hideSpoilers ? t.nonSpoilerTotal ?? t.total : t.total),
      0
    );

    return [
      ...mapped,
      {
        id: '__mix__',
        label: 'Campur Semua',
        total: combinedTotal,
        image: SETUP_IMAGES.mix,
        fallbackImage: '/images/setup/mix-card.png',
        bgTone: 'from-[#362b5c] via-[#251d42] to-[#151026]',
        hasSpiralWatermark: false,
      },
    ];
  }, [themes, hideSpoilers]);

  return (
    <div
      className="min-h-screen min-h-[100svh] bg-[#0c0a18] text-white relative overflow-x-hidden flex flex-col justify-between selection:bg-[#6246ea] selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Thin Scrollbar untuk Grid Tema (> 3 kartu) */}
      <style>{`
        .theme-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .theme-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
        }
        .theme-scroll::-webkit-scrollbar-thumb {
          background: rgba(143, 110, 255, 0.55);
          border-radius: 999px;
        }
        .theme-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(143, 110, 255, 0.85);
        }
      `}</style>

      {/* Background Dot Grid & Ambient Glows */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#4f39d6 1.2px, transparent 1.2px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute top-[-10%] left-[10%] w-[460px] h-[460px] bg-[#5d3fd3]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[8%] right-[10%] w-[420px] h-[420px] bg-[#6246ea]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top-Right Tilted Checkerboard & Curved Arrow (Pojok Kanan Atas) */}
      <div
        className="hidden sm:block absolute -top-2 right-0 w-36 h-24 opacity-30 pointer-events-none -rotate-6 origin-top-right"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #6c52ee 25%, transparent 25%), linear-gradient(-45deg, #6c52ee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6c52ee 75%), linear-gradient(-45deg, transparent 75%, #6c52ee 75%)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
        }}
      />
      <svg
        className="hidden lg:block w-10 h-10 text-[#6c52ee] absolute top-2 right-[11.5%] opacity-90 pointer-events-none"
        viewBox="0 0 60 60"
        fill="none"
      >
        <path
          d="M46 8C26 12 20 32 36 47M36 47L24 44M36 47L38 35"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ================= NAVBAR (Z-50 agar selalu di atas) ================= */}
      <header className="relative z-50 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-3.5 sm:pt-4 pb-1 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer text-left"
        >
          <DetectiveLogo className="w-8 h-8 sm:w-9 sm:h-9 text-white transition-transform group-hover:scale-105" />
          <div className="leading-none">
            <span className="block font-extrabold text-[15px] sm:text-[18px] tracking-tight text-white">
              Tebak
            </span>
            <span className="block font-bold text-[13px] sm:text-[16px] tracking-tight text-[#8f74ff] mt-0.5">
              Karakter
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-2 sm:gap-8 lg:gap-10 text-[13px] sm:text-[14px] font-semibold">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-2 py-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Beranda</span>
          </button>

          <div className="relative flex items-center gap-1.5 px-2 py-1 text-[#9d7cff]">
            <GearIcon className="w-4 h-4" />
            <span>Setup Room</span>
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6246ea] rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center gap-1.5 px-2 py-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <InfoCircleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Cara Main</span>
          </button>
        </nav>

        <div className="hidden lg:block w-24" />
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center py-2"
      >
        {/* TOP HEADER ROW: Tilted "Setup Room" + Kolase Luffy Kanan (Dibatasi di sisi kanan agar tidak menabrak Navbar) */}
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between mb-2.5 lg:mb-3">
          {/* Left Tilted Title */}
          <div className="-rotate-[3.5deg] origin-bottom-left select-none z-20 pt-1">
            <div className="inline-flex items-center gap-2">
              <h1
                className="font-bold tracking-[-0.02em] leading-none text-[clamp(36px,4.2vw,54px)]"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <span className="text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                  Setup{' '}
                </span>
                <span className="text-[#8f6eff] drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                  Room
                </span>
              </h1>
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#facc15] -mt-3 rotate-12"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M8 34L6 16L17 24L24 12L31 24L42 16L40 34H8Z"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 39H38"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex items-center gap-2.5 mt-1">
              <p className="text-gray-200/90 text-xs sm:text-[14px] font-medium">
                Atur permainanmu sebelum membuat room!
              </p>
              <svg
                className="w-16 sm:w-24 h-3.5 text-[#facc15] shrink-0"
                viewBox="0 0 110 18"
                fill="none"
              >
                <path
                  d="M3 12C24 16 48 6 72 8C88 9 98 11 106 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* RIGHT DECORATIVE COLLAGE: Compact & Aligned Safely Below Navbar */}
          <div className="hidden lg:block relative w-[440px] h-[105px] pointer-events-none select-none mr-0">
            {/* Left Grayscale Tilted Polaroid */}
            <div className="absolute left-8 top-2 w-36 h-28 bg-[#2c254a] border-[4px] border-[#e8e4f5] shadow-lg -rotate-[11deg] overflow-hidden z-10">
              <img
                src={SETUP_IMAGES.AOT}
                onError={(e) => {
                  e.currentTarget.src = '/images/Levi-home.png';
                }}
                alt=""
                className="w-full h-full object-cover object-top grayscale contrast-125 opacity-65"
              />
            </div>

            {/* Right Grayscale Tilted Polaroid */}
            <div className="absolute right-14 top-1 w-40 h-28 bg-[#2c254a] border-[4px] border-[#e8e4f5] shadow-lg rotate-[8deg] overflow-hidden z-10">
              <img
                src={SETUP_IMAGES.Naruto}
                onError={(e) => {
                  e.currentTarget.src = '/images/naruto-home.jpg';
                }}
                alt=""
                className="w-full h-full object-cover object-top grayscale contrast-125 opacity-60"
              />
            </div>

            {/* Torn Purple & White Notebook Grid Paper */}
            <svg
              viewBox="0 0 460 95"
              fill="none"
              className="absolute inset-x-0 bottom-[-6px] w-full h-[88px] z-20"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="top-collage-tear" x="-5%" y="-20%" width="110%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.055"
                    numOctaves="4"
                    seed="12"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="6"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
                <pattern
                  id="top-collage-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(-5)"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#cbc4e6"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              <path
                d="M12 75 C 95 34, 215 14, 335 10 C 395 8, 435 6, 460 4 L 460 95 L 0 95 Z"
                fill="#7152eb"
                filter="url(#top-collage-tear)"
              />
              <path
                d="M0 84 C 110 42, 230 22, 355 18 C 405 16, 440 14, 460 12 L 460 95 L 0 95 Z"
                fill="#e9e5f6"
                filter="url(#top-collage-tear)"
              />
              <path
                d="M0 84 C 110 42, 230 22, 355 18 C 405 16, 440 14, 460 12 L 460 95 L 0 95 Z"
                fill="url(#top-collage-grid)"
                filter="url(#top-collage-tear)"
              />
            </svg>

            {/* Luffy Peeking Over Card (Skala proporsional agar tidak menyentuh Navbar) */}
            <img
              src={SETUP_IMAGES.luffy}
              onError={(e) => {
                e.currentTarget.src = '/images/luffy-home.png';
              }}
              alt="Luffy Siap Main"
              className="absolute left-[105px] -top-3 w-[178px] h-auto object-contain z-30"
              style={{
                filter:
                  'drop-shadow(0px 0px 3px #ffffff) drop-shadow(0px 6px 14px rgba(0,0,0,0.6))',
              }}
            />

            {/* Comic Exclamation Marks "!!" */}
            <div
              className="absolute right-[136px] bottom-3 z-40 rotate-[14deg] text-white font-extrabold text-[22px] leading-none tracking-tighter"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                textShadow: '0 2px 6px rgba(0,0,0,0.65)',
              }}
            >
              !!
            </div>

            {/* Speech Bubble "Siap main?" */}
            <div className="absolute right-4 top-2 z-40 -rotate-[6deg] drop-shadow-[0_6px_14px_rgba(75,50,184,0.25)]">
              <div
                className="relative bg-[#e6e1fa] text-[#5538cf] font-bold text-[14px] leading-[1.05] px-3 py-1.5 rounded-xl border-[2px] border-[#8b74f5] text-center"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Siap
                <br />
                main?
                <span className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-[#8b74f5]" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert if API failed */}
        {error && (
          <div className="mb-2.5 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs sm:text-sm text-rose-200">
            {error}
          </div>
        )}

        {/* TWO MAIN CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch relative z-30">
          {/* ── LEFT PANEL: Pengaturan Room ── */}
          <div className="lg:col-span-4 bg-[#151228]/95 backdrop-blur-md border border-[#302959] rounded-[20px] p-4 sm:p-5 shadow-[0_20px_55px_rgba(0,0,0,0.65)] flex flex-col justify-between space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#29234a] pb-2.5">
              <div className="flex items-center gap-2">
                <GearIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8f6eff]" />
                <h2 className="font-bold text-sm sm:text-base text-white">
                  Pengaturan Room
                </h2>
              </div>
              {nickname && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#241f42] text-[#a799ff] border border-[#362e63]">
                  Host: {nickname}
                </span>
              )}
            </div>

            {/* Jumlah Pemain */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                <UsersGroupIcon className="w-3.5 h-3.5 text-gray-300" />
                <span>Jumlah Pemain</span>
              </label>
              <div className="relative">
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#221d3b] border border-[#362f5e] text-xs sm:text-sm font-medium text-white focus:border-[#8f6eff] outline-none appearance-none cursor-pointer transition"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n} className="bg-[#181430]">
                      {n === 2
                        ? '2 Pemain (Min)'
                        : `${n} Pemain`}
                    </option>
                  ))}
                </select>
                <UsersGroupIcon className="w-3.5 h-3.5 text-[#a799ff] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Jumlah Ronde */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                <RefreshIcon className="w-3.5 h-3.5 text-gray-300" />
                <span>Jumlah Ronde</span>
              </label>
              <div className="relative">
                <select
                  value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#221d3b] border border-[#362f5e] text-xs sm:text-sm font-medium text-white focus:border-[#8f6eff] outline-none appearance-none cursor-pointer transition"
                >
                  {[3, 5, 7, 10].map((r) => (
                    <option key={r} value={r} className="bg-[#181430]">
                      {r} Ronde
                    </option>
                  ))}
                </select>
                <TrophyIcon className="w-3.5 h-3.5 text-[#facc15] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Tingkat Kesulitan */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                <SignalBarsIcon className="w-3.5 h-3.5 text-gray-300" />
                <span>Tingkat Kesulitan</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' },
                ].map((lvl) => {
                  const active = difficulties.includes(lvl.id);
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => toggleDifficulty(lvl.id)}
                      className={`py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                        active
                          ? 'bg-[#6c52ee] border-[#8f74ff] text-white shadow-[0_4px_12px_rgba(108,82,238,0.45)]'
                          : 'bg-[#221d3b] border-[#352e5c] text-gray-400 hover:text-white hover:border-[#53488c]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Spoiler Toggle */}
            <div
              onClick={() => setHideSpoilers((v) => !v)}
              className="flex items-center justify-between pt-0.5 cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                <LockIcon className="w-3.5 h-3.5 text-gray-300" />
                <span>Filter Spoiler</span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={hideSpoilers}
                className={`relative w-11 h-5.5 rounded-full transition-colors cursor-pointer ${
                  hideSpoilers ? 'bg-[#6c52ee]' : 'bg-[#2a2447]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                    hideSpoilers ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Estimasi Durasi & Pool Info */}
            <div className="pt-2 border-t border-[#29234a] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                  <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
                  Estimasi Durasi
                </span>
                <span className="font-bold text-[#9d7cff]">
                  ± {estMin}–{estMax} Menit
                </span>
              </div>

              {themes.length > 0 && (
                <div
                  className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center justify-between ${
                    poolInfo.enough
                      ? 'bg-emerald-500/10 border-emerald-400/25 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-400/30 text-amber-300'
                  }`}
                >
                  <span>Pool karakter tersedia:</span>
                  <strong>
                    {poolInfo.total} (butuh {poolInfo.needed})
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: Pilih Tema Anime (Scrollable ke bawah jika > 3 tema) ── */}
          <div className="lg:col-span-8 bg-[#151228]/95 backdrop-blur-md border border-[#302959] rounded-[20px] p-4 sm:p-5 shadow-[0_20px_55px_rgba(0,0,0,0.65)] flex flex-col justify-start min-h-0">
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between gap-3 mb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#facc15]" />
                  <h2 className="font-bold text-sm sm:text-[17px] text-white">
                    Pilih Tema Anime
                  </h2>
                </div>
                <p className="text-xs text-gray-300/85 mt-0.5">
                  Kamu bisa memilih lebih dari satu tema!
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241f42] border border-[#3a3269] text-xs font-semibold text-gray-200 shrink-0">
                <CardsBadgeIcon className="w-3.5 h-3.5 text-[#facc15]" />
                <span>{themeCards.length} tema tersedia</span>
              </span>
            </div>

            {/* Scrollable Cards Grid */}
            <div className="theme-scroll grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-h-[320px] lg:max-h-[245px] xl:max-h-[275px] overflow-y-auto pr-1 pt-0.5 pb-1">
              {themeCards.map((card) => {
                const isSelected =
                  card.id === '__mix__'
                    ? isMixAll
                    : selectedThemes.includes(card.id);

                const handleCardClick = () => {
                  if (card.id === '__mix__') selectAll();
                  else toggleTheme(card.id);
                };

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={handleCardClick}
                    className={`relative rounded-[18px] overflow-hidden bg-gradient-to-b ${card.bgTone} border-2 transition-all duration-200 cursor-pointer group flex flex-col justify-end min-h-[205px] lg:min-h-[225px] text-center shrink-0 ${
                      isSelected
                        ? 'border-[#8f6eff] shadow-[0_0_22px_rgba(143,110,255,0.35)]'
                        : 'border-white/15 opacity-80 hover:opacity-100 hover:border-white/35'
                    }`}
                  >
                    <img
                      src={card.image}
                      onError={(e) => {
                        if (card.fallbackImage) {
                          e.currentTarget.src = card.fallbackImage;
                        }
                      }}
                      alt={card.label}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />

                    {card.hasSpiralWatermark && (
                      <svg
                        className="w-16 h-16 text-amber-500/25 absolute right-2 bottom-10 pointer-events-none"
                        viewBox="0 0 64 64"
                        fill="none"
                      >
                        <path
                          d="M32 32c0-4 3-7 7-7 6 0 11 5 11 11 0 9-7 16-16 16-12 0-22-10-22-22 0-15 12-27 27-27"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c0a18] via-[#0c0a18]/80 to-transparent" />

                    <div
                      className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                        isSelected
                          ? 'bg-[#8f6eff] border-white text-white shadow-md'
                          : 'bg-black/35 border-white/75 text-transparent'
                      }`}
                    >
                      <CheckIcon className="w-3.5 h-3.5" />
                    </div>

                    <div className="relative z-10 px-3 pb-3 pt-5">
                      <div className="font-extrabold text-sm sm:text-base text-white drop-shadow">
                        {card.label}
                      </div>
                      <div className="inline-flex items-center justify-center gap-1.5 mt-0.5 text-xs font-semibold text-gray-200">
                        <UsersGroupIcon className="w-3.5 h-3.5 text-white" />
                        <span>{card.total} karakter</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ACTION BAR (TERLIHAT PENUH DI ZOOM 100%) ================= */}
        <div className="relative z-30 flex items-center justify-between gap-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#1b1733] hover:bg-[#262147] active:scale-[0.98] text-white font-bold text-sm sm:text-[15px] px-6 sm:px-8 py-3 rounded-2xl border-2 border-[#3f3773] shadow-[0_10px_28px_rgba(0,0,0,0.45)] flex items-center gap-2 transition cursor-pointer"
          >
            <span className="text-base leading-none">←</span>
            <span>Kembali</span>
          </button>

          <div className="hidden md:flex items-center gap-2 -rotate-[3.5deg] select-none">
            <span className="text-xs font-semibold text-[#b3a8e6] text-center leading-tight">
              Bersiap untuk
              <br />
              menebak karakter favoritmu!
            </span>
            <StarIcon className="w-4 h-4 text-[#facc15]" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#6c52ee] hover:bg-[#5b41dc] disabled:opacity-60 active:scale-[0.98] text-white font-bold text-sm sm:text-[15px] px-7 sm:px-9 py-3 rounded-2xl border-2 border-[#9d87ff]/60 shadow-[0_10px_30px_rgba(108,82,238,0.55)] flex items-center gap-2 transition cursor-pointer"
          >
            <StarIcon className="w-4 h-4 text-white" />
            <span>{loading ? 'Membuat Room...' : 'Buat Room'}</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>
      </form>

      {/* ================= BOTTOM DECORATIVE TORN NOTEBOOK PAPER ================= */}
      <div className="relative w-full z-10 pointer-events-none select-none shrink-0 -mt-12">
        <div
          className="hidden sm:block absolute bottom-6 left-0 w-32 h-20 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #6246ea 25%, transparent 25%), linear-gradient(-45deg, #6246ea 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6246ea 75%), linear-gradient(-45deg, transparent 75%, #6246ea 75%)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
          }}
        />

        <svg
          className="hidden md:block w-14 h-8 text-[#6c52ee] absolute bottom-4 left-[27%]"
          viewBox="0 0 75 40"
          fill="none"
        >
          <path
            d="M4 28C26 24 46 20 66 13M66 13L53 9M66 13L59 24"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          viewBox="0 0 1440 105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 sm:h-24 block"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="setup-torn-edge" x="-5%" y="-25%" width="110%" height="150%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="4"
                seed="7"
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
              id="setup-notebook-grid"
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
            d="M-20 36 C 95 40, 220 58, 340 82 L -20 110 Z"
            fill="#6c52ee"
            filter="url(#setup-torn-edge)"
          />
          <path
            d="M-20 46 C 165 55, 345 75, 525 103 L -20 110 Z"
            fill="#ece9f7"
            filter="url(#setup-torn-edge)"
          />
          <path
            d="M-20 46 C 165 55, 345 75, 525 103 L -20 110 Z"
            fill="url(#setup-notebook-grid)"
            filter="url(#setup-torn-edge)"
          />

          <path
            d="M915 103 C 1090 68, 1270 40, 1460 14 L 1460 110 L 915 110 Z"
            fill="#6c52ee"
            filter="url(#setup-torn-edge)"
          />
          <path
            d="M960 103 C 1125 74, 1295 50, 1460 30 L 1460 110 L 960 110 Z"
            fill="#ece9f7"
            filter="url(#setup-torn-edge)"
          />
          <path
            d="M960 103 C 1125 74, 1295 50, 1460 30 L 1460 110 L 960 110 Z"
            fill="url(#setup-notebook-grid)"
            filter="url(#setup-torn-edge)"
          />
        </svg>
      </div>

      {/* ================= MODAL CARA MAIN ================= */}
      {showHowToPlay && (
        <div
          onClick={() => setShowHowToPlay(false)}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070612]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16132b] border-2 border-[#383066] rounded-3xl max-w-md w-full p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative text-white space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#252042] hover:bg-[#6246ea] text-gray-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Cara Mengatur Room
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li className="bg-[#1e1a38] p-3 rounded-xl border border-[#2f2857]">
                <strong className="text-white">1. Atur Pemain & Ronde:</strong> Tentukan maksimal pemain (2–8) dan jumlah ronde permainan.
              </li>
              <li className="bg-[#1e1a38] p-3 rounded-xl border border-[#2f2857]">
                <strong className="text-white">2. Pilih Tingkat Kesulitan:</strong> Kamu bisa mengaktifkan lebih dari satu tingkat kesulitan sekaligus.
              </li>
              <li className="bg-[#1e1a38] p-3 rounded-xl border border-[#2f2857]">
                <strong className="text-white">3. Pilih Tema Anime:</strong> Pilih Attack on Titan, Naruto, atau Campur Semua untuk menggabungkan seluruh karakter.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="w-full bg-[#6246ea] hover:bg-[#5338d8] text-white font-bold text-sm py-2.5 rounded-full cursor-pointer"
            >
              Siap Atur Room!
            </button>
          </div>
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

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
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

function InfoCircleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function InfoSmallIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
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

function RefreshIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function SignalBarsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="14" width="3.5" height="6" rx="1" />
      <rect x="10.2" y="10" width="3.5" height="10" rx="1" />
      <rect x="16.5" y="5" width="3.5" height="15" rx="1" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
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

function CardsBadgeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="11" height="14" rx="2" />
      <path d="M17 7h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1" opacity="0.65" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default SetupRoomPage;