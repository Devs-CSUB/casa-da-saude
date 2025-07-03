import { ReactNode } from "react";

export interface Column {
    title: string;
    field: string;
    sortable: boolean;
    render?: (item: T) => React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
}