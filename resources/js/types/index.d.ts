import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { Role } from "./models";

export interface User {
    id: number;
    area_id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
    image_path?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    restored_at?: string;
    roles?: Role[];
}

export interface Auth {
    user: User;
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
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash?: { type: 'success' | 'warning' | 'error' | null; title: string; message: string }; // Flash message
    [key: string]: unknown;
}

export interface PaginatedLinks {
    first: string;
    last: string;
    next: string;
    prev: string;
};

export interface PaginatedMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
};

export interface Paginated<T> {
    data: T[];
    links: PaginatedLinks;
    meta: PaginatedMeta;
}
