<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Subscription Plans
    |--------------------------------------------------------------------------
    |
    | Define os planos de assinatura disponíveis no Mynu.
    | Os price_id devem corresponder aos IDs criados no Stripe Dashboard.
    |
    */

    'plans' => [
        'free' => [
            'name' => 'Free',
            'description' => 'Comece gratuitamente',
            'price_id' => env('STRIPE_PRICE_FREE', ''),
            'monthlyPrice' => 0,
            'yearlyPrice' => 0,
            'currency' => 'BRL',
            'interval' => 'month',
            'features' => [
                ['text' => '1 cardápio digital', 'icon' => 'check'],
                ['text' => 'Até 20 itens no menu', 'icon' => 'check'],
                ['text' => 'Suporte por email', 'icon' => 'headphones'],
                ['text' => 'Templates básicos', 'icon' => 'palette'],
            ],
            'isFree' => true,
            'buttonText' => 'Começar Agora',
            'buttonLink' => '/login',
        ],

        'pro' => [
            'isPopular' => true,
            'name' => 'Pro',
            'description' => 'Ideal para negócios em crescimento',
            'price_id' => env('STRIPE_PRICE_PRO', 'price_pro'),
            'monthlyPrice' => 29.90,
            'yearlyPrice' => 359.88,
            'currency' => 'BRL',
            'interval' => 'month',
            'features' => [
                ['text' => '5 cardápios digitais', 'icon' => 'layers'],
                ['text' => 'Itens ilimitados no menu', 'icon' => 'check'],
                ['text' => 'Suporte prioritário', 'icon' => 'headphones'],
                ['text' => 'Templates premium', 'icon' => 'palette'],
                ['text' => 'QR Code personalizado', 'icon' => 'qr'],
                ['text' => 'Analytics básico', 'icon' => 'chart'],
            ],
            'isFree' => false,
            'buttonText' => 'Escolher Pro',
        ],

        'enterprise' => [
            'name' => 'Enterprise',
            'description' => 'Para grandes operações',
            'price_id' => env('STRIPE_PRICE_ENTERPRISE', 'price_enterprise'),
            'monthlyPrice' => 99.90,
            'yearlyPrice' => 1079.88,
            'currency' => 'BRL',
            'interval' => 'month',
            'features' => [
                ['text' => 'Cardápios ilimitados', 'icon' => 'sparkles'],
                ['text' => 'Itens ilimitados no menu', 'icon' => 'check'],
                ['text' => 'Suporte 24/7', 'icon' => 'headphones'],
                ['text' => 'Templates personalizados', 'icon' => 'image'],
                ['text' => 'QR Code personalizado', 'icon' => 'qr'],
                ['text' => 'Analytics avançado', 'icon' => 'chart'],
                ['text' => 'API access', 'icon' => 'sparkles'],
                ['text' => 'White-label', 'icon' => 'palette'],
                ['text' => 'Múltiplos usuários', 'icon' => 'users'],
            ],
            'isFree' => false,
            'buttonText' => 'Contatar Vendas',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Trial Period
    |--------------------------------------------------------------------------
    |
    | Define o período de trial para novos assinantes (em dias).
    |
    */

    'trial_days' => env('SUBSCRIPTION_TRIAL_DAYS', 14),

    /*
    |--------------------------------------------------------------------------
    | Grace Period
    |--------------------------------------------------------------------------
    |
    | Define o período de grace após cancelamento (em dias).
    |
    */

    'grace_days' => env('SUBSCRIPTION_GRACE_DAYS', 3),
];
