import React from 'react';
import { X, Mic, EyeOff, Target, Trophy } from 'lucide-react';

export function HowToPlayModal({ open, onClose }) {
    if (!open) return null;

    const steps = [
        {
            icon: EyeOff,
            title: '1. Karakter Rahasia',
            desc: 'Server membagikan 1 karakter anime acak tanpa duplikat ke tiap pemain. Kamu bisa melihat kartu semua teman, tapi kartumu sendiri tertulis ???.',
        },
        {
            icon: Mic,
            title: '2. Tanya Lewat Voice (Discord)',
            desc: 'Tanyakan petunjuk ke teman secara bergantian, misalnya: "Apakah aku dari Survey Corps?" atau "Apakah aku pengguna Sharingan?".',
        },
        {
            icon: Target,
            title: '3. Maksimal 3 Kali Tebak',
            desc: 'Ketik namamu di kolom tebak. Kamu hanya punya 3 nyawa per ronde! Jika ragu, tahan dulu tebakanmu.',
        },
        {
            icon: Trophy,
            title: '4. Sistem Poin',
            desc: 'Benar ke-1: 100 poin · Benar ke-2: 60 poin · Benar ke-3: 30 poin · Gagal/Habis waktu: 0 poin.',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="tk-surface w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/15 transition"
                    aria-label="Tutup"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="font-display text-2xl font-bold mb-1">Cara Bermain</h2>
                <p className="text-sm text-[var(--tk-muted)] mb-5">
                    Inspirasi <em>Heads Up</em> &amp; <em>Gartic.io</em> untuk mabar bareng teman.
                </p>

                <div className="space-y-3.5">
                    {steps.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex gap-3.5 p-3.5 rounded-xl bg-black/20 border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-[var(--tk-accent)]/15 text-[var(--tk-accent)] flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-base">{title}</h3>
                                <p className="text-xs sm:text-sm text-[var(--tk-muted)] leading-relaxed mt-0.5">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="tk-btn-primary w-full rounded-xl font-display font-bold text-base mt-6 cursor-pointer"
                >
                    Siap Bermain!
                </button>
            </div>
        </div>
    );
}
