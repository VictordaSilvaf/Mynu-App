<?php

namespace App\Enums;

enum PlanType: string
{
    case FREE = 'free';
    case PRO = 'pro';
    case ENTERPRISE = 'enterprise';
}
