import AppLogo from '@/components/app-logo';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleHeaderLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background flex flex-col min-h-screen">
            {/* Barra Superior */}
            <div className="w-full bg-background border-b shadow">
                <div className="h-[80px] mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
                    {/* Logo no lado esquerdo */}
                    <Link href={route('home')} className="flex items-center gap-2 font-medium">
                        <AppLogo className="w-40 dark:brightness-[10000%]" />
                        <span className="sr-only">{title}</span>
                    </Link>

                    {/* Appearance Dropdown no lado direito */}
                    <AppearanceToggleDropdown />
                </div>
            </div>

            {/* Conteúdo Central */}
            <div className="flex flex-1 flex-col items-center w-full max-w-xl px-6 pb-6 mt-[60px] mx-auto">
                <div className="flex flex-col gap-8 w-full">
                    <div className="flex flex-col items-center gap-4">
                        {/* Título e descrição centralizados */}
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-sm">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
