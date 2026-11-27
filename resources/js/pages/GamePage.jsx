import React, { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Infinity as InfinityIcon,
  Send,
  Heart,
  CheckCircle2,
  XCircle,
  Flag,
  LogOut,
  MessageSquareText,
  Crown,
  Sparkles,
  Trophy,
  ShieldAlert,
  ArrowRightCircle,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { GameLoadingScreen } from '../components/GameLoadingScreen';
import { CardBackEmblem } from '../components/ThemePattern';
import { getCharacterImageUrl } from '../utils/characterImage';

function CharacterPortrait({ character }) {
  const [imgSrc, setImgSrc] = useState(character?.image || '');
  const [loadingImg, setLoadingImg] = useState(!character?.image);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let active = true;
    setImgError(false);

    if (character?.image) {
      setImgSrc(character.image);
      setLoadingImg(false);
      return;
    }

    if (!character?.name) {
      setImgSrc('');
      setLoadingImg(false);
      return;
    }

    setLoadingImg(true);
    getCharacterImageUrl(character).then((url) => {
      if (!active) return;
      setImgSrc(url || '');
      setLoadingImg(false);
    });

    return () => {
      active = false;
    };
  }, [character?.id, character?.name, character?.anime, character?.image]);

  const initials = (character?.name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="gp-portrait-frame">
      {imgSrc && !imgError ? (
        <img
          src={imgSrc}
          alt={character?.name || 'Karakter'}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="gp-portrait-img"
        />
      ) : (
        <div className={`gp-portrait-fallback ${loadingImg ? 'gp-pulse' : ''}`}>
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
}

const GAME_STYLES = `
.gp-page, .gp-page * { box-sizing: border-box; }
.gp-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--gp-ink);
  padding: clamp(12px, 2vw, 28px);
  background: var(--gp-shade);
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
}
.gp-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: linear-gradient(180deg, rgba(12,12,16,.42), rgba(12,12,16,.80) 55%, rgba(12,12,16,.68)), var(--gp-image);
  background-size: cover;
  background-position: center;
}
.gp-Naruto::before {
  background-image: linear-gradient(180deg, rgba(28,16,8,.30), rgba(26,15,8,.74) 55%, rgba(24,14,8,.64)), var(--gp-image);
}

.gp-shell {
  max-width: 1440px;
  margin: auto;
  min-height: calc(100dvh - clamp(24px, 4vw, 56px));
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gp-panel, .gp-card {
  background: color-mix(in srgb, var(--gp-panel) 90%, transparent);
  backdrop-filter: blur(12px);
  border: 1.5px solid color-mix(in srgb, var(--gp-border) 75%, transparent);
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.42);
}

.gp-navbar {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  overflow: hidden;
}
.gp-navbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gp-accent), transparent);
  opacity: 0.85;
}

.gp-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}
.gp-brand-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--gp-accent) 18%, #00000055);
  border: 1.5px solid color-mix(in srgb, var(--gp-accent) 55%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gp-accent);
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}
.gp-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.gp-brand-text strong {
  font-family: 'Fredoka', sans-serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #ffffff;
}
.gp-theme-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 3px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gp-accent);
}

.gp-hud-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.gp-hud-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 13px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 13px;
  font-weight: 600;
}
.gp-round-chip {
  flex-direction: column;
  align-items: stretch;
  gap: 5px;
  min-width: 148px;
  padding: 7px 14px;
  border-color: color-mix(in srgb, var(--gp-accent) 45%, transparent);
}
.gp-round-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12.5px;
}
.gp-round-top b {
  font-family: 'Fredoka', sans-serif;
  color: var(--gp-accent);
  font-size: 13.5px;
}
.gp-progress-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}
.gp-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--gp-accent);
  transition: width 0.35s ease;
}
.gp-score-chip svg { color: #facc15; }
.gp-score-chip strong {
  font-family: 'Fredoka', sans-serif;
  font-size: 15px;
  color: #ffffff;
}
.gp-time-chip svg { color: var(--gp-accent); }
.gp-done-badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: color-mix(in srgb, var(--gp-accent) 22%, transparent);
  color: var(--gp-accent);
}

.gp-page button { font: inherit; cursor: pointer; transition: all 0.18s ease; }
.gp-page button:disabled { opacity: 0.45; cursor: not-allowed; }
.gp-leave-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 15px;
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.gp-leave-btn:not(:disabled):hover {
  background: rgba(239, 68, 68, 0.24);
  border-color: rgba(248, 113, 113, 0.6);
  color: #ffffff;
}
.gp-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  border-radius: 12px;
  padding: 10px 18px;
  border: 1px solid color-mix(in srgb, var(--gp-accent) 55%, transparent);
  color: #ffffff;
  background: var(--gp-button);
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
}
.gp-Naruto .gp-primary {
  background: linear-gradient(135deg, #ffbd49, #f59e0b);
  color: #261608;
  border-color: #fde68a;
}
.gp-next-turn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 46px;
  border-radius: 12px;
  padding: 10px 16px;
  border: 1.5px solid rgba(34, 211, 238, 0.55);
  background: rgba(8, 145, 178, 0.24);
  color: #cffafe;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}
.gp-next-turn-btn:not(:disabled):hover {
  background: rgba(6, 182, 212, 0.36);
  border-color: #22d3ee;
  color: #ffffff;
}
.gp-page button:not(:disabled):hover { filter: brightness(1.08); transform: translateY(-1px); }
.gp-page button:not(:disabled):active { transform: translateY(0); }
.gp-page :focus-visible { outline: 2px solid var(--gp-accent); outline-offset: 2px; }

.gp-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(280px, 1fr);
  gap: 16px;
  flex: 1;
}
.gp-play {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.gp-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  align-content: start;
}
.gp-card {
  min-width: 0;
  min-height: 290px;
  padding: 14px 16px 18px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(155deg, color-mix(in srgb, var(--gp-panel) 95%, transparent), color-mix(in srgb, var(--gp-shade) 96%, transparent));
  transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.gp-card:hover { transform: translateY(-2px); }
.gp-Naruto .gp-card { border-width: 2px; }
.gp-self {
  border-color: color-mix(in srgb, var(--gp-accent) 70%, transparent);
}

@keyframes gpTurnPulse {
  0%, 100% {
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.35), 0 12px 32px rgba(34, 211, 238, 0.28);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.55), 0 14px 38px rgba(34, 211, 238, 0.45);
  }
}
.gp-turn-active {
  border: 2.5px solid #22d3ee !important;
  background: linear-gradient(
    155deg,
    color-mix(in srgb, #0891b2 22%, var(--gp-panel)),
    color-mix(in srgb, var(--gp-shade) 95%, transparent)
  );
  animation: gpTurnPulse 2s ease-in-out infinite;
}
.gp-turn-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(34, 211, 238, 0.2);
  border: 1px solid rgba(34, 211, 238, 0.65);
  color: #67e8f9;
}

.gp-emblem {
  position: absolute;
  right: -4px;
  bottom: -4px;
  opacity: 0.16;
  pointer-events: none;
}
.gp-card-head, .gp-character { position: relative; z-index: 1; }

.gp-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.gp-player { min-width: 0; }
.gp-player strong {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 800;
}
.gp-player strong span { overflow-wrap: anywhere; }
.gp-player svg { color: #facc15; flex-shrink: 0; }
.gp-player small { opacity: 0.8; font-size: 11.5px; display: block; margin-top: 2px; }

.gp-head-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
}
.gp-hearts {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.gp-heart-full { color: #fb6685; fill: #fb6685; filter: drop-shadow(0 1px 4px rgba(251, 102, 133, 0.45)); }
.gp-heart-empty { color: rgba(255, 255, 255, 0.24); fill: rgba(255, 255, 255, 0.08); }

.gp-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.gp-character {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  padding: 8px 0;
  overflow-wrap: anywhere;
}
.gp-portrait-frame {
  width: 156px;
  height: 156px;
  border-radius: 22px;
  padding: 3.5px;
  background: linear-gradient(135deg, var(--gp-accent), rgba(255, 255, 255, 0.25));
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
  flex-shrink: 0;
}
.gp-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  border-radius: 18.5px;
  display: block;
  background: #141222;
}
.gp-portrait-fallback {
  width: 100%;
  height: 100%;
  border-radius: 18.5px;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: var(--gp-accent);
}
.gp-mystery-box {
  width: 156px;
  height: 156px;
  border-radius: 22px;
  border: 2px dashed var(--gp-accent);
  background: color-mix(in srgb, var(--gp-accent) 14%, rgba(0, 0, 0, 0.35));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 46px;
  font-weight: 700;
  color: var(--gp-accent);
  letter-spacing: 2px;
  box-shadow: inset 0 0 22px color-mix(in srgb, var(--gp-accent) 22%, transparent);
}
.gp-character strong {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(19px, 2vw, 24px);
  line-height: 1.15;
  letter-spacing: 0.01em;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
}
.gp-character small {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.88;
}

.gp-guess { padding: 16px 18px; }
.gp-guess-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 600;
  flex-wrap: wrap;
}
.gp-turn-status-text {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.gp-turn-status-text.is-my-turn {
  color: #67e8f9;
  font-weight: 700;
}
.gp-skip {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
  padding: 6px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
}
.gp-skip:not(:disabled):hover {
  background: rgba(239, 68, 68, 0.24);
  border-color: rgba(248, 113, 113, 0.6);
  color: #ffffff;
}
.gp-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.gp-form input {
  min-width: 200px;
  flex: 1;
  color: var(--gp-ink);
  background: rgba(0, 0, 0, 0.36);
  border: 1.5px solid color-mix(in srgb, var(--gp-border) 70%, transparent);
  border-radius: 12px;
  padding: 11px 15px;
  font: inherit;
  font-size: 15px;
}
.gp-form input::placeholder { color: var(--gp-ink); opacity: 0.5; }
.gp-form input:focus {
  outline: none;
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.22);
}
.gp-action-group {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.gp-error { color: #fca5a5; font-size: 13px; margin: 0 0 8px; font-weight: 600; }

.gp-log {
  min-width: 0;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  min-height: 360px;
}
.gp-log h3 {
  font-family: 'Fredoka', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  margin: 0 0 12px;
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  font-weight: 700;
}
.gp-log h3 svg { color: var(--gp-accent); }
.gp-log-scroll {
  flex: 1;
  min-height: 0;
  max-height: 62vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gp-empty {
  text-align: center;
  opacity: 0.72;
  padding: 40px 12px;
  font-size: 13.5px;
  line-height: 1.5;
}
.gp-empty svg { margin: 0 auto 10px; color: var(--gp-accent); }
.gp-log-item {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
  overflow-wrap: anywhere;
}
.gp-correct { color: #bbf7d0; background: rgba(20, 83, 45, 0.65); border-color: rgba(74, 222, 128, 0.35); }
.gp-failed { color: #fecaca; background: rgba(127, 29, 29, 0.55); border-color: rgba(248, 113, 113, 0.35); }

.gp-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(6, 6, 12, 0.76);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: gpFadeIn 0.16s ease-out;
}
.gp-modal {
  width: 100%;
  max-width: 420px;
  padding: 22px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--gp-panel) 96%, #0b0b12);
  border: 1.5px solid color-mix(in srgb, var(--gp-border) 85%, transparent);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gp-modal-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.gp-modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: rgba(239, 68, 68, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fca5a5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.gp-modal-head h4 {
  font-family: 'Fredoka', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}
.gp-modal-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.88;
}
.gp-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}
.gp-btn-cancel {
  min-height: 42px;
  padding: 9px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: var(--gp-ink);
  font-weight: 700;
  font-size: 13.5px;
}
.gp-btn-danger {
  min-height: 42px;
  padding: 9px 18px;
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.6);
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #ffffff;
  font-weight: 800;
  font-size: 13.5px;
}

@keyframes gpFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes gpPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
.gp-pulse { animation: gpPulse 1.4s ease-in-out infinite; }

@media (min-width: 1500px) {
  .gp-cards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (max-width: 1023px) {
  .gp-layout { grid-template-columns: minmax(0, 1fr); }
  .gp-log { min-height: 220px; }
  .gp-log-scroll { max-height: 260px; }
  .gp-play { justify-content: flex-start; }
}

@media (max-width: 767px) {
  .gp-navbar {
    grid-template-columns: 1fr auto;
    padding: 12px 14px;
    gap: 10px;
  }
  .gp-brand { grid-column: 1; grid-row: 1; }
  .gp-leave-btn { grid-column: 2; grid-row: 1; padding: 7px 12px; font-size: 12px; min-height: 36px; }
  .gp-hud-center {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: stretch;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 8px;
  }
  .gp-round-chip { grid-column: 1 / -1; min-width: 0; }
  .gp-hud-chip { justify-content: center; font-size: 12px; padding: 6px 10px; }
}

@media (max-width: 639px) {
  .gp-page { padding: 10px; }
  .gp-shell { gap: 12px; }
  .gp-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .gp-card { padding: 11px 11px 14px; min-height: 230px; border-radius: 14px; }
  .gp-card-head { flex-wrap: wrap; gap: 4px; }
  .gp-portrait-frame, .gp-mystery-box { width: 114px; height: 114px; border-radius: 16px; }
  .gp-portrait-img, .gp-portrait-fallback { border-radius: 13px; }
  .gp-mystery-box { font-size: 36px; }
  .gp-guess, .gp-log { padding: 13px; border-radius: 15px; }
  .gp-guess-head { flex-wrap: wrap; font-size: 12.5px; }
  .gp-form { flex-direction: column; gap: 8px; }
  .gp-form input { min-width: 0; width: 100%; }
  .gp-action-group { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
  .gp-primary, .gp-next-turn-btn { padding: 9px 12px; min-height: 42px; font-size: 13px; width: 100%; }
  .gp-page::before { background-position: 60% center; }
}
`;

const THEMES = {
  AOT: {
    title: 'Attack on Titan',
    badge: 'Survey Corps Mode',
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
    badge: 'Shinobi Village Mode',
    background: '/images/lobby-game/bg-naruto.png',
    accent: '#ffbd49',
    border: '#d99b52',
    panel: '#2b221d',
    button: '#c45d12',
    ink: '#fff3df',
    shade: '#1c1410',
  },
  jujutsukaisen: {
    title: 'Jujutsu Kaisen',
    badge: 'Cursed Energy Mode',
    background: '/images/lobby-game/bg-jujutsu.png',
    accent: '#60a5fa',
    border: '#365b91',
    panel: '#151e32',
    button: '#2563eb',
    ink: '#eaf4ff',
    shade: '#0a101d',
  },
  onepiece: {
    title: 'One Piece',
    badge: 'Grand Line Mode',
    background: '/images/lobby-game/bg-onepiece.png',
    accent: '#f5c76b',
    border: '#967447',
    panel: '#142c42',
    button: '#b98532',
    ink: '#fff3d9',
    shade: '#091c2c',
  },
  mix: {
    title: 'Campur Semua',
    badge: 'Crossover Party Mode',
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
    : key === 'jujutsukaisen' || key === 'jujutsukaisen'
    ? 'jujutsukaisen'
    : key === 'onepiece' || key === 'onepiece'
    ? 'onepiece'
    : 'mix';
};

const palette = (theme) => ({
  '--gp-accent': theme.accent,
  '--gp-border': theme.border,
  '--gp-panel': theme.panel,
  '--gp-button': theme.button,
  '--gp-ink': theme.ink,
  '--gp-shade': theme.shade,
});

function seededShufflePlayers(list, seedText) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  const arr = [...list].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ThemeBrandEmblem({ themeKey }) {
  if (themeKey === 'AOT') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L4 6v6c0 5.5 3.4 9.8 8 11 4.6-1.2 8-5.5 8-11V6l-8-4z" />
        <path d="M9 11l3-3 3 3M9 15l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (themeKey === 'Naruto') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5c0 3.5 3 6.5 6.5 6.5s6.5-3 6.5-6.5" strokeLinecap="round" />
        <path d="M12 12c-3.5 0-6.5 3-6.5 6.5L3 21" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
      <path d="M14 21L17 10L24 12L31 10L34 21H14Z" fill="currentColor" />
      <ellipse cx="24" cy="21" rx="17" ry="3.5" fill="currentColor" />
      <circle cx="17.5" cy="30.5" r="5" stroke="currentColor" strokeWidth="3" />
      <circle cx="30.5" cy="30.5" r="5" stroke="currentColor" strokeWidth="3" />
      <path d="M22.5 30.5H25.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function GamePage({
  room,
  onGuess,
  onSkip,
  onLeave,
  onNextTurn,
  loading,
}) {
  // 1. Deklarasi variabel utama lebih dulu sebelum seluruh hooks
  const players = room?.players || [];
  const roomCode =
    room?.code ||
    room?.roomCode ||
    new URLSearchParams(window.location.search).get('room') ||
    room?.id ||
    'default';
  const roundNum = room?.currentRound || 1;
  const turnStorageKey = `tk_turn_step_${roomCode}_r${roundNum}`;

  const themes = room?.settings?.themes ?? [];
  const themeKey = themes.length === 1 ? normalize(themes[0]) : 'mix';
  const theme = THEMES[themeKey];

  // 2. Seluruh React Hooks ditempatkan di atas sebelum early return
  const [guess, setGuess] = useState('');
  const [localError, setLocalError] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [submittingTurn, setSubmittingTurn] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(15);
  const logRef = useRef(null);
  const prevSelfStatusRef = useRef(null);

  const [localTurnStep, setLocalTurnStep] = useState(() => {
    try {
      return Number(localStorage.getItem(turnStorageKey) || 0);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      setLocalTurnStep(Number(localStorage.getItem(turnStorageKey) || 0));
    } catch {
      setLocalTurnStep(0);
    }
  }, [turnStorageKey]);

  // Preload background tema & seluruh foto karakter pemain lain sebelum arena tampil
  useEffect(() => {
    let cancelled = false;
    setAssetsReady(false);
    setLoadProgress(15);

    const preloadRoundAssets = async () => {
      const urls = [];
      if (theme?.background) {
        urls.push(theme.background);
      }

      const otherChars = (room?.players || [])
        .filter((p) => !p.isSelf && p.roundState?.character)
        .map((p) => p.roundState.character);

      const resolvedUrls = await Promise.all(
        otherChars.map(async (char) => {
          if (char?.image) return char.image;
          try {
            return await getCharacterImageUrl(char);
          } catch {
            return null;
          }
        })
      );

      resolvedUrls.filter(Boolean).forEach((url) => urls.push(url));
      const uniqueUrls = [...new Set(urls)];

      if (uniqueUrls.length === 0) {
        if (!cancelled) {
          setLoadProgress(100);
          setAssetsReady(true);
        }
        return;
      }

      let loaded = 0;
      const stepProgress = () => {
        loaded += 1;
        if (!cancelled) {
          setLoadProgress(Math.round(20 + (loaded / uniqueUrls.length) * 80));
        }
      };

      await Promise.race([
        Promise.all(
          uniqueUrls.map(
            (src) =>
              new Promise((resolve) => {
                const img = new Image();
                img.referrerPolicy = 'no-referrer';
                img.onload = () => {
                  stepProgress();
                  resolve();
                };
                img.onerror = () => {
                  stepProgress();
                  resolve();
                };
                img.src = src;
              })
          )
        ),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);

      if (!cancelled) {
        setLoadProgress(100);
        setAssetsReady(true);
      }
    };

    preloadRoundAssets();

    return () => {
      cancelled = true;
    };
  }, [roomCode, roundNum, theme?.background]);

  const selfPlayer = players.find((p) => p.isSelf);
  const selfState = selfPlayer?.roundState;
  const selfCanStillPlay = selfState?.status === 'guessing';

  const finishedCount = players.filter(
    (p) => p.roundState && p.roundState.status !== 'guessing'
  ).length;

  const turnOrderedPlayers = useMemo(() => {
    if (Array.isArray(room?.turnOrder) && room.turnOrder.length > 0) {
      const byId = new Map(players.map((p) => [p.id, p]));
      const ordered = room.turnOrder.map((id) => byId.get(id)).filter(Boolean);
      const remaining = players.filter((p) => !room.turnOrder.includes(p.id));
      return [...ordered, ...remaining];
    }
    return seededShufflePlayers(players, `${roomCode}-round-${roundNum}`);
  }, [players, room?.turnOrder, roomCode, roundNum]);

  const activePlayers = useMemo(
    () =>
      turnOrderedPlayers.filter(
        (p) => !p.roundState || p.roundState.status === 'guessing'
      ),
    [turnOrderedPlayers]
  );

  useEffect(() => {
    if (prevSelfStatusRef.current === 'guessing' && selfState?.status === 'correct') {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.7 } });
    }
    prevSelfStatusRef.current = selfState?.status || null;
  }, [selfState?.status]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [room?.logs?.length]);

  useEffect(() => {
    setGuess('');
    setLocalError('');
    setConfirmModal(null);
  }, [roundNum]);

  // 3. Early return loading hanya setelah seluruh hooks dieksekusi
  if (!assetsReady) {
    return (
      <GameLoadingScreen
        title={`Memuat Ronde ${roundNum}...`}
        subtitle="Menyiapkan potret karakter dan latar arena agar tampil bersamaan."
        progress={loadProgress}
      />
    );
  }

  const updateLocalTurnStep = (updater) => {
    setLocalTurnStep((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(turnStorageKey, String(next));
      } catch {
        // abaikan
      }
      return next;
    });
  };

  const serverTurnPlayerId =
    room.currentTurnPlayerId ??
    room.turnPlayerId ??
    players.find((p) => p.roundState?.isTurn)?.id;

  const totalRoundSteps = (room.logs?.length || 0) + localTurnStep;
  const fallbackTurnPlayer =
    activePlayers.length > 0
      ? activePlayers[totalRoundSteps % activePlayers.length]
      : null;

  const activeTurnPlayerId = serverTurnPlayerId || fallbackTurnPlayer?.id || null;
  const activeTurnPlayer =
    players.find((p) => p.id === activeTurnPlayerId) || fallbackTurnPlayer;

  const isMyTurn = Boolean(
    selfCanStillPlay &&
      (!activeTurnPlayerId || activeTurnPlayerId === selfPlayer?.id)
  );

  const totalRounds = Math.max(1, room.settings?.rounds || 1);
  const progressPercent = Math.min(
    100,
    Math.round((roundNum / totalRounds) * 100)
  );

  const advanceTurn = async () => {
    setLocalError('');
    if (typeof onNextTurn === 'function') {
      try {
        await onNextTurn();
        return;
      } catch (err) {
        setLocalError(err.message);
        return;
      }
    }

    if (selfPlayer?.id && roomCode) {
      setSubmittingTurn(true);
      try {
        const res = await fetch(`/api/rooms/${encodeURIComponent(roomCode)}/next-turn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ playerId: selfPlayer.id }),
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.message || 'Gagal meneruskan giliran.');
        }
        return;
      } catch (err) {
        setLocalError(err.message);
        return;
      } finally {
        setSubmittingTurn(false);
      }
    }

    updateLocalTurnStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guess.trim() || !isMyTurn || loading || submittingTurn) return;
    setLocalError('');
    try {
      await onGuess(guess.trim());
      setGuess('');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleConfirmAction = async () => {
    const action = confirmModal;
    setConfirmModal(null);
    if (action === 'surrender') {
      await onSkip();
    } else if (action === 'leave') {
      await onLeave();
    }
  };

  const isBusy = loading || submittingTurn;

  return (
    <div
      className={`gp-page gp-${themeKey}`}
      style={{
        ...palette(theme),
        '--gp-image': theme.background ? `url("${theme.background}")` : 'none',
      }}
    >
      <style>{GAME_STYLES}</style>
      <main className="gp-shell">
        <header className="gp-panel gp-navbar">
          <div className="gp-brand">
            <div className="gp-brand-badge" aria-hidden="true">
              <ThemeBrandEmblem themeKey={themeKey} />
            </div>
            <div className="gp-brand-text">
              <strong>Tebak Karakter</strong>
              <span className="gp-theme-pill">
                <Sparkles size={11} />
                {theme.title}
              </span>
            </div>
          </div>

          <div className="gp-hud-center">
            <div className="gp-hud-chip gp-round-chip">
              <div className="gp-round-top">
                <span>Ronde</span>
                <b>
                  {roundNum} / {room.settings?.rounds}
                </b>
              </div>
              <div className="gp-progress-track" aria-hidden="true">
                <div
                  className="gp-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="gp-hud-chip gp-score-chip">
              <Trophy size={15} />
              <span>Skor:</span>
              <strong>{selfPlayer?.score ?? 0}</strong>
            </div>

            <div className="gp-hud-chip gp-time-chip">
              <InfinityIcon size={16} />
              <span>Bebas</span>
              <span className="gp-done-badge">
                {finishedCount}/{players.length} selesai
              </span>
            </div>
          </div>

          <button
            type="button"
            className="gp-leave-btn"
            onClick={() => setConfirmModal('leave')}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </header>

        <div className="gp-layout">
          <section className="gp-play">
            <div className="gp-cards">
              {turnOrderedPlayers.map((p) => {
                const rs = p.roundState;
                const character = p.isSelf ? null : rs?.character;
                const anime = character?.anime;
                const cardTheme =
                  themeKey === 'mix' && !p.isSelf ? THEMES[normalize(anime)] : theme;
                const status = rs?.status;
                const attemptsLeft = rs?.attemptsLeft ?? 3;
                const isCardTurn =
                  status === 'guessing' && p.id === activeTurnPlayerId;

                return (
                  <article
                    key={p.id}
                    style={palette(cardTheme)}
                    className={`gp-card ${p.isSelf ? 'gp-self' : ''} ${
                      isCardTurn ? 'gp-turn-active' : ''
                    }`}
                  >
                    <div className="gp-emblem" aria-hidden="true">
                      <CardBackEmblem
                        anime={
                          p.isSelf
                            ? themeKey === 'mix'
                              ? undefined
                              : themeKey
                            : anime
                        }
                      />
                    </div>

                    <div className="gp-card-head">
                      <div className="gp-player">
                        <strong>
                          {p.isHost && <Crown size={14} />}
                          <span>{p.isSelf ? `Kamu (${p.name})` : p.name}</span>
                        </strong>
                        <small>
                          {p.score} poin{!p.connected && ' · Offline'}
                        </small>
                      </div>

                      <div className="gp-head-right">
                        {status === 'correct' ? (
                          <span className="gp-status gp-correct">
                            <CheckCircle2 size={13} /> Benar!
                          </span>
                        ) : status === 'failed' ? (
                          <span className="gp-status gp-failed">
                            <XCircle size={13} /> Habis
                          </span>
                        ) : (
                          <>
                            <div
                              className="gp-hearts"
                              aria-label={`${attemptsLeft} percobaan tersisa`}
                            >
                              {[1, 2, 3].map((i) => (
                                <Heart
                                  key={i}
                                  size={14}
                                  className={
                                    i <= attemptsLeft
                                      ? 'gp-heart-full'
                                      : 'gp-heart-empty'
                                  }
                                />
                              ))}
                            </div>
                            {isCardTurn && (
                              <span className="gp-turn-pill">
                                <UserCheck size={11} /> Giliran
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="gp-character">
                      {p.isSelf ? (
                        <>
                          <div className="gp-mystery-box" aria-hidden="true">
                            ???
                          </div>
                          <small>Kartu Rahasiamu</small>
                        </>
                      ) : (
                        <>
                          <CharacterPortrait character={character} />
                          <strong>{character?.name || '—'}</strong>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <section className="gp-panel gp-guess">
              <div className="gp-guess-head">
                <span
                  className={`gp-turn-status-text ${
                    isMyTurn ? 'is-my-turn' : ''
                  }`}
                >
                  {selfState?.status === 'correct'
                    ? `Hebat! Kamu sudah menebak benar (+${selfState.roundScore} poin). Menunggu pemain lain...`
                    : selfState?.status === 'failed'
                    ? 'Kesempatan menebakmu habis. Menunggu pemain lain...'
                    : isMyTurn
                    ? `Giliranmu sekarang! Tebak karakter atau lanjut ke pemain berikutnya (sisa ${
                        selfState?.attemptsLeft ?? 0
                      } hati)`
                    : `Menunggu giliran ${
                        activeTurnPlayer?.name || 'pemain lain'
                      }...`}
                </span>

                {selfCanStillPlay && (
                  <button
                    type="button"
                    className="gp-skip"
                    onClick={() => setConfirmModal('surrender')}
                    disabled={isBusy}
                  >
                    <Flag size={14} /> Menyerah
                  </button>
                )}
              </div>

              {localError && (
                <p role="alert" className="gp-error">
                  <ShieldAlert
                    size={14}
                    style={{ display: 'inline', marginRight: 5 }}
                  />
                  {localError}
                </p>
              )}

              <form onSubmit={handleSubmit} className="gp-form">
                <input
                  aria-label="Nama karakter"
                  type="text"
                  maxLength={80}
                  value={guess}
                  disabled={!isMyTurn || isBusy}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={
                    !selfCanStillPlay
                      ? 'Ronde selesai untukmu'
                      : isMyTurn
                      ? 'Ketik nama karakter kamu di sini...'
                      : `Tunggu giliran ${activeTurnPlayer?.name || 'pemain lain'}...`
                  }
                />

                <div className="gp-action-group">
                  <button
                    type="submit"
                    className="gp-primary"
                    disabled={!isMyTurn || isBusy || !guess.trim()}
                  >
                    <Send size={16} /> Kirim
                  </button>

                  <button
                    type="button"
                    className="gp-next-turn-btn"
                    onClick={advanceTurn}
                    disabled={!isMyTurn || isBusy || activePlayers.length <= 1}
                    title="Lewati tebakan dan berikan giliran ke pemain berikutnya"
                  >
                    <ArrowRightCircle size={16} /> Next Player
                  </button>
                </div>
              </form>
            </section>
          </section>

          <aside className="gp-panel gp-log">
            <h3>
              <MessageSquareText size={19} /> Log Tebakan
            </h3>
            <div
              className="gp-log-scroll"
              ref={logRef}
              role="log"
              aria-live="polite"
            >
              {!room.logs?.length && (
                <div className="gp-empty">
                  <MessageSquareText size={32} />
                  <p>
                    Belum ada tebakan di ronde ini.
                    <br />
                    Tanya petunjuk ke temanmu lewat voice dulu!
                  </p>
                </div>
              )}
              {room.logs?.map((log) => (
                <div
                  key={log.id}
                  className={`gp-log-item ${
                    log.type === 'correct'
                      ? 'gp-correct'
                      : log.type === 'wrong'
                      ? 'gp-failed'
                      : ''
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {confirmModal && (
        <div
          className="gp-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmModal(null)}
        >
          <div className="gp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gp-modal-head">
              <div className="gp-modal-icon">
                <AlertTriangle size={22} />
              </div>
              <h4>
                {confirmModal === 'surrender'
                  ? 'Yakin Ingin Menyerah?'
                  : 'Keluar dari Permainan?'}
              </h4>
            </div>

            <p className="gp-modal-desc">
              {confirmModal === 'surrender'
                ? 'Jika menyerah, sisa kesempatan menebakmu di ronde ini akan hangus dan kamu mendapat 0 poin pada ronde ini.'
                : 'Kamu akan keluar dari room permainan yang sedang berlangsung. Yakin ingin keluar sekarang?'}
            </p>

            <div className="gp-modal-actions">
              <button
                type="button"
                className="gp-btn-cancel"
                onClick={() => setConfirmModal(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="gp-btn-danger"
                onClick={handleConfirmAction}
                disabled={isBusy}
              >
                {confirmModal === 'surrender' ? 'Ya, Menyerah' : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}