import React from 'react';
import { Sparkles } from 'lucide-react';

const LOADING_STYLES = `
.gls-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top, #1f193d 0%, #0d0a1a 65%, #070510 100%);
  color: #f4efff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  animation: glsFadeIn 0.2s ease-out;
}
.gls-card {
  width: 100%;
  max-width: 440px;
  padding: 32px 28px;
  border-radius: 24px;
  background: rgba(24, 20, 46, 0.88);
  border: 1.5px solid rgba(157, 124, 255, 0.42);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.gls-emblem-wrap {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 22px;
  background: rgba(157, 124, 255, 0.14);
  border: 2px dashed #9d7cff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #c4b5fd;
  animation: glsFloat 2s ease-in-out infinite;
}
.gls-ring {
  position: absolute;
  inset: -8px;
  border-radius: 28px;
  border: 2px solid transparent;
  border-top-color: #22d3ee;
  border-right-color: #9d7cff;
  animation: glsSpin 1.2s linear infinite;
}
.gls-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}
.gls-subtitle {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(244, 239, 255, 0.78);
}
.gls-bar-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}
.gls-bar-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}
.gls-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #9d7cff, #22d3ee);
  transition: width 0.25s ease;
}
.gls-bar-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  font-weight: 700;
  color: #a5b4fc;
}

@keyframes glsSpin {
  to { transform: rotate(360deg); }
}
@keyframes glsFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes glsFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

export function GameLoadingScreen({
  title = 'Menyiapkan Arena...',
  subtitle = 'Memuat potret karakter dan arena permainan agar siap dimainkan.',
  progress = null,
}) {
  const pct = typeof progress === 'number' ? Math.max(5, Math.min(100, progress)) : null;

  return (
    <div className="gls-overlay" role="status" aria-live="polite">
      <style>{LOADING_STYLES}</style>
      <div className="gls-card">
        <div className="gls-emblem-wrap" aria-hidden="true">
          <div className="gls-ring" />
          <span>???</span>
        </div>

        <div>
          <h2 className="gls-title">{title}</h2>
          <p className="gls-subtitle">{subtitle}</p>
        </div>

        {pct !== null && (
          <div className="gls-bar-wrap">
            <div className="gls-bar-track">
              <div className="gls-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="gls-bar-meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} /> Sinkronisasi aset
              </span>
              <span>{pct}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}