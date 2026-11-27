<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Judul & Deskripsi Utama -->
    <title>Tebak Karakter — Game Tebak Karakter Anime Multiplayer</title>
    <meta name="description" content="Main bareng teman secara real-time! Pancing petunjuk lewat obrolan, kumpulkan poin, dan tebak siapa karakter anime rahasia di kartumu dari Attack on Titan & Naruto.">
    <meta name="theme-color" content="#141222">

    <!-- Favicon Tab Browser -->
    <link rel="icon" type="image/png" href="{{ asset('images/logo-tebak-karakter.png') }}">
    <link rel="apple-touch-icon" href="{{ asset('images/logo-tebak-karakter.png') }}">

    <!-- Open Graph / Preview WhatsApp, Discord, Telegram -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Tebak Karakter">
    <meta property="og:title" content="Tebak Karakter — Game Multiplayer Anime">
    <meta property="og:description" content="Adu insting bareng teman! Tebak karakter anime rahasia di kartumu lewat petunjuk obrolan dari dunia Attack on Titan & Naruto.">
    <meta property="og:url" content="https://tebak-karakter-tau.vercel.app/">
    <meta property="og:image" content="https://tebak-karakter-tau.vercel.app/images/logo-tebak-karakter.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="512">
    <meta property="og:image:height" content="512">

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Tebak Karakter — Game Multiplayer Anime">
    <meta name="twitter:description" content="Adu insting bareng teman! Tebak karakter anime rahasia di kartumu lewat petunjuk obrolan dari dunia Attack on Titan & Naruto.">
    <meta name="twitter:image" content="https://tebak-karakter-tau.vercel.app/images/logo-tebak-karakter.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="antialiased selection:bg-violet-500/30">
    <div id="root"></div>
</body>
</html>
