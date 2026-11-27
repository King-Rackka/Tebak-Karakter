import React from 'react';
import { Home, Compass } from 'lucide-react';

const NOT_FOUND_STYLES = `
.nf-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top, #1f193d 0%, #0d0a1a 65%, #070510 100%);
  color: #f4efff;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.nf-card {
  width: 100%;
  max-width: 460px;
  padding: 36px 28px;
  border-radius: 24px;
  background: rgba(24, 20, 46, 0.9);
  border: 1.5px solid rgba(157, 124, 255, 0.45);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.nf-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(248, 113, 113, 0.16);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fca5a5;
}
.nf-code {
  font-family: 'Fredoka', sans-serif;
  font-size: clamp(64px, 12vw, 88px);
  font-weight: 700;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 20%, #9d7cff 65%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nf-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}
.nf-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(244, 239, 255, 0.78);
}
.nf-btn {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 11px 22px;
  border-radius: 14px;
  border: 1px solid rgba(157, 124, 255, 0.65);
  background: linear-gradient(135deg, #6246ea, #7c3aed);
  color: #ffffff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(98, 70, 234, 0.4);
  transition: transform 0.18s ease, filter 0.18s ease;
}
.nf-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}
`;

export function NotFoundPage({ onGoHome }) {
  const handleBack = () => {
    if (typeof onGoHome === 'function') {
      onGoHome();
      return;
    }
    window.location.href = '/';
  };

  return (
    <main className="nf-page">
      <style>{NOT_FOUND_STYLES}</style>
      <div className="nf-card">
        <span className="nf-badge">
          <Compass size={13} /> Karakter Tersesat
        </span>
        <h1 className="nf-code">404</h1>
        <h2 className="nf-title">Halaman Tidak Ditemukan</h2>
        <p className="nf-desc">
          Sepertinya portal yang kamu tuju tidak ada atau kode room sudah tidak aktif.
          Kembali ke halaman utama untuk mulai bermain.
        </p>
        <button type="button" className="nf-btn" onClick={handleBack}>
          <Home size={17} /> Kembali ke Beranda
        </button>
      </div>
    </main>
  );
}