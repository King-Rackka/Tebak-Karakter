import React from 'react';

/* Dekoratif: Latar Grid titik-titik + Glow ungu */
export function HomeBg() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            {/* Grid dots */}
            <div className="absolute inset-0 tk-grid-bg opacity-100" />
            {/* Glow kiri atas */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(100,80,220,0.28) 0%, transparent 70%)' }} />
            {/* Glow bawah kanan */}
            <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(80,60,200,0.22) 0%, transparent 70%)' }} />
            {/* Accent purple mid */}
            <div className="absolute top-1/2 left-1/3 w-[400px] h-[300px] rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(ellipse, #8B7CF6 0%, transparent 70%)' }} />

            {/* Stars */}
            <svg className="absolute top-16 left-1/4 opacity-50 tk-pulse" width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5Z" fill="#F4CA4E"/>
            </svg>
            <svg className="absolute top-32 right-1/3 opacity-40 tk-float" width="12" height="12" viewBox="0 0 12 12" style={{animationDelay:'0.8s'}}>
                <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#F4CA4E"/>
            </svg>
            <svg className="absolute bottom-1/3 left-16 opacity-35 tk-float" width="16" height="16" viewBox="0 0 16 16" style={{animationDelay:'1.5s'}}>
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" fill="#A88EFF"/>
            </svg>
            <svg className="absolute bottom-20 right-1/4 opacity-45 tk-pulse" width="10" height="10" viewBox="0 0 10 10" style={{animationDelay:'0.4s'}}>
                <path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75Z" fill="#F4CA4E"/>
            </svg>

            {/* Checkerboard corner kanan bawah */}
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-15" style={{
                backgroundImage: 'repeating-conic-gradient(#8B7CF6 0% 25%, transparent 0% 50%)',
                backgroundSize: '12px 12px'
            }} />
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{
                backgroundImage: 'repeating-conic-gradient(#8B7CF6 0% 25%, transparent 0% 50%)',
                backgroundSize: '10px 10px'
            }} />

            {/* Arrow decoration */}
            <svg className="absolute bottom-16 left-1/4 opacity-30 hidden lg:block" width="80" height="40" viewBox="0 0 80 40" fill="none">
                <path d="M10 30 C30 10, 50 35, 70 20" stroke="#A88EFF" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M62 14 L70 20 L64 28" stroke="#A88EFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
        </div>
    );
}

/* SVG Karakter AOT (Levi-ish: dark hair, green cloak) */
export function CharacterAOT({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body / cloak */}
            <ellipse cx="100" cy="195" rx="60" ry="55" fill="#2D4A2A"/>
            <path d="M55 160 Q40 190 50 240 L150 240 Q160 190 145 160" fill="#3A5C36"/>
            {/* Survey Corps Wing emblem */}
            <g transform="translate(72,185) scale(0.55)">
                <path d="M50 10 C30 18, 12 42, 8 70 C18 64, 30 62, 46 70 L50 110 L54 70 C70 62, 82 64, 92 70 C88 42, 70 18, 50 10Z" fill="rgba(255,255,255,0.22)" />
            </g>
            {/* Neck */}
            <rect x="88" y="130" width="24" height="28" rx="8" fill="#D4A98A"/>
            {/* Head */}
            <ellipse cx="100" cy="108" rx="38" ry="42" fill="#D4A98A"/>
            {/* Hair dark */}
            <ellipse cx="100" cy="78" rx="38" ry="20" fill="#2A2225"/>
            <path d="M62 90 Q58 80 65 72 Q72 65 80 70" fill="#2A2225"/>
            <path d="M138 90 Q142 80 135 72 Q128 65 120 70" fill="#2A2225"/>
            <path d="M75 68 Q100 55 125 68" fill="#2A2225"/>
            {/* Side swept fringe */}
            <path d="M65 90 Q62 100 65 110 L72 108" fill="#2A2225" stroke="#2A2225" strokeWidth="1"/>
            {/* Eyes */}
            <ellipse cx="87" cy="108" rx="7" ry="6" fill="#1a1a1a"/>
            <ellipse cx="113" cy="108" rx="7" ry="6" fill="#1a1a1a"/>
            <ellipse cx="87" cy="108" rx="4" ry="4" fill="#2C4E6E"/>
            <ellipse cx="113" cy="108" rx="4" ry="4" fill="#2C4E6E"/>
            <circle cx="89" cy="106" r="1.5" fill="white"/>
            <circle cx="115" cy="106" r="1.5" fill="white"/>
            {/* Serious brows */}
            <path d="M80 100 Q87 97 94 100" stroke="#2A2225" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M106 100 Q113 97 120 100" stroke="#2A2225" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            {/* Nose */}
            <path d="M100 112 L97 118 L103 118" stroke="#C09070" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            {/* Closed/neutral mouth */}
            <path d="M92 124 Q100 127 108 124" stroke="#B07860" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
    );
}

/* SVG Karakter Naruto (blonde spiky) */
export function CharacterNaruto({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body / orange jacket */}
            <ellipse cx="100" cy="195" rx="58" ry="52" fill="#E8650A"/>
            <path d="M58 158 Q42 192 52 240 L148 240 Q158 192 142 158" fill="#F07820"/>
            {/* Jacket black collar stripes */}
            <rect x="92" y="158" width="16" height="40" fill="#1A1A1A"/>
            <rect x="88" y="158" width="8" height="12" fill="#1A1A1A"/>
            <rect x="104" y="158" width="8" height="12" fill="#1A1A1A"/>
            {/* Neck */}
            <rect x="88" y="130" width="24" height="28" rx="8" fill="#F5C88A"/>
            {/* Head */}
            <ellipse cx="100" cy="108" rx="38" ry="42" fill="#F5C88A"/>
            {/* Headband */}
            <rect x="62" y="78" width="76" height="16" rx="4" fill="#2A3A5A"/>
            <rect x="78" y="81" width="44" height="10" rx="2" fill="#C8C8D8"/>
            {/* Leaf symbol */}
            <circle cx="100" cy="86" r="5" stroke="#2A3A5A" strokeWidth="1.5" fill="none"/>
            <line x1="100" y1="81" x2="100" y2="91" stroke="#2A3A5A" strokeWidth="1.2"/>
            {/* Spiky blonde hair */}
            <path d="M62 86 Q55 68 65 56 Q70 50 78 55" fill="#F4CA4E" stroke="#D4A010" strokeWidth="0.5"/>
            <path d="M73 72 Q68 54 78 48 Q85 44 90 50" fill="#F4CA4E" stroke="#D4A010" strokeWidth="0.5"/>
            <path d="M85 68 Q84 48 95 44 Q102 42 104 50" fill="#F4CA4E" stroke="#D4A010" strokeWidth="0.5"/>
            <path d="M138 86 Q145 68 135 56 Q130 50 122 55" fill="#F4CA4E" stroke="#D4A010" strokeWidth="0.5"/>
            <path d="M127 72 Q132 54 122 48 Q115 44 110 50" fill="#F4CA4E" stroke="#D4A010" strokeWidth="0.5"/>
            {/* Eyes */}
            <ellipse cx="87" cy="108" rx="7" ry="6" fill="#1a1a1a"/>
            <ellipse cx="113" cy="108" rx="7" ry="6" fill="#1a1a1a"/>
            <ellipse cx="87" cy="108" rx="4" ry="4.5" fill="#3AA0F5"/>
            <ellipse cx="113" cy="108" rx="4" ry="4.5" fill="#3AA0F5"/>
            <circle cx="89" cy="106" r="1.5" fill="white"/>
            <circle cx="115" cy="106" r="1.5" fill="white"/>
            {/* Whisker marks */}
            <line x1="68" y1="110" x2="82" y2="112" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="68" y1="116" x2="82" y2="116" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="68" y1="122" x2="82" y2="120" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="118" y1="112" x2="132" y2="110" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="118" y1="116" x2="132" y2="116" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="118" y1="120" x2="132" y2="122" stroke="#D4A060" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Happy mouth */}
            <path d="M86 122 Q100 134 114 122" stroke="#C08050" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
    );
}

/* SVG Karakter Kakashi (silver hair, mask) */
export function CharacterKakashi({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body / dark jonin vest */}
            <ellipse cx="100" cy="195" rx="58" ry="52" fill="#3A4A2E"/>
            <path d="M58 158 Q44 192 52 240 L148 240 Q156 192 142 158" fill="#4A5A3E"/>
            {/* Vest pouches detail */}
            <rect x="62" y="175" width="20" height="14" rx="3" fill="#2A3A1E"/>
            <rect x="118" y="175" width="20" height="14" rx="3" fill="#2A3A1E"/>
            {/* Neck */}
            <rect x="88" y="130" width="24" height="28" rx="8" fill="#D8C0A0"/>
            {/* Head */}
            <ellipse cx="100" cy="108" rx="38" ry="42" fill="#D8C0A0"/>
            {/* Face mask (lower half) */}
            <rect x="66" y="112" width="68" height="34" rx="10" fill="#2A2A3E"/>
            {/* Headband */}
            <rect x="62" y="78" width="76" height="16" rx="4" fill="#2A3A5A"/>
            <rect x="90" y="80" width="30" height="10" rx="2" fill="#C8C8D8"/>
            {/* Leaf symbol on headband */}
            <circle cx="105" cy="85" r="4" stroke="#2A3A5A" strokeWidth="1.2" fill="none"/>
            {/* Sharingan eye (right, covered) */}
            <path d="M62 90 Q68 86 76 90 Q70 100 62 96Z" fill="#2A2A2A" opacity="0.5"/>
            {/* Normal left eye */}
            <ellipse cx="113" cy="106" rx="8" ry="7" fill="#1a1a1a"/>
            <ellipse cx="113" cy="106" rx="5" ry="5" fill="#4A4A4A"/>
            <circle cx="115" cy="104" r="1.8" fill="white"/>
            {/* Serious brow */}
            <path d="M106 98 Q113 95 120 98" stroke="#A09080" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            {/* Silver spiky hair upward */}
            <path d="M62 86 Q60 60 72 50 Q80 44 86 54" fill="#C8C8D8"/>
            <path d="M74 76 Q70 50 84 42 Q94 38 96 52" fill="#C8C8D8"/>
            <path d="M90 70 Q92 42 104 40 Q112 38 110 54" fill="#C8C8D8"/>
            <path d="M108 72 Q118 44 128 50 Q136 58 128 72" fill="#C8C8D8"/>
            {/* Hair shading */}
            <path d="M68 86 Q66 68 76 60 Q83 52 88 60" fill="#B0B0B0" opacity="0.6"/>
        </svg>
    );
}

/* SVG Karakter Levi (mini card version - portrait style) */
export function HeroMascot({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Full body — soldier with cloak */}
            {/* Legs / boots */}
            <rect x="110" y="380" width="40" height="90" rx="8" fill="#1E2820"/>
            <rect x="168" y="380" width="40" height="90" rx="8" fill="#1E2820"/>
            <rect x="106" y="430" width="52" height="20" rx="4" fill="#2E3828"/>
            <rect x="164" y="430" width="52" height="20" rx="4" fill="#2E3828"/>
            {/* Body - ODM gear / uniform */}
            <path d="M80 220 L60 390 L150 390 L160 310 L170 390 L260 390 L240 220Z" fill="#3D5A3A"/>
            {/* Cloak */}
            <path d="M50 180 Q30 240 40 310 L80 300 L80 220Z" fill="#2A4028"/>
            <path d="M270 180 Q290 240 280 310 L240 300 L240 220Z" fill="#2A4028"/>
            <path d="M50 180 L80 220 L240 220 L270 180 Q220 150 160 155 Q100 150 50 180Z" fill="#3A5438"/>
            {/* Wing emblem on chest */}
            <g transform="translate(130,255) scale(1)">
                <path d="M30 5 C18 9, 7 24, 5 42 C12 38, 20 37, 28 42 L30 65 L32 42 C40 37, 48 38, 55 42 C53 24, 42 9, 30 5Z"
                    fill="rgba(255,255,255,0.28)" />
            </g>
            {/* Neck / lower head */}
            <rect x="140" y="170" width="40" height="52" rx="12" fill="#C8956E"/>
            {/* Head */}
            <ellipse cx="160" cy="135" rx="62" ry="68" fill="#C8956E"/>
            {/* Hair */}
            <ellipse cx="160" cy="90" rx="62" ry="30" fill="#1E1A20"/>
            <path d="M98 118 Q94 100 102 88 Q112 78 125 86" fill="#1E1A20"/>
            <path d="M222 118 Q226 100 218 88 Q208 78 195 86" fill="#1E1A20"/>
            {/* Fringe swoosh */}
            <path d="M100 118 Q96 132 100 148 L118 143" fill="#1E1A20"/>
            {/* Eyes */}
            <ellipse cx="140" cy="136" rx="12" ry="10" fill="#1A1A1A"/>
            <ellipse cx="180" cy="136" rx="12" ry="10" fill="#1A1A1A"/>
            <ellipse cx="140" cy="136" rx="8" ry="8" fill="#2C4E6E"/>
            <ellipse cx="180" cy="136" rx="8" ry="8" fill="#2C4E6E"/>
            <circle cx="143" cy="132" r="2.5" fill="white"/>
            <circle cx="183" cy="132" r="2.5" fill="white"/>
            {/* Serious brows */}
            <path d="M128 123 Q140 118 152 123" stroke="#1E1A20" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M168 123 Q180 118 192 123" stroke="#1E1A20" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            {/* Nose */}
            <path d="M160 148 L155 158 L165 158" stroke="#A07050" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Slight frown */}
            <path d="M148 168 Q160 164 172 168" stroke="#A07050" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* Arms */}
            <rect x="62" y="220" width="30" height="100" rx="10" fill="#3D5A3A"/>
            <rect x="228" y="220" width="30" height="100" rx="10" fill="#3D5A3A"/>
            <ellipse cx="77" cy="326" rx="16" ry="14" fill="#C8956E"/>
            <ellipse cx="243" cy="326" rx="16" ry="14" fill="#C8956E"/>
        </svg>
    );
}

/* Background decorations khas scrapbook purple untuk Setup Room */
export function SetupBg() {
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 tk-grid-bg opacity-100" />
            <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(100,80,220,0.25) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(80,55,200,0.22) 0%, transparent 70%)' }} />
            {/* Checkerboard corner */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20" style={{
                backgroundImage: 'repeating-conic-gradient(#8B7CF6 0% 25%, transparent 0% 50%)',
                backgroundSize: '14px 14px'
            }}/>
            {/* Sparkles */}
            <svg className="absolute top-20 right-1/4 opacity-50 tk-float" width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 1L11 7L17 9L11 11L9 17L7 11L1 9L7 7Z" fill="#F4CA4E"/>
            </svg>
            <svg className="absolute bottom-32 left-24 opacity-35 tk-pulse" width="12" height="12" viewBox="0 0 12 12" style={{animationDelay:'1s'}}>
                <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#A88EFF"/>
            </svg>
        </div>
    );
}

/* Theme-aware grid background (used in MainApp) */
export function ThemePattern({ theme = 'Netral' }) {
    const themeClasses = {
        AOT: 'data-[theme=AOT]',
        Naruto: 'data-[theme=Naruto]',
        Campur: 'data-[theme=Campur]',
    };
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 tk-grid-bg opacity-100" />
        </div>
    );
}

/* Small emblem on card back (wing/leaf symbol per anime) */
export function CardBackEmblem({ anime }) {
    if (anime === 'AOT') {
        return (
            <svg className="w-10 h-10 opacity-30" viewBox="0 0 50 50" fill="none">
                <path d="M25 5 C15 9, 7 24, 5 42 C12 38, 20 37, 28 42 L25 65 L22 42 C14 37, 6 38, 3 42 C5 24, 13 9, 25 5Z" stroke="#C9B58A" strokeWidth="1.5" fill="none"/>
            </svg>
        );
    }
    if (anime === 'Naruto') {
        return (
            <svg className="w-10 h-10 opacity-30" viewBox="0 0 50 50" fill="none">
                <circle cx="25" cy="25" r="12" stroke="#F57C00" strokeWidth="1.5" fill="none"/>
                <line x1="25" y1="13" x2="25" y2="37" stroke="#F57C00" strokeWidth="1.2"/>
            </svg>
        );
    }
    return (
        <svg className="w-10 h-10 opacity-30" viewBox="0 0 50 50" fill="none">
            <circle cx="25" cy="25" r="12" stroke="#8B7CF6" strokeWidth="1.5" fill="none"/>
        </svg>
    );
}
