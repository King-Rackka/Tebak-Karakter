import React from 'react';
import { X, Sparkles, ShieldCheck, Users } from 'lucide-react';

export function AboutModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="tk-surface w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/15 transition"
                    aria-label="Tutup"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="font-display text-2xl font-bold mb-1">Tentang Tebak Karakter</h2>
                <p className="text-sm text-[var(--tk-muted)] mb-5">
                    Web game multiplayer ringan untuk mabar bareng teman di Discord tanpa perlu login.
                </p>

                <div className="space-y-3 text-sm">
                    <div className="flex gap-3 p-3 rounded-xl bg-black/25 border border-white/10">
                        <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold">227+ Karakter Anime</div>
                            <p className="text-xs text-[var(--tk-muted)] mt-0.5">
                                Tersedia karakter dari Attack on Titan &amp; Naruto dengan tingkat kesulitan Easy, Medium, dan Hard.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-xl bg-black/25 border border-white/10">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold">Anti-Intip &amp; Filter Spoiler</div>
                            <p className="text-xs text-[var(--tk-muted)] mt-0.5">
                                Server tidak pernah mengirim karakter milikmu sendiri ke browser, plus opsi menyembunyikan karakter spoiler.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-xl bg-black/25 border border-white/10">
                        <Users className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold">Main Santai (2–8 Pemain)</div>
                            <p className="text-xs text-[var(--tk-muted)] mt-0.5">
                                Waktu bebas tanpa timer — cocok untuk ngobrol santai lewat voice chat.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="tk-btn-primary w-full rounded-xl font-display font-bold text-base mt-6 cursor-pointer"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
