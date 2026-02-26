<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

    {{-- Customização de Branding para Mobile --}}
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)">

    <title>Cardápio Digital com QR Code | Mynu</title>
    <meta name="description"
        content="Crie seu cardápio digital com QR Code em minutos. Ideal para restaurantes, bares e lanchonetes. Comece grátis.">

    <!-- Canonical -->
    <link rel="canonical" href="https://mynu.com.br" />

    <!-- Robots -->
    <meta name="robots" content="index, follow, max-image-preview:large" />

    <!-- Idioma -->
    <meta http-equiv="content-language" content="pt-BR" />

    <!-- Autor (branding) -->
    <meta name="author" content="Mynu" />

    <!-- Keywords (baixo peso, mas ok usar 3 a 5) -->
    <meta name="keywords" content="cardápio digital, cardápio qr code, menu digital restaurante, cardápio online" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Mynu" />
    <meta property="og:title" content="Cardápio Digital com QR Code | Mynu" />
    <meta property="og:description"
        content="Crie seu cardápio digital com QR Code em minutos. Ideal para restaurantes, bares e lanchonetes." />
    <meta property="og:url" content="https://mynu.com.br" />
    <meta property="og:image" content="https://mynu.com.br/og-image.png" />
    <meta property="og:locale" content="pt_BR" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Cardápio Digital com QR Code | Mynu" />
    <meta name="twitter:description"
        content="Cardápio digital moderno para restaurantes. QR Code, rápido e sem custo inicial." />
    <meta name="twitter:image" content="https://mynu.com.br/og-image.png" />

    <meta name="application-name" content="Mynu" />
    <meta name="apple-mobile-web-app-title" content="Mynu" />
    <meta name="format-detection" content="telephone=no" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    {{-- Lógica de Tema Otimizada --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'light' }}';
            const html = document.documentElement;

            const applyTheme = (isDark) => {
                html.classList.toggle('dark', isDark);
                // Opcional: Atualiza a cor da barra de navegação via JS para consistência total
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#09090b' :
                    '#ffffff');
            };

            if (appearance === 'system') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                applyTheme(mediaQuery.matches);
            } else {
                applyTheme(appearance === 'dark');
            }
        })();
    </script>

    {{-- CSS Crítico: Background e Smooth Transitions --}}
    <style>
        /* Cores base para evitar flash de tela branca */
        :root {
            --bg-light: oklch(1 0 0);
            --bg-dark: oklch(0.145 0 0);
        }

        html {
            background-color: var(--bg-light);
            transition: background-color 0.3s ease;
            scroll-behavior: smooth;
        }

        html.dark {
            background-color: var(--bg-dark);
        }

        /* Melhoria na renderização de fontes */
        body {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Esconder scrollbar mantendo funcionalidade (Opcional - visual limpo) */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
    </style>

    <title inertia>{{ config('app.name', 'Mynu') }}</title>

    {{-- Favicons Modernos --}}
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-29Y2BL66CR"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-29Y2BL66CR');
    </script>

    {{-- Fontes: Trocando por uma combinação mais Premium (Inter + Instrument) --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|instrument-sans:600,700" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
