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

    {{-- Lógica de Tema Otimizada --}}
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "light" }}';
            const html = document.documentElement;

            const applyTheme = (isDark) => {
                html.classList.toggle('dark', isDark);
                // Opcional: Atualiza a cor da barra de navegação via JS para consistência total
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#09090b' : '#ffffff');
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