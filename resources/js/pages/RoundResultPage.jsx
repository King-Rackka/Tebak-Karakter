import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Crown,
  Sparkles,
  Award,
} from 'lucide-react';
import { CardBackEmblem } from '../components/ThemePattern';
import { getCharacterImageUrl } from '../utils/characterImage';

function ResultCharacterAvatar({ id, name, anime, image }) {
  const [imgSrc, setImgSrc] = useState(image || '');
  const [loadingImg, setLoadingImg] = useState(!image);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let active = true;
    setImgError(false);

    if (image) {
      setImgSrc(image);
      setLoadingImg(false);
      return;
    }

    if (!name) {
      setImgSrc('');
      setLoadingImg(false);
      return;
    }

    setLoadingImg(true);
    getCharacterImageUrl({ id, name, anime, image }).then((url) => {
      if (!active) return;
      setImgSrc(url || '');
      setLoadingImg(false);
    });

    return () => {
      active = false;
    };
  }, [id, name, anime, image]);

  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="rr-avatar-frame">
      {imgSrc && !imgError ? (
        <img
          src={imgSrc}
          alt={name || 'Karakter'}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="rr-avatar-img"
        />
      ) : (
        <div className={`rr-avatar-fallback ${loadingImg ? 'rr-pulse' : ''}`}>
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
}

const RESULT_STYLES = `
.rr-page, .rr-page * { box-sizing: border-box; }
.rr-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--rr-ink);
  padding: clamp(16px, 3vw, 36px) clamp(12px, 2.5vw, 28px);
  background: var(--rr-shade);
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
}
.rr-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: linear-gradient(180deg, rgba(12,12,16,.46), rgba(12,12,16,.84) 55%, rgba(12,12,16,.74)), var(--rr-image);
  background-size: cover;
  background-position: center;
}
.rr-Naruto::before {
  background-image: linear-gradient(180deg, rgba(28,16,8,.34), rgba(26,15,8,.78) 55%, rgba(24,14,8,.68)), var(--rr-image);
}

.rr-shell {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rr-header {
  position: relative;
  padding: 20px 24px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--rr-panel) 90%, transparent);
  backdrop-filter: blur(14px);
  border: 1.5px solid color-mix(in srgb, var(--rr-border) 75%, transparent);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  overflow: hidden;
}
.rr-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--rr-accent), transparent);
}
.rr-theme-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--rr-accent);
  background: color-mix(in srgb, var(--rr-accent) 16%, rgba(0, 0, 0, 0.35));
  border: 1px solid color-mix(in srgb, var(--rr-accent) 45%, transparent);
}
.rr-title {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  color: #ffffff;
  text-shadow: 0 3px 14px rgba(0, 0, 0, 0.5);
}
.rr-progress-wrap {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}
.rr-progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.85;
}
.rr-progress-label b { color: var(--rr-accent); }
.rr-progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}
.rr-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--rr-accent);
  transition: width 0.4s ease;
}

.rr-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.rr-card {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 16px 18px;
  background: linear-gradient(155deg, color-mix(in srgb, var(--rr-panel) 94%, transparent), color-mix(in srgb, var(--rr-shade) 96%, transparent));
  backdrop-filter: blur(12px);
  border: 1.5px solid color-mix(in srgb, var(--rr-border) 70%, transparent);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.rr-card:hover { transform: translateY(-2px); }
.rr-card-self {
  border: 2px solid var(--rr-accent);
  box-shadow: 0 0 26px color-mix(in srgb, var(--rr-accent) 30%, transparent);
}
.rr-card-top1 {
  background: linear-gradient(155deg, color-mix(in srgb, var(--rr-accent) 16%, var(--rr-panel)), color-mix(in srgb, var(--rr-shade) 96%, transparent));
}
.rr-emblem {
  position: absolute;
  right: -6px;
  bottom: -6px;
  opacity: 0.14;
  pointer-events: none;
}

.rr-avatar-wrap {
  position: relative;
  flex-shrink: 0;
  z-index: 1;
}
.rr-rank-pill {
  position: absolute;
  top: -6px;
  left: -6px;
  z-index: 2;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 999px;
  background: #141222;
  border: 1.5px solid var(--rr-accent);
  color: var(--rr-accent);
  font-family: 'Fredoka', sans-serif;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
.rr-rank-1 {
  background: linear-gradient(135deg, #fde047, #f59e0b);
  color: #261608;
  border-color: #fef08a;
}
.rr-avatar-frame {
  width: 84px;
  height: 84px;
  border-radius: 18px;
  padding: 3px;
  background: linear-gradient(135deg, var(--rr-accent), rgba(255, 255, 255, 0.25));
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
.rr-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  border-radius: 15px;
  display: block;
  background: #141222;
}
.rr-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--rr-accent);
}

.rr-info {
  position: relative;
  z-index: 1;
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rr-player-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  opacity: 0.85;
}
.rr-player-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rr-self-tag {
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--rr-accent) 22%, transparent);
  color: var(--rr-accent);
  flex-shrink: 0;
}
.rr-char-name {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
  overflow-wrap: anywhere;
}
.rr-status-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.rr-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
}
.rr-badge-correct {
  background: rgba(20, 83, 45, 0.72);
  border: 1px solid rgba(74, 222, 128, 0.4);
  color: #bbf7d0;
}
.rr-badge-timeout {
  background: rgba(120, 53, 15, 0.72);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde68a;
}
.rr-badge-failed {
  background: rgba(127, 29, 29, 0.65);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #fecaca;
}

.rr-scores {
  position: relative;
  z-index: 1;
  text-align: right;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding-left: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
.rr-round-pts {
  font-family: 'Fredoka', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--rr-accent);
  line-height: 1.1;
}
.rr-round-pts.is-zero {
  opacity: 0.45;
  color: var(--rr-ink);
}
.rr-total-pts {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.85;
}
.rr-total-pts b {
  font-family: 'Fredoka', sans-serif;
  font-size: 14px;
  color: #ffffff;
}

.rr-footer {
  margin-top: 2px;
}
.rr-btn-next {
  width: 100%;
  min-height: 54px;
  padding: 14px 24px;
  border-radius: 16px;
  border: 1.5px solid color-mix(in srgb, var(--rr-accent) 60%, transparent);
  background: var(--rr-button);
  color: #ffffff;
  font-family: 'Fredoka', sans-serif;
  font-size: 18px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
  transition: all 0.18s ease;
}
.rr-Naruto .rr-btn-next {
  background: linear-gradient(135deg, #ffbd49, #f59e0b);
  color: #261608;
  border-color: #fde68a;
}
.rr-btn-next:not(:disabled):hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
}
.rr-btn-next:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.rr-waiting {
  width: 100%;
  padding: 15px 20px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--rr-panel) 88%, transparent);
  backdrop-filter: blur(12px);
  border: 1.5px solid color-mix(in srgb, var(--rr-border) 65%, transparent);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--rr-ink);
  opacity: 0.9;
}

@keyframes rrPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
.rr-pulse { animation: rrPulse 1.4s ease-in-out infinite; }

@media (max-width: 767px) {
  .rr-list {
    grid-template-columns: minmax(0, 1fr);
    gap: 11px;
  }
  .rr-header {
    padding: 16px 16px;
    border-radius: 18px;
  }
  .rr-card {
    padding: 13px 14px;
    gap: 12px;
    border-radius: 16px;
  }
  .rr-avatar-frame {
    width: 72px;
    height: 72px;
    border-radius: 15px;
  }
  .rr-avatar-img, .rr-avatar-fallback {
    border-radius: 12px;
  }
  .rr-round-pts {
    font-size: 16px;
  }
  .rr-btn-next {
    min-height: 48px;
    font-size: 16px;
  }
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
    background: null,
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
  '--rr-accent': theme.accent,
  '--rr-border': theme.border,
  '--rr-panel': theme.panel,
  '--rr-button': theme.button,
  '--rr-ink': theme.ink,
  '--rr-shade': theme.shade,
});

export function RoundResultPage({ room, onNextRound, loading }) {
  const isLastRound = room.currentRound >= room.settings.rounds;
  const results = room.roundResults || [];
  const selfPlayer = room.players?.find((p) => p.isSelf);

  const themes = room.settings?.themes ?? [];
  const themeKey = themes.length === 1 ? normalize(themes[0]) : 'mix';
  const theme = THEMES[themeKey];

  const totalRounds = Math.max(1, room.settings?.rounds || 1);
  const progressPercent = Math.min(
    100,
    Math.round(((room.currentRound || 1) / totalRounds) * 100)
  );

  const sortedResults = [...results].sort((a, b) => {
    if ((b.totalScore ?? 0) !== (a.totalScore ?? 0)) {
      return (b.totalScore ?? 0) - (a.totalScore ?? 0);
    }
    return (b.roundScore ?? 0) - (a.roundScore ?? 0);
  });

  const renderStatus = (status, attemptsUsed) => {
    if (status === 'correct') {
      return (
        <span className="rr-badge rr-badge-correct">
          <CheckCircle2 size={13} />
          Benar ke-{(attemptsUsed ?? 0) + 1}
        </span>
      );
    }
    if (status === 'timeout') {
      return (
        <span className="rr-badge rr-badge-timeout">
          <Clock size={13} />
          Waktu Habis
        </span>
      );
    }
    return (
      <span className="rr-badge rr-badge-failed">
        <XCircle size={13} />
        Gagal
      </span>
    );
  };

  return (
    <div
      className={`rr-page rr-${themeKey}`}
      style={{
        ...palette(theme),
        '--rr-image': theme.background ? `url("${theme.background}")` : 'none',
      }}
    >
      <style>{RESULT_STYLES}</style>
      <main className="rr-shell">
        <header className="rr-header">
          <span className="rr-theme-badge">
            <Sparkles size={12} />
            {theme.title} · Ronde {room.currentRound} Selesai
          </span>
          <h1 className="rr-title">Hasil Ronde {room.currentRound}</h1>

          <div className="rr-progress-wrap">
            <div className="rr-progress-label">
              <span>Progres Permainan</span>
              <b>
                {room.currentRound} / {room.settings.rounds} Ronde
              </b>
            </div>
            <div className="rr-progress-track" aria-hidden="true">
              <div
                className="rr-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        <section className="rr-list" aria-label="Daftar hasil ronde pemain">
          {sortedResults.map((row, idx) => {
            const isSelf =
              row.isSelf || (selfPlayer && row.playerId === selfPlayer.id);
            const cardTheme =
              themeKey === 'mix' ? THEMES[normalize(row.characterAnime)] : theme;
            const rank = idx + 1;

            return (
              <article
                key={row.playerId}
                style={palette(cardTheme)}
                className={`rr-card ${isSelf ? 'rr-card-self' : ''} ${
                  rank === 1 ? 'rr-card-top1' : ''
                }`}
              >
                <div className="rr-emblem" aria-hidden="true">
                  <CardBackEmblem
                    anime={
                      themeKey === 'mix' ? row.characterAnime : themeKey
                    }
                  />
                </div>

                <div className="rr-avatar-wrap">
                  <span
                    className={`rr-rank-pill ${rank === 1 ? 'rr-rank-1' : ''}`}
                    title={`Peringkat #${rank}`}
                  >
                    {rank === 1 ? <Crown size={13} /> : `#${rank}`}
                  </span>
                  <ResultCharacterAvatar
                    id={row.characterId}
                    name={row.characterName}
                    anime={row.characterAnime}
                    image={row.characterImage}
                  />
                </div>

                <div className="rr-info">
                  <div className="rr-player-row">
                    <span>{row.playerName}</span>
                    {isSelf && <span className="rr-self-tag">Kamu</span>}
                  </div>
                  <strong className="rr-char-name">
                    {row.characterName || '—'}
                  </strong>
                  <div className="rr-status-row">
                    {renderStatus(row.status, row.attemptsUsed)}
                  </div>
                </div>

                <div className="rr-scores">
                  <span
                    className={`rr-round-pts ${
                      (row.roundScore ?? 0) === 0 ? 'is-zero' : ''
                    }`}
                  >
                    +{row.roundScore ?? 0}
                  </span>
                  <span className="rr-total-pts">
                    Total <b>{row.totalScore ?? 0}</b>
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="rr-footer">
          {room.isHost ? (
            <button
              type="button"
              onClick={onNextRound}
              disabled={loading}
              className="rr-btn-next"
            >
              {isLastRound ? (
                <>
                  <Trophy size={20} />
                  <span>
                    {loading ? 'Memuat...' : 'Lihat Papan Skor Akhir'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {loading
                      ? 'Memulai Ronde...'
                      : `Lanjut ke Ronde ${room.currentRound + 1}`}
                  </span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          ) : (
            <div className="rr-waiting">
              <Award
                size={16}
                style={{
                  display: 'inline',
                  marginRight: 6,
                  verticalAlign: 'text-bottom',
                  color: 'var(--rr-accent)',
                }}
              />
              Menunggu host melanjutkan ke{' '}
              {isLastRound ? 'papan skor akhir' : 'ronde berikutnya'}...
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}