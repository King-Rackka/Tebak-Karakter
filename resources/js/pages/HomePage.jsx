import React, { useState, useEffect, useRef } from 'react';

export function HomePage({
  nickname = '',
  onNicknameChange,
  initialCode = '',
  onGoSetup,
  onJoinRoom,
  onOpenHowToPlay,
  loading = false,
  error = '',
}) {
  const [roomCode, setRoomCode] = useState(initialCode);
  const [activeModal, setActiveModal] = useState(null); // null | 'cara-main' | 'tentang'
  const [popupNotice, setPopupNotice] = useState(null); // { title, message, focusField }

  const nicknameInputRef = useRef(null);
  const roomCodeInputRef = useRef(null);

  useEffect(() => {
    if (initialCode) setRoomCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    if (error) {
      setPopupNotice({
        title: 'Tidak Dapat Bergabung',
        message: error,
        focusField: 'roomCode',
      });
    }
  }, [error]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (popupNotice) closeNotice();
        else setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [popupNotice]);

  useEffect(() => {
    document.body.style.overflow = activeModal || popupNotice ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal, popupNotice]);

  const closeNotice = () => {
    const targetField = popupNotice?.focusField;
    setPopupNotice(null);
    setTimeout(() => {
      if (targetField === 'nickname') nicknameInputRef.current?.focus();
      if (targetField === 'roomCode') roomCodeInputRef.current?.focus();
    }, 50);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setPopupNotice({
        title: 'Nickname Masih Kosong!',
        message: 'Isi nickname kamu terlebih dahulu sebelum membuat room permainan.',
        focusField: 'nickname',
      });
      return;
    }
    if (onGoSetup) onGoSetup();
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setPopupNotice({
        title: 'Nickname Masih Kosong!',
        message: 'Masukkan nickname kamu dulu di kolom atas sebelum bergabung ke room.',
        focusField: 'nickname',
      });
      return;
    }
    if (!roomCode.trim()) {
      setPopupNotice({
        title: 'Kode Room Belum Diisi!',
        message: 'Masukkan kode room dari temanmu untuk masuk ke dalam permainan.',
        focusField: 'roomCode',
      });
      return;
    }
    if (onJoinRoom) onJoinRoom(roomCode.trim().toUpperCase());
  };

  const navItems = [
    { id: null, label: 'Beranda', Icon: HomeIcon },
    { id: 'cara-main', label: 'Cara Main', Icon: QuestionCircleIcon },
    { id: 'tentang', label: 'Tentang', Icon: InfoCircleIcon },
  ];

  const inputCls =
    'min-w-0 w-full sm:flex-1 bg-[#26213d] border border-[#3a335e] focus:border-[#8b6eff] focus:ring-2 focus:ring-[#8b6eff]/30 rounded-full px-4 sm:px-5 py-2.5 lg:py-[1.05vh] text-sm text-white placeholder-gray-400 outline-none transition';

  return (
    <div
      className="min-h-screen min-h-[100dvh] lg:h-[100dvh] lg:min-h-0 lg:overflow-hidden bg-[#0c0a18] text-white relative overflow-x-hidden flex flex-col justify-between selection:bg-[#6246ea] selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#4f39d6 1.2px, transparent 1.2px)', backgroundSize: '34px 34px' }}
      />
      <div className="absolute top-[-10%] left-[-20%] lg:left-[15%] w-[340px] lg:w-[460px] aspect-square bg-[#5d3fd3]/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] lg:right-[5%] w-[300px] lg:w-[420px] aspect-square bg-[#6246ea]/25 rounded-full blur-[110px] pointer-events-none" />

      <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#6246ea] absolute top-[12vh] left-[8%] lg:left-[14%] pointer-events-none" />

      {/* ================= NAVBAR ================= */}
      <header className="relative z-50 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-3.5 sm:pt-4 lg:pt-[2vh] pb-1 flex items-center justify-between gap-3 shrink-0">
        <a href="/" className="flex items-center gap-2 group shrink-0">
          <DetectiveLogo className="w-8 h-8 sm:w-9 sm:h-9 text-white transition-transform group-hover:scale-105" />
          <div className="leading-none">
            <span className="block font-extrabold text-[15px] sm:text-[18px] tracking-tight">Tebak</span>
            <span className="block font-bold text-[13px] sm:text-[16px] tracking-tight text-[#8f74ff] mt-0.5">Karakter</span>
          </div>
        </a>

        <nav className="flex items-center gap-1 sm:gap-6 lg:gap-10 text-[13px] sm:text-[14px] font-semibold">
          {navItems.map(({ id, label, Icon }) => {
            const active = activeModal === id;
            return (
              <button
                key={label}
                onClick={() => setActiveModal(id)}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-1 pb-1.5 pt-1 transition-colors cursor-pointer ${
                  active ? 'text-[#9d7cff]' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                {active && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6246ea] rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block w-24" />
      </header>

      {/* ================= HERO ================= */}
      <main className="relative z-30 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-12 gap-4 lg:gap-6 items-center flex-1 min-h-0 pt-3 pb-1 lg:py-0">
        {/* LEFT */}
        <div className="lg:col-span-6 min-w-0 flex flex-col items-start w-full max-w-[590px] mx-auto lg:mx-0">
          {/* Pill Badge (Diberi margin bawah cukup agar tidak tertimpa rotasi judul di mobile) */}


          {/* JUDUL TEBAK KARAKTER (origin-left di mobile agar tidak naik menimpa badge) */}
          <div className="relative -rotate-[4deg] sm:-rotate-[5deg] origin-left lg:origin-bottom-left select-none mb-3 lg:mb-[1.8vh] pl-1 sm:pl-0">
            <h1
              className="font-extrabold tracking-[-0.025em] leading-[0.88] text-[clamp(44px,min(12.5vw,11.2vh),96px)]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              <span className="inline-flex items-center gap-2 sm:gap-3.5 text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                Tebak
                <svg
                  className="w-7 h-7 sm:w-12 sm:h-12 text-[#facc15] -mt-2 sm:-mt-3 shrink-0"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M8 23L25 7"
                    stroke="currentColor"
                    strokeWidth="7.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 34L38 23"
                    stroke="currentColor"
                    strokeWidth="7.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="relative inline-block mt-1">
                <span
                  aria-hidden="true"
                  className="absolute -inset-x-2 sm:-inset-x-2.5 inset-y-0.5 sm:inset-y-1 bg-[#6246ea]/25 rounded-lg -z-10"
                />
                <span className="text-[#8f6eff] drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">
                  Karakter
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle miring */}
          <div className="-rotate-[2deg] sm:-rotate-[3deg] origin-left mb-4 lg:mb-[2.2vh] pl-1 sm:pl-0">
            <p className="text-gray-200/95 text-[13px] sm:text-[15.5px] font-medium leading-[1.42]">
              Satu karakter tersembunyi. Banyak kemungkinan.
              <br className="hidden sm:block" />{' '}
              Seberapa kenal kamu dengan karakter anime favoritmu?
            </p>
          </div>

          {/* Form card */}
          <div className="w-full bg-[#151228]/95 backdrop-blur-md border border-[#302959] rounded-[20px] p-4 lg:p-[2vh_1.25rem] shadow-[0_24px_60px_rgba(0,0,0,0.65)] space-y-3 lg:space-y-[1.35vh]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <UserIcon className="w-4 h-4 text-gray-200" />
              <label htmlFor="nickname">Masukkan Nickname Kamu</label>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2.5">
              <input
                ref={nicknameInputRef}
                id="nickname"
                type="text"
                value={nickname}
                maxLength={20}
                onChange={(e) => onNicknameChange && onNicknameChange(e.target.value)}
                placeholder="Contoh: AnimeLover"
                className={inputCls}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#6246ea] hover:bg-[#5338d8] disabled:opacity-60 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-6 py-2.5 lg:py-[1.05vh] rounded-full flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(98,70,234,0.5)] transition cursor-pointer whitespace-nowrap"
              >
                <span className="text-base leading-none">→</span>
                <span>Buat Room</span>
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-grow border-t border-[#2b254d]" />
              <span className="text-xs text-gray-400 font-medium">atau</span>
              <div className="flex-grow border-t border-[#2b254d]" />
            </div>

            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-200 sm:w-28 shrink-0">
                <DiamondIcon className="w-4 h-4" />
                <span>Gabung Room</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 flex-1 min-w-0">
                <input
                  ref={roomCodeInputRef}
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan Kode Room"
                  aria-label="Kode Room"
                  className={inputCls}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#f4f3f8] hover:bg-white disabled:opacity-60 active:scale-[0.98] text-[#151226] font-bold text-xs sm:text-sm px-5 py-2.5 lg:py-[1.05vh] rounded-full flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer shrink-0"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{loading ? 'Masuk...' : 'Gabung'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Link Bawah */}
          <div className="w-full flex items-center justify-center gap-6 sm:gap-8 pt-3 lg:pt-[1.4vh] text-xs font-semibold relative z-40">
            <button
              onClick={() => (onOpenHowToPlay ? onOpenHowToPlay() : setActiveModal('cara-main'))}
              className="flex items-center gap-1.5 text-[#9d7cff] hover:text-white underline underline-offset-4 transition cursor-pointer py-0.5"
            >
              <BookIcon className="w-4 h-4" />
              <span>Cara Bermain</span>
            </button>
            <button
              onClick={() => setActiveModal('tentang')}
              className="flex items-center gap-1.5 text-[#9d7cff] hover:text-white underline underline-offset-4 transition cursor-pointer py-0.5"
            >
              <InfoCircleIcon className="w-4 h-4" />
              <span>Tentang Game</span>
            </button>
          </div>
        </div>

        {/* RIGHT: collage (Proporsional di mobile agar Luffy & polaroid tampil utuh di atas kertas sobek) */}
        <div className="lg:col-span-6 relative w-[86%] max-w-[330px] sm:max-w-[440px] aspect-[1/0.92] sm:aspect-square mx-auto mt-3 mb-2 lg:my-0 lg:w-auto lg:max-w-none lg:h-[min(530px,69vh)] lg:justify-self-center select-none">
          <div
            className="absolute right-[-3%] bottom-[22%] w-[34%] aspect-square opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #6246ea 25%, transparent 25%), linear-gradient(-45deg, #6246ea 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6246ea 75%), linear-gradient(-45deg, transparent 75%, #6246ea 75%)',
              backgroundSize: '28px 28px',
              backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
            }}
          />

          <svg className="w-7 h-7 sm:w-10 sm:h-10 text-[#5b42d6] absolute -top-1 right-0 opacity-85" viewBox="0 0 60 60" fill="none">
            <path d="M46 50C24 46 20 22 44 9M44 9L31 10M44 9L43 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Levi */}
          <div className="absolute top-[4%] left-[2%] w-[43%] aspect-[7/8] bg-[#2c3340] border-[4px] sm:border-[6px] border-white shadow-[0_16px_35px_rgba(0,0,0,0.7)] -rotate-[7deg] overflow-hidden z-10">
            <img src="/images/levi-home.png" alt="Levi Ackerman" className="w-full h-full object-cover object-top scale-105" />
          </div>

          {/* Kaca pembesar */}
          <div className="absolute top-[37%] left-[0%] w-[11%] z-20 -rotate-12 drop-shadow-[0_8px_14px_rgba(0,0,0,0.75)]">
            <svg className="w-full h-auto" viewBox="0 0 64 64" fill="none">
              <circle cx="28" cy="26" r="14" fill="#17132c" stroke="white" strokeWidth="6.5" />
              <path d="M22 39L14 55" stroke="white" strokeWidth="7.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Naruto */}
          <div className="absolute top-[0%] right-[8%] w-[43%] aspect-[7/8] z-10 rotate-[8deg]">
            <div className="absolute -top-2 -right-3 w-[32%] h-[9%] bg-[#7c5dfa]/85 rotate-[35deg] z-30" />
            <div className="w-full h-full bg-[#38bdf8] border-[4px] sm:border-[6px] border-white shadow-[0_16px_35px_rgba(0,0,0,0.7)] overflow-hidden">
              <img src="/images/naruto-home.jpg" alt="Naruto Uzumaki" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* ??? */}
          <div className="absolute top-[14%] right-[-1%] z-30 rotate-[12deg] drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
            <div
              className="relative bg-[#f4f3f8] text-[#4b32b8] font-bold text-sm sm:text-xl px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl border-[2.5px] sm:border-[3px] border-[#6246ea]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              ???
              <span className="absolute top-1/2 -left-2 sm:-left-2.5 -translate-y-1/2 w-0 h-0 border-t-[5px] sm:border-t-[6px] border-t-transparent border-b-[5px] sm:border-b-[6px] border-b-transparent border-r-[8px] sm:border-r-[10px] border-r-[#6246ea]" />
            </div>
          </div>

          {/* Kakashi */}
          <div className="absolute bottom-[20%] right-[0%] w-[36%] aspect-[7/8] bg-[#4c6b53] border-[4px] sm:border-[6px] border-white shadow-[0_16px_35px_rgba(0,0,0,0.7)] -rotate-[11deg] overflow-hidden z-10">
            <img src="/images/kakashi-home.jpg" alt="Kakashi Hatake" className="w-full h-full object-cover object-top" />
          </div>

          <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#facc15] absolute top-[40%] right-[0%] z-30" />
          <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#facc15] absolute bottom-[10%] right-[12%] z-40" />

          {/* Luffy */}
          <img
            src="/images/luffy-home.png"
            alt="Monkey D. Luffy"
            className="absolute bottom-[-8%] sm:bottom-[-4%] left-[4%] w-[68%] sm:w-[70%] h-auto object-contain z-40 pointer-events-none"
            style={{ filter: 'drop-shadow(0px 0px 3px #ffffff) drop-shadow(0px 14px 24px rgba(0,0,0,0.75))' }}
          />
        </div>
      </main>

      {/* ================= KERTAS SOBEK ================= */}
      <div className="relative w-full z-20 pointer-events-none select-none shrink-0 mt-0 lg:-mt-4">
        <div className="absolute bottom-1 left-3 sm:left-6 z-40 -rotate-12 bg-[#dfd8fa] border-[3px] sm:border-[5px] border-[#f4f3f8] rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
          <DetectiveLogo className="w-7 h-7 sm:w-10 sm:h-10 text-[#5a3fd6]" />
        </div>

        <div
          className="absolute bottom-1.5 right-4 sm:right-14 z-40 -rotate-6 text-[#432ba8] text-base sm:text-[26px] font-bold leading-[0.9] text-center"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          <span>Ayo tebak</span>
          <br />
          <span>sekarang!</span>
          <svg className="w-12 sm:w-20 h-2.5 sm:h-3 mx-auto mt-0.5 text-[#5a3fd6]" viewBox="0 0 100 16" fill="none">
            <path d="M4 6C28 2 68 2 96 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 12C36 9 64 9 86 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <svg viewBox="0 0 1440 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20 lg:h-[11vh] lg:max-h-24 block" preserveAspectRatio="none">
          <defs>
            <filter id="torn-paper-edge" x="-5%" y="-25%" width="110%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="4" seed="9" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <pattern id="notebook-grid" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#d6d1eb" strokeWidth="1" />
            </pattern>
          </defs>
          <path d="M-20 42 C 140 39, 290 59, 460 51 C 600 45, 720 62, 840 69 L 840 120 L -20 120 Z" fill="#6644eb" filter="url(#torn-paper-edge)" />
          <path d="M-20 78 C 180 74, 360 82, 560 70 C 780 56, 1040 38, 1460 10 L 1460 120 L -20 120 Z" fill="#efedf7" filter="url(#torn-paper-edge)" />
          <path d="M-20 78 C 180 74, 360 82, 560 70 C 780 56, 1040 38, 1460 10 L 1460 120 L -20 120 Z" fill="url(#notebook-grid)" filter="url(#torn-paper-edge)" />
        </svg>
      </div>

      {/* ================= POP-UP NOTIFIKASI VALIDASI / ERROR ================= */}
      {popupNotice && (
        <div
          onClick={closeNotice}
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] bg-[#070612]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#181430] border-2 border-[#6246ea] rounded-3xl max-w-sm w-full p-6 shadow-[0_24px_65px_rgba(98,70,234,0.35)] text-center space-y-4 relative"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#facc15]/15 border border-[#facc15]/40 flex items-center justify-center text-[#facc15]">
              <WarningIcon className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {popupNotice.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {popupNotice.message}
              </p>
            </div>

            <button
              onClick={closeNotice}
              autoFocus
              className="w-full bg-[#6246ea] hover:bg-[#5338d8] active:scale-[0.98] text-white font-bold text-sm py-3 rounded-full shadow-[0_6px_20px_rgba(98,70,234,0.45)] transition cursor-pointer"
            >
              Oke, Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL CARA MAIN & TENTANG ================= */}
      {activeModal && (
        <div
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#070612]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#16132b] border-2 border-[#383066] rounded-3xl max-w-lg w-full max-h-[90svh] overflow-y-auto p-5 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative text-white"
          >
            <button
              onClick={() => setActiveModal(null)}
              aria-label="Tutup Modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#252042] hover:bg-[#6246ea] text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            {activeModal === 'cara-main' ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pr-10">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#6246ea]/20 border border-[#6246ea] flex items-center justify-center text-[#9d7cff]">
                    <QuestionCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Cara Bermain</h2>
                    <p className="text-xs text-[#9d7cff]">Panduan singkat menebak karakter anime bersama teman</p>
                  </div>
                </div>

                <ol className="space-y-3 text-sm text-gray-200">
                  {[
                    ['Buat atau Gabung Room', <>Masukkan nickname kamu, lalu klik <b>Buat Room</b> untuk memilih tema anime (Attack on Titan, Naruto, atau Campur), jumlah ronde, dan tingkat kesulitan.</>],
                    ['Tebak Karakter dari Petunjuk', 'Di setiap ronde, sistem mengacak karakter rahasia. Perhatikan petunjuk yang muncul dan ketik jawaban nama karakter secepat mungkin!'],
                    ['Kumpulkan Poin Tertinggi', 'Pemain yang berhasil menebak karakter paling cepat mendapatkan poin tertinggi hingga seluruh ronde selesai.'],
                  ].map(([title, body], i) => (
                    <li key={title} className="flex gap-3 bg-[#1e1a38] p-3.5 rounded-2xl border border-[#2f2857]">
                      <span className="w-6 h-6 rounded-full bg-[#6246ea] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <strong className="text-white block">{title}</strong>
                        {body}
                      </div>
                    </li>
                  ))}
                </ol>

                <button onClick={() => setActiveModal(null)} className="w-full bg-[#6246ea] hover:bg-[#5338d8] text-white font-bold text-sm py-3 rounded-full shadow-[0_6px_20px_rgba(98,70,234,0.45)] transition cursor-pointer">
                  Mengerti, Ayo Main!
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pr-10">
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#6246ea]/20 border border-[#6246ea] flex items-center justify-center text-[#9d7cff]">
                    <DetectiveLogo className="w-6 h-6" />
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-white">Tebak Karakter</strong> adalah game tebak-tebakan karakter anime multiplayer berbasis web (2–8 pemain) yang dimainkan secara <em>real-time</em>. Pilih semesta anime favoritmu dan uji pengetahuanmu bersama teman!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#1e1a38] p-3.5 rounded-2xl border border-[#2f2857]">
                    <span className="text-[#facc15] font-bold block mb-1">⚡ 2–8 Pemain Real-Time</span>
                    <span className="text-gray-300">Main bareng cukup dengan membagikan kode room atau link.</span>
                  </div>
                  <div className="bg-[#1e1a38] p-3.5 rounded-2xl border border-[#2f2857]">
                    <span className="text-[#9d7cff] font-bold block mb-1">🎌 Multi-Tema & Filter Spoiler</span>
                    <span className="text-gray-300">Tersedia tema AOT, Naruto, serta opsi sembunyikan spoiler.</span>
                  </div>
                </div>

                <button onClick={() => setActiveModal(null)} className="w-full bg-[#f4f3f8] hover:bg-white text-[#151226] font-bold text-sm py-3 rounded-full transition cursor-pointer">
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= ICONS ================= */

function WarningIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}
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
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" /></svg>);
}
function HomeIcon({ className }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" /></svg>);
}
function QuestionCircleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
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
function GamepadIcon({ className }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 9a5 5 0 0 0-4.9 6l.8 4A3 3 0 0 0 4.8 21a3 3 0 0 0 2.4-1.2L9 17.5h6l1.8 2.3a3 3 0 0 0 2.4 1.2 3 3 0 0 0 2.9-2l.8-4A5 5 0 0 0 18 9H6zm2 2h2v2h2v2h-2v2H8v-2H6v-2h2v-2zm8.5 1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-2 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" /></svg>);
}
function UserIcon({ className }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5z" /></svg>);
}
function DiamondIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 12l10 10 10-10L12 2z" />
      <path d="M12 6l-6 6 6 6 6-6-6-6z" />
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
function BookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export default HomePage;