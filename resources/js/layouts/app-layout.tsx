import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Toaster } from "sonner";
import { useEffect, type ReactNode } from 'react';
import { Appearance } from '@/hooks/use-appearance';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const sharedDara = usePage<SharedData>().props;
    const { toast } = useToast();

    useEffect(() => {
        if (sharedDara.flash?.title || sharedDara.flash?.message) {
            toast({
                type: sharedDara.flash.type ?? "success",
                title: sharedDara.flash.title,
                description: sharedDara.flash.message
            });
        }
    }, [sharedDara.flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster richColors position="top-right" theme={localStorage.getItem('appearance') as Appearance || 'system'} />
        </AppLayoutTemplate>
    );
}
