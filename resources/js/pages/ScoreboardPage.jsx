import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  RotateCcw,
  LogOut,
  Medal,
  Trophy,
  Sparkles,
  Award,
} from 'lucide-react';
import { CardBackEmblem } from '../components/ThemePattern';

const SCOREBOARD_STYLES = `
.sb-page, .sb-page * { box-sizing: border-box; }
.sb-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--sb-ink);
  padding: clamp(18px, 3vw, 38px) clamp(12px, 2.5vw, 28px);
  background: var(--sb-shade);
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
}
.sb-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: linear-gradient(180deg, rgba(12,12,16,.44), rgba(12,12,16,.84) 55%, rgba(12,12,16,.74)), var(--sb-image);
  background-size: cover;
  background-position: center;
}
.sb-Naruto::before {
  background-image: linear-gradient(180deg, rgba(28,16,8,.32), rgba(26,15,8,.78) 55%, rgba(24,14,8,.68)), var(--sb-image);
}

.sb-shell {
  width: 100%;
  max-width: 940px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ================= HEADER PAPAN SKOR ================= */
.sb-header {
  position: relative;
  padding: 22px 24px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--sb-panel) 90%, transparent);
  backdrop-filter: blur(14px);
  border: 1.5px solid color-mix(in srgb, var(--sb-border) 75%, transparent);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  overflow: hidden;
}
.sb-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--sb-accent), transparent);
}
.sb-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sb-accent);
  background: color-mix(in srgb, var(--sb-accent) 16%, rgba(0, 0, 0, 0.35));
  border: 1px solid color-mix(in srgb, var(--sb-accent) 45%, transparent);
}
.sb-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(28px, 4.5vw, 44px);
  font-weight: 700;
  line-height: 1.08;
  margin: 2px 0 0;
  color: #ffffff;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.55);
}
.sb-subtitle {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  opacity: 0.82;
}

/* ================= PODIUM 1 - 2 - 3 ================= */
.sb-podium-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 2vw, 18px);
  align-items: end;
  padding-top: 8px;
}
.sb-podium-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.sb-podium-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  width: 100%;
}
.sb-crown {
  color: #facc15;
  filter: drop-shadow(0 4px 12px rgba(250, 204, 21, 0.55));
  animation: sbFloat 2.2s ease-in-out infinite;
}
.sb-avatar {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 20px;
  font-weight: 700;
  background: color-mix(in srgb, var(--sb-panel) 95%, #000);
  border: 2px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}
.sb-avatar-1 {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  font-size: 25px;
  border: 2.5px solid #facc15;
  background: linear-gradient(145deg, rgba(250, 204, 21, 0.28), color-mix(in srgb, var(--sb-panel) 95%, #000));
  color: #fef08a;
  box-shadow: 0 0 28px rgba(250, 204, 21, 0.35);
}
.sb-avatar-2 {
  border-color: #cbd5e1;
  color: #f1f5f9;
}
.sb-avatar-3 {
  border-color: #fb923c;
  color: #ffedd5;
}
.sb-podium-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 700;
  color: #ffffff;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}
.sb-podium-name-1 {
  font-size: clamp(16px, 2.3vw, 21px);
  color: #fde047;
}
.sb-self-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: color-mix(in srgb, var(--sb-accent) 24%, rgba(0, 0, 0, 0.45));
  border: 1px solid color-mix(in srgb, var(--sb-accent) 55%, transparent);
  color: var(--sb-accent);
}

/* Tiang Podium */
.sb-pedestal {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 20px 20px 14px 14px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.45);
}
.sb-pedestal-emblem {
  position: absolute;
  right: -8px;
  bottom: -8px;
  opacity: 0.14;
  pointer-events: none;
}
.sb-pedestal-1 {
  min-height: 176px;
  background: linear-gradient(165deg, rgba(245, 158, 11, 0.30), color-mix(in srgb, var(--sb-panel) 94%, transparent));
  border: 2px solid rgba(250, 204, 21, 0.72);
  box-shadow: 0 0 36px rgba(245, 158, 11, 0.25);
}
.sb-pedestal-2 {
  min-height: 138px;
  background: linear-gradient(165deg, rgba(148, 163, 184, 0.22), color-mix(in srgb, var(--sb-panel) 94%, transparent));
  border: 1.5px solid rgba(203, 213, 225, 0.48);
}
.sb-pedestal-3 {
  min-height: 112px;
  background: linear-gradient(165deg, rgba(234, 88, 12, 0.22), color-mix(in srgb, var(--sb-panel) 94%, transparent));
  border: 1.5px solid rgba(251, 146, 60, 0.45);
}
.sb-rank-num {
  position: relative;
  z-index: 1;
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  line-height: 1;
}
.sb-rank-1 { font-size: clamp(32px, 4.5vw, 44px); color: #fde047; }
.sb-rank-2 { font-size: clamp(24px, 3.5vw, 32px); color: #e2e8f0; }
.sb-rank-3 { font-size: clamp(22px, 3vw, 28px); color: #fdba74; }
.sb-pedestal-pts {
  position: relative;
  z-index: 1;
  font-size: clamp(12.5px, 1.8vw, 15px);
  font-weight: 800;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.34);
  padding: 3px 10px;
  border-radius: 999px;
}

/* ================= DAFTAR PERINGKAT 4 - 8 ================= */
.sb-list-box {
  border-radius: 20px;
  padding: 16px 18px;
  background: color-mix(in srgb, var(--sb-panel) 90%, transparent);
  backdrop-filter: blur(12px);
  border: 1.5px solid color-mix(in srgb, var(--sb-border) 70%, transparent);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sb-list-head {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sb-accent);
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.sb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.sb-row-self {
  border-color: var(--sb-accent);
  background: color-mix(in srgb, var(--sb-accent) 14%, rgba(0, 0, 0, 0.34));
}
.sb-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.sb-row-rank {
  font-family: 'Fredoka', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--sb-accent);
  min-width: 30px;
}
.sb-row-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sb-row-pts {
  font-family: 'Fredoka', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--sb-accent);
  flex-shrink: 0;
}

/* ================= TOMBOL AKSI BAWAH ================= */
.sb-actions {
  display: flex;
  gap: 12px;
}
.sb-btn-primary {
  flex: 1;
  min-height: 52px;
  padding: 13px 22px;
  border-radius: 16px;
  border: 1.5px solid color-mix(in srgb, var(--sb-accent) 60%, transparent);
  background: var(--sb-button);
  color: #ffffff;
  font-family: 'Fredoka', sans-serif;
  font-size: 17px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
  transition: all 0.18s ease;
}
.sb-Naruto .sb-btn-primary {
  background: linear-gradient(135deg, #ffbd49, #f59e0b);
  color: #261608;
  border-color: #fde68a;
}
.sb-btn-primary:not(:disabled):hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}
.sb-btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.sb-waiting-box {
  flex: 1;
  min-height: 52px;
  padding: 13px 18px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--sb-panel) 88%, transparent);
  backdrop-filter: blur(12px);
  border: 1.5px solid color-mix(in srgb, var(--sb-border) 65%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--sb-ink);
}
.sb-btn-leave {
  min-height: 52px;
  padding: 13px 22px;
  border-radius: 16px;
  border: 1.5px solid rgba(248, 113, 113, 0.42);
  background: rgba(239, 68, 68, 0.14);
  color: #fecaca;
  font-family: 'Fredoka', sans-serif;
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.sb-btn-leave:hover {
  background: rgba(239, 68, 68, 0.26);
  border-color: rgba(248, 113, 113, 0.68);
  color: #ffffff;
  transform: translateY(-2px);
}

@keyframes sbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* ================= RESPONSIVE MOBILE ================= */
@media (max-width: 639px) {
  .sb-header { padding: 18px 14px; border-radius: 18px; }
  .sb-avatar { width: 46px; height: 46px; border-radius: 14px; font-size: 16px; }
  .sb-avatar-1 { width: 58px; height: 58px; border-radius: 18px; font-size: 20px; }
  .sb-pedestal { border-radius: 16px 16px 12px 12px; padding: 10px 6px; }
  .sb-pedestal-1 { min-height: 144px; }
  .sb-pedestal-2 { min-height: 112px; }
  .sb-pedestal-3 { min-height: 92px; }
  .sb-actions { flex-direction: column; }
  .sb-btn-primary, .sb-btn-leave, .sb-waiting-box { min-height: 48px; width: 100%; }
}
`;

const THEMES = {
  AOT: {
    title: 'Attack on Titan',
    background: '/images/lobby-game/bg-aot.png',
    accent: '#e2c28d',
    border: '#b49b77',
    panel: '#22221f',
    button: '#8b3a32',
    ink: '#f5ead9',
    shade: '#141513',
  },
  Naruto: {
    title: 'Naruto',
    background: '/images/lobby-game/bg-naruto.png',
    accent: '#ffbd49',
    border: '#d99b52',
    panel: '#2b221d',
    button: '#c45d12',
    ink: '#fff3df',
    shade: '#1c1410',
  },
  mix: {
    title: 'Campur Semua',
    background: '/images/lobby-game/bg-mix.png',
    accent: '#9d7cff',
    border: '#5e4ea3',
    panel: '#18142e',
    button: '#6246ea',
    ink: '#f4efff',
    shade: '#0c0a18',
  },
};

const normalize = (value) => {
  const key = String(value ?? '').toLowerCase().replace(/[^a-z]/g, '');
  return key === 'aot' || key === 'attackontitan'
    ? 'AOT'
    : key === 'naruto'
    ? 'Naruto'
    : 'mix';
};

const palette = (theme) => ({
  '--sb-accent': theme.accent,
  '--sb-border': theme.border,
  '--sb-panel': theme.panel,
  '--sb-button': theme.button,
  '--sb-ink': theme.ink,
  '--sb-shade': theme.shade,
});

const getInitials = (name) =>
  String(name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export function ScoreboardPage({ room, onPlayAgain, onLeave, loading }) {
  const sorted = [...(room.players || [])].sort((a, b) => b.score - a.score);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const rest = sorted.slice(3);

  const themes = room.settings?.themes ?? [];
  const themeKey = themes.length === 1 ? normalize(themes[0]) : 'mix';
  const theme = THEMES[themeKey];

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 85,
      origin: { y: 0.55 },
    });
  }, []);

  const renderPodiumSlot = (player, rank) => {
    if (!player) return <div className="sb-podium-col" />;

    return (
      <div className="sb-podium-col">
        <div className="sb-podium-player">
          {rank === 1 && <Crown size={28} className="sb-crown" />}
          <div className={`sb-avatar sb-avatar-${rank}`}>
            {getInitials(player.name)}
          </div>
          <div
            className={`sb-podium-name ${rank === 1 ? 'sb-podium-name-1' : ''}`}
            title={player.name}
          >
            {player.name}
          </div>
          {player.isSelf && <span className="sb-self-pill">Kamu</span>}
        </div>

        <div className={`sb-pedestal sb-pedestal-${rank}`}>
          <div className="sb-pedestal-emblem" aria-hidden="true">
            <CardBackEmblem anime={themeKey === 'mix' ? undefined : themeKey} />
          </div>
          <span className={`sb-rank-num sb-rank-${rank}`}>#{rank}</span>
          <span className="sb-pedestal-pts">{player.score} pts</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`sb-page sb-${themeKey}`}
      style={{
        ...palette(theme),
        '--sb-image': theme.background ? `url("${theme.background}")` : 'none',
      }}
    >
      <style>{SCOREBOARD_STYLES}</style>
      <main className="sb-shell">
        {/* ================= HEADER ================= */}
        <header className="sb-header">
          <span className="sb-badge">
            <Sparkles size={12} />
            {theme.title} · Permainan Selesai
          </span>
          <h1 className="sb-title">Papan Skor Akhir</h1>
          <p className="sb-subtitle">
            {room.settings?.rounds || 1} Ronde Selesai · {sorted.length} Pemain
          </p>
        </header>

        {/* ================= PODIUM 2 - 1 - 3 ================= */}
        <section className="sb-podium-grid" aria-label="Podium 3 Besar">
          {renderPodiumSlot(top2, 2)}
          {renderPodiumSlot(top1, 1)}
          {renderPodiumSlot(top3, 3)}
        </section>

        {/* ================= DAFTAR PERINGKAT 4 - 8 ================= */}
        {rest.length > 0 && (
          <section className="sb-list-box" aria-label="Peringkat Lainnya">
            <div className="sb-list-head">
              <Medal size={15} />
              <span>Peringkat Lainnya</span>
            </div>
            {rest.map((p, idx) => (
              <div
                key={p.id}
                className={`sb-row ${p.isSelf ? 'sb-row-self' : ''}`}
              >
                <div className="sb-row-left">
                  <span className="sb-row-rank">#{idx + 4}</span>
                  <span className="sb-row-name">{p.name}</span>
                  {p.isSelf && <span className="sb-self-pill">Kamu</span>}
                </div>
                <span className="sb-row-pts">{p.score} pts</span>
              </div>
            ))}
          </section>
        )}

        {/* ================= AKSI ================= */}
        <footer className="sb-actions">
          {room.isHost ? (
            <button
              type="button"
              onClick={onPlayAgain}
              disabled={loading}
              className="sb-btn-primary"
            >
              <RotateCcw size={19} />
              <span>
                {loading ? 'Kembali ke Lobby...' : 'Main Lagi (Kembali ke Lobby)'}
              </span>
            </button>
          ) : (
            <div className="sb-waiting-box">
              <Award size={17} style={{ color: 'var(--sb-accent)' }} />
              <span>Menunggu host menekan Main Lagi...</span>
            </div>
          )}

          <button type="button" onClick={onLeave} className="sb-btn-leave">
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
