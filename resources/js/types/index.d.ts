import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
  roles: string[];
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  roles?: {
    id: number;
    name: string;
  }[];
  [key: string]: unknown; // This allows for additional properties...
}

export type MenuItem = {
  id: string
  name: string
  description?: string
  price: number
  quantityAvailable?: number
  isAvailable: boolean

  // mídia
  imageUrl?: string
  model3dUrl?: string

  // categorização
  category?: string
  tags?: string[]

  // controle
  createdAt: string
  updatedAt: string
}

export type MenuCategory = {
  id: string
  name: string
  description?: string
  order: number
}

export type Menu = {
  id: string
  name: string
  isActive: boolean

  categories?: MenuCategory[]
  items: number

  createdAt: string
  updatedAt: string
}

export type OrderItem = {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  total: number
}

export type Order = {
  id: string
  items: OrderItem[]
  subtotal: number
  serviceFee?: number
  total: number

  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"

  createdAt: string
}

export type Payment = {
  id: string
  orderId: string
  amount: number

  method: "pix" | "credit_card" | "debit_card"
  status: "pending" | "processing" | "paid" | "failed"

  paidAt?: string
  createdAt: string
}

export type BillingInterval = 'month' | 'year';
export type Currency = 'BRL';

export type FeatureIcon = "check" | "sparkles" | "chart" | "users" | "headphones" | "layers" | "qr" | "image" | "palette";

export type Feature = { text: string; icon?: FeatureIcon } | string;

export interface Plan {
  isPopular?: boolean;
  name: string;
  description?: string;
  price_id: string | null;

  monthlyPrice?: number;
  yearlyPrice?: number;
  price?: number;

  currency: Currency;
  interval: BillingInterval;

  features: Feature[];

  isFree?: boolean;

  priceNote?: string;
  buttonText?: string;
  buttonLink?: string;
}

export type PlanKey = 'free' | 'pro' | 'enterprise';

export type PlansMap = Record<PlanKey, Plan>;

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

