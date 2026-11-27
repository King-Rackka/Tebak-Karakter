import React from 'react';
import { Home, HelpCircle, Info, Settings } from 'lucide-react';

export function DetectiveLogo({ className = 'w-9 h-9' }) {
    return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0`}>
            <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                {/* Detective Hat */}
                <path d="M9 17L12 9.5C12.4 8.6 13.4 8.2 14.3 8.5L18 9.8L21.7 8.5C22.6 8.2 23.6 8.6 24 9.5L27 17H9Z" fill="white" />
                <rect x="6" y="16.5" width="24" height="2.6" rx="1.3" fill="white" />
                {/* Glasses */}
                <circle cx="13.5" cy="24" r="3.4" stroke="white" strokeWidth="2.1" />
                <circle cx="22.5" cy="24" r="3.4" stroke="white" strokeWidth="2.1" />
                <path d="M16.9 24H19.1" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
        </div>
    );
}

export function Navbar({ activeTab, onGoHome, onOpenHowToPlay, onOpenAbout }) {
    return (
        <header className="sticky top-0 z-30 w-full bg-[#141028]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <button
                    type="button"
                    onClick={onGoHome}
                    className="flex items-center gap-2.5 cursor-pointer group"
                >
                    <DetectiveLogo />
                    <div className="font-display font-bold text-lg sm:text-xl leading-none text-left">
                        <span className="text-white block sm:inline">Tebak </span>
                        <span className="text-[#9D8BFF]">Karakter</span>
                    </div>
                </button>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 sm:gap-4">
                    <button
                        type="button"
                        onClick={onGoHome}
                        className={`relative px-3 py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition cursor-pointer ${
                            activeTab === 'home' ? 'text-white' : 'text-[#A8A3C7] hover:text-white'
                        }`}
                    >
                        <Home className="w-4 h-4 text-[#9D8BFF]" />
                        <span>Beranda</span>
                        {activeTab === 'home' && (
                            <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#8B7CF6]" />
                        )}
                    </button>

                    {activeTab === 'setup' ? (
                        <span className="relative px-3 py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 text-white">
                            <Settings className="w-4 h-4 text-[#9D8BFF]" />
                            <span>Setup Room</span>
                            <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#8B7CF6]" />
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={onOpenHowToPlay}
                            className="px-3 py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 text-[#A8A3C7] hover:text-white transition cursor-pointer"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Cara Main</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onOpenAbout}
                        className="px-3 py-2 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 text-[#A8A3C7] hover:text-white transition cursor-pointer"
                    >
                        <Info className="w-4 h-4" />
                        <span className="hidden xs:inline sm:inline">Tentang</span>
                    </button>
                </nav>
            </div>
        </header>
    );
}
